import { insightService } from '@/services/insights';

const DAY_MS = 86400000;
const WEEK_MS = 7 * DAY_MS;

export function computeIndicators(logs, profile) {
  const sorted = [...logs].sort((a, b) => new Date(a.log_date) - new Date(b.log_date));

  const cycleStarts = sorted.filter(l => l.cycle_started).map(l => l.log_date);
  const cycleIntervals = [];
  for (let i = 1; i < cycleStarts.length; i++) {
    const days = Math.round((new Date(cycleStarts[i]) - new Date(cycleStarts[i - 1])) / DAY_MS);
    cycleIntervals.push(days);
  }
  const avgCycleLength = cycleIntervals.length > 0
    ? Math.round(cycleIntervals.reduce((a, b) => a + b, 0) / cycleIntervals.length)
    : null;
  const irregularCycles = cycleIntervals.filter(d => d < 21 || d > 35).length;

  const n = sorted.length;
  const acneAvg = n > 0 ? sorted.reduce((a, l) => a + (l.acne_severity || 0), 0) / n : 0;
  const facialHairCount = sorted.filter(l => l.facial_hair_growth).length;
  const hairThinningCount = sorted.filter(l => l.hair_thinning).length;
  const pelvicPainCount = sorted.filter(l => l.pelvic_pain).length;
  const moodAvg = n > 0 ? sorted.reduce((a, l) => a + (l.mood || 3), 0) / n : 3;
  const sleepAvg = n > 0 ? sorted.reduce((a, l) => a + (l.sleep_quality || 3), 0) / n : 3;
  const cravingsAvg = n > 0 ? sorted.reduce((a, l) => a + (l.cravings_intensity || 0), 0) / n : 0;

  return {
    totalLogs: n,
    cycleIntervals,
    avgCycleLength,
    irregularCycles,
    totalCycles: cycleIntervals.length,
    acneAvg,
    facialHairFrequency: n > 0 ? facialHairCount / n : 0,
    hairThinningFrequency: n > 0 ? hairThinningCount / n : 0,
    pelvicPainFrequency: n > 0 ? pelvicPainCount / n : 0,
    moodAvg,
    sleepAvg,
    cravingsAvg,
    hasUltrasoundFinding: profile?.has_ultrasound_finding || false,
    dateRange: n > 0 ? { start: sorted[0].log_date, end: sorted[n - 1].log_date } : null,
  };
}

function getWeekIndex(dateStr) {
  return Math.floor(new Date(dateStr).getTime() / WEEK_MS);
}

export function checkRedFlags(logs, profile) {
  const sorted = [...logs].sort((a, b) => new Date(a.log_date) - new Date(b.log_date));
  const today = new Date();
  const reasons = [];

  const cycleStarts = sorted.filter(l => l.cycle_started);
  let lastCycleDate = null;
  if (cycleStarts.length > 0) {
    lastCycleDate = new Date(cycleStarts[cycleStarts.length - 1].log_date);
  } else if (sorted.length > 0) {
    lastCycleDate = new Date(sorted[0].log_date);
  }
  if (lastCycleDate) {
    const daysSinceLastCycle = Math.floor((today - lastCycleDate) / DAY_MS);
    if (daysSinceLastCycle >= 90) {
      const hasAndrogen = sorted.some(l => l.facial_hair_growth || (l.acne_severity || 0) >= 4);
      if (hasAndrogen) {
        reasons.push('You have not logged a period start in over 90 days and have also logged androgen-related symptoms (facial hair growth or severe acne). This combination is worth discussing with a doctor.');
      }
    }
  }

  const severePainLogs = sorted.filter(l => l.pelvic_pain && (l.pelvic_pain_severity || 0) >= 4);
  if (severePainLogs.length >= 3) {
    for (let i = 0; i <= severePainLogs.length - 3; i++) {
      const windowStart = new Date(severePainLogs[i].log_date);
      const windowEnd = new Date(windowStart.getTime() + 14 * DAY_MS);
      const countInWindow = severePainLogs.filter(l => {
        const d = new Date(l.log_date);
        return d >= windowStart && d <= windowEnd;
      }).length;
      if (countInWindow >= 3) {
        reasons.push('You have logged severe pelvic pain three or more times within a two-week window. This pattern should be evaluated by a doctor.');
        break;
      }
    }
  }

  const weekMap = {};
  sorted.forEach(l => {
    const idx = getWeekIndex(l.log_date);
    if (!weekMap[idx]) weekMap[idx] = [];
    weekMap[idx].push(l);
  });
  const weekIndices = Object.keys(weekMap).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < weekIndices.length - 1; i++) {
    if (weekIndices[i + 1] !== weekIndices[i] + 1) continue;
    const w1 = weekMap[weekIndices[i]];
    const w2 = weekMap[weekIndices[i + 1]];
    const w1Weight = w1.some(l => l.weight_change === 'up' || l.weight_change === 'down');
    const w2Weight = w2.some(l => l.weight_change === 'up' || l.weight_change === 'down');
    const w1LowMood = w1.some(l => (l.mood || 3) <= 2);
    const w2LowMood = w2.some(l => (l.mood || 3) <= 2);
    if (w1Weight && w2Weight && w1LowMood && w2LowMood) {
      reasons.push("You have reported noticeable weight changes alongside low mood over two or more consecutive weeks. This combination is worth bringing to a doctor's attention.");
      break;
    }
  }

  return reasons.length > 0 ? reasons : null;
}

export function computeWeeklyComparison(logs) {
  const sorted = [...logs].sort((a, b) => new Date(a.log_date) - new Date(b.log_date));
  if (sorted.length === 0) return null;

  const weekMap = {};
  sorted.forEach(l => {
    const idx = getWeekIndex(l.log_date);
    if (!weekMap[idx]) weekMap[idx] = [];
    weekMap[idx].push(l);
  });

  const weekIndices = Object.keys(weekMap).map(Number).sort((a, b) => a - b);
  if (weekIndices.length < 2) return null;
  if (weekIndices[weekIndices.length - 1] !== weekIndices[weekIndices.length - 2] + 1) return null;

  const currentWeek = weekMap[weekIndices[weekIndices.length - 1]];
  const prevWeek = weekMap[weekIndices[weekIndices.length - 2]];

  const avg = (arr, field) => arr.length > 0 ? arr.reduce((a, l) => a + (l[field] || 0), 0) / arr.length : 0;
  const pct = (arr, fn) => arr.length > 0 ? Math.round(fn(arr) / arr.length * 100) : 0;

  const changes = [];

  const moodDelta = avg(currentWeek, 'mood') - avg(prevWeek, 'mood');
  if (Math.abs(moodDelta) >= 0.5) {
    changes.push(`Mood ${moodDelta > 0 ? 'improved' : 'declined'} from ${avg(prevWeek, 'mood').toFixed(1)} to ${avg(currentWeek, 'mood').toFixed(1)} out of 5 — ${moodDelta > 0 ? 'a positive sign for emotional wellbeing.' : 'worth keeping an eye on if it persists.'}`);
  }

  const sleepDelta = avg(currentWeek, 'sleep_quality') - avg(prevWeek, 'sleep_quality');
  if (Math.abs(sleepDelta) >= 0.5) {
    changes.push(`Sleep quality ${sleepDelta > 0 ? 'improved' : 'worsened'} from ${avg(prevWeek, 'sleep_quality').toFixed(1)} to ${avg(currentWeek, 'sleep_quality').toFixed(1)} out of 5 — ${sleepDelta > 0 ? 'better sleep can positively support hormone balance.' : 'poor sleep can amplify cravings and mood swings.'}`);
  }

  const acneDelta = avg(currentWeek, 'acne_severity') - avg(prevWeek, 'acne_severity');
  if (Math.abs(acneDelta) >= 1) {
    changes.push(`Acne severity ${acneDelta > 0 ? 'increased' : 'decreased'} from ${avg(prevWeek, 'acne_severity').toFixed(1)} to ${avg(currentWeek, 'acne_severity').toFixed(1)} out of 5 — ${acneDelta > 0 ? 'may indicate hormonal fluctuation.' : 'a good sign if it continues.'}`);
  }

  const currFacialHair = pct(currentWeek, arr => arr.filter(l => l.facial_hair_growth).length);
  const prevFacialHair = pct(prevWeek, arr => arr.filter(l => l.facial_hair_growth).length);
  if (Math.abs(currFacialHair - prevFacialHair) >= 20) {
    changes.push(`Facial hair growth logged in ${currFacialHair}% vs ${prevFacialHair}% of entries — ${currFacialHair > prevFacialHair ? 'an increase in androgen-related symptoms this week.' : 'a decrease in androgen-related symptoms this week.'}`);
  }

  const currPelvicPain = pct(currentWeek, arr => arr.filter(l => l.pelvic_pain).length);
  const prevPelvicPain = pct(prevWeek, arr => arr.filter(l => l.pelvic_pain).length);
  if (Math.abs(currPelvicPain - prevPelvicPain) >= 20) {
    changes.push(`Pelvic pain frequency changed from ${prevPelvicPain}% to ${currPelvicPain}% of entries — ${currPelvicPain > prevPelvicPain ? 'more frequent pain episodes this week.' : 'less pain this week.'}`);
  }

  if (changes.length === 0) {
    return 'Your symptoms have been relatively stable compared to last week — consistency can be a good sign. Keep logging to catch any changes early.';
  }

  return changes.join(' ');
}

// Delegates to the backend which runs the LLM call
export async function generateInsight() {
  return insightService.generate();
}
