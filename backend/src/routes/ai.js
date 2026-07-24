const express = require('express');
const SymptomLog = require('../models/symptomLog');
const UserProfile = require('../models/userProfile');
const Insight = require('../models/insight');
const requireAuth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const cache = require('../services/cache');
const { validate, aiInsightSchema } = require('../middleware/validate');

const router = express.Router();

router.use(requireAuth);

// ─── Helpers (ported from src/lib/insightEngine.js) ──────────────────────────

const DAY_MS = 86400000;
const WEEK_MS = 7 * DAY_MS;

function toSnake(doc) {
  return {
    log_date: doc.logDate,
    cycle_started: doc.cycleStarted,
    cycle_ended: doc.cycleEnded,
    acne_severity: doc.acneSeverity,
    facial_hair_growth: doc.facialHairGrowth,
    hair_thinning: doc.hairThinning,
    weight_change: doc.weightChange,
    mood: doc.mood,
    sleep_quality: doc.sleepQuality,
    pelvic_pain: doc.pelvicPain,
    pelvic_pain_severity: doc.pelvicPainSeverity,
    cravings_intensity: doc.cravingsIntensity,
  };
}

function computeIndicators(logs, profile) {
  const sorted = [...logs].sort((a, b) => new Date(a.log_date) - new Date(b.log_date));
  const cycleStarts = sorted.filter(l => l.cycle_started).map(l => l.log_date);
  const cycleIntervals = [];
  for (let i = 1; i < cycleStarts.length; i++) {
    cycleIntervals.push(Math.round((new Date(cycleStarts[i]) - new Date(cycleStarts[i - 1])) / DAY_MS));
  }
  const n = sorted.length;
  return {
    totalLogs: n,
    cycleIntervals,
    avgCycleLength: cycleIntervals.length > 0
      ? Math.round(cycleIntervals.reduce((a, b) => a + b, 0) / cycleIntervals.length)
      : null,
    irregularCycles: cycleIntervals.filter(d => d < 21 || d > 35).length,
    totalCycles: cycleIntervals.length,
    acneAvg: n > 0 ? sorted.reduce((a, l) => a + (l.acne_severity || 0), 0) / n : 0,
    facialHairFrequency: n > 0 ? sorted.filter(l => l.facial_hair_growth).length / n : 0,
    hairThinningFrequency: n > 0 ? sorted.filter(l => l.hair_thinning).length / n : 0,
    pelvicPainFrequency: n > 0 ? sorted.filter(l => l.pelvic_pain).length / n : 0,
    moodAvg: n > 0 ? sorted.reduce((a, l) => a + (l.mood || 3), 0) / n : 3,
    sleepAvg: n > 0 ? sorted.reduce((a, l) => a + (l.sleep_quality || 3), 0) / n : 3,
    cravingsAvg: n > 0 ? sorted.reduce((a, l) => a + (l.cravings_intensity || 0), 0) / n : 0,
    hasUltrasoundFinding: profile?.hasUltrasoundFinding || false,
    dateRange: n > 0 ? { start: sorted[0].log_date, end: sorted[n - 1].log_date } : null,
  };
}

function checkRedFlags(logs) {
  const sorted = [...logs].sort((a, b) => new Date(a.log_date) - new Date(b.log_date));
  const today = new Date();
  const reasons = [];

  const cycleStarts = sorted.filter(l => l.cycle_started);
  let lastCycleDate = cycleStarts.length > 0
    ? new Date(cycleStarts[cycleStarts.length - 1].log_date)
    : sorted.length > 0 ? new Date(sorted[0].log_date) : null;

  if (lastCycleDate) {
    const daysSince = Math.floor((today - lastCycleDate) / DAY_MS);
    if (daysSince >= 90 && sorted.some(l => l.facial_hair_growth || (l.acne_severity || 0) >= 4)) {
      reasons.push('You have not logged a period start in over 90 days and have also logged androgen-related symptoms. This combination is worth discussing with a doctor.');
    }
  }

  const severePain = sorted.filter(l => l.pelvic_pain && (l.pelvic_pain_severity || 0) >= 4);
  if (severePain.length >= 3) {
    for (let i = 0; i <= severePain.length - 3; i++) {
      const start = new Date(severePain[i].log_date);
      const end = new Date(start.getTime() + 14 * DAY_MS);
      if (severePain.filter(l => { const d = new Date(l.log_date); return d >= start && d <= end; }).length >= 3) {
        reasons.push('You have logged severe pelvic pain three or more times within a two-week window. This pattern should be evaluated by a doctor.');
        break;
      }
    }
  }

  const weekMap = {};
  sorted.forEach(l => {
    const idx = Math.floor(new Date(l.log_date).getTime() / WEEK_MS);
    if (!weekMap[idx]) weekMap[idx] = [];
    weekMap[idx].push(l);
  });
  const weeks = Object.keys(weekMap).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < weeks.length - 1; i++) {
    if (weeks[i + 1] !== weeks[i] + 1) continue;
    const w1 = weekMap[weeks[i]], w2 = weekMap[weeks[i + 1]];
    if (
      w1.some(l => l.weight_change === 'up' || l.weight_change === 'down') &&
      w2.some(l => l.weight_change === 'up' || l.weight_change === 'down') &&
      w1.some(l => (l.mood || 3) <= 2) &&
      w2.some(l => (l.mood || 3) <= 2)
    ) {
      reasons.push("You have reported noticeable weight changes alongside low mood over two or more consecutive weeks. This is worth bringing to a doctor's attention.");
      break;
    }
  }

  return reasons.length > 0 ? reasons : null;
}

function computeWeeklyComparison(logs) {
  const sorted = [...logs].sort((a, b) => new Date(a.log_date) - new Date(b.log_date));
  if (sorted.length === 0) return null;
  const weekMap = {};
  sorted.forEach(l => {
    const idx = Math.floor(new Date(l.log_date).getTime() / WEEK_MS);
    if (!weekMap[idx]) weekMap[idx] = [];
    weekMap[idx].push(l);
  });
  const weeks = Object.keys(weekMap).map(Number).sort((a, b) => a - b);
  if (weeks.length < 2 || weeks[weeks.length - 1] !== weeks[weeks.length - 2] + 1) return null;
  const cur = weekMap[weeks[weeks.length - 1]];
  const prev = weekMap[weeks[weeks.length - 2]];
  const avg = (arr, f) => arr.length > 0 ? arr.reduce((a, l) => a + (l[f] || 0), 0) / arr.length : 0;
  const changes = [];
  const moodD = avg(cur, 'mood') - avg(prev, 'mood');
  if (Math.abs(moodD) >= 0.5) changes.push(`Mood ${moodD > 0 ? 'improved' : 'declined'} from ${avg(prev, 'mood').toFixed(1)} to ${avg(cur, 'mood').toFixed(1)} out of 5.`);
  const sleepD = avg(cur, 'sleep_quality') - avg(prev, 'sleep_quality');
  if (Math.abs(sleepD) >= 0.5) changes.push(`Sleep quality ${sleepD > 0 ? 'improved' : 'worsened'} from ${avg(prev, 'sleep_quality').toFixed(1)} to ${avg(cur, 'sleep_quality').toFixed(1)} out of 5.`);
  const acneD = avg(cur, 'acne_severity') - avg(prev, 'acne_severity');
  if (Math.abs(acneD) >= 1) changes.push(`Acne severity ${acneD > 0 ? 'increased' : 'decreased'} from ${avg(prev, 'acne_severity').toFixed(1)} to ${avg(cur, 'acne_severity').toFixed(1)} out of 5.`);
  return changes.length > 0 ? changes.join(' ') : 'Your symptoms have been relatively stable compared to last week.';
}

function buildPrompt(ind, profile) {
  return `You are FemCare's awareness assistant. Your role is to help users notice patterns in their self-tracked symptoms — NOT to diagnose PCOD/PCOS or any medical condition.

USER PROFILE:
- Age: ${profile?.age || 'unknown'}
- Self-reported diagnosis status: ${profile?.diagnosisStatus || 'unknown'}
- Self-reported cycle regularity: ${profile?.cycleRegularity || 'unknown'}
- Reports ultrasound finding (polycystic ovaries): ${ind.hasUltrasoundFinding ? 'yes' : 'no'}

TRACKED DATA SUMMARY (${ind.totalLogs} entries, ${ind.dateRange?.start || 'N/A'} to ${ind.dateRange?.end || 'N/A'}):
- Cycle intervals (days between periods): [${ind.cycleIntervals.join(', ')}]
- Average cycle length: ${ind.avgCycleLength || 'insufficient data'} days
- Cycles outside 21-35 day range: ${ind.irregularCycles} out of ${ind.totalCycles}
- Average acne severity (0-5): ${ind.acneAvg.toFixed(1)}
- Facial hair growth logged in: ${(ind.facialHairFrequency * 100).toFixed(0)}% of entries
- Hair thinning logged in: ${(ind.hairThinningFrequency * 100).toFixed(0)}% of entries
- Pelvic pain logged in: ${(ind.pelvicPainFrequency * 100).toFixed(0)}% of entries
- Average mood (1-5): ${ind.moodAvg.toFixed(1)}
- Average sleep quality (1-5): ${ind.sleepAvg.toFixed(1)}
- Average cravings intensity (0-5): ${ind.cravingsAvg.toFixed(1)}

Respond with JSON only:
{
  "awareness_level": "low" | "moderate" | "high",
  "reasoning_summary": "string starting with 'Based on patterns in your logs...' or 'Your data suggests...'",
  "symptom_impacts": [{ "symptom": "string", "impact": "string" }],
  "correlations": ["string"],
  "red_flags": ["string"],
  "doctor_nudge": boolean,
  "doctor_nudge_reason": "string"
}

RULES: Never use words like diagnose, diagnosis, or 'you have PCOS'. Frame everything as patterns worth discussing with a doctor. Tone: warm, supportive. If fewer than 3 logs, set awareness_level to "low".`;
}

// ─── POST /api/ai/insights ────────────────────────────────────────────────────
router.post(
  '/insights',
  asyncHandler(async (req, res) => {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Add OPENAI_API_KEY to .env' });
    }

    const [rawLogs, profile] = await Promise.all([
      (async () => {
        const logsKey = cache.KEY.logsList(req.userId, 200);
        const cachedLogs = await cache.get(logsKey);
        if (cachedLogs) return cachedLogs;
        const logs = await SymptomLog.find({ userId: req.userId }).sort({ logDate: -1 }).limit(200).lean();
        if (logs.length > 0) await cache.set(logsKey, logs, cache.TTL.LOGS);
        return logs;
      })(),
      (async () => {
        const profileKey = cache.KEY.profile(req.userId);
        const cachedProfile = await cache.get(profileKey);
        if (cachedProfile) return cachedProfile;
        const p = await UserProfile.findOne({ userId: req.userId }).lean();
        if (p) await cache.set(profileKey, p, cache.TTL.PROFILE);
        return p;
      })(),
    ]);

    if (rawLogs.length === 0) {
      return res.status(400).json({ error: 'No logs found. Add some symptom logs first.' });
    }

    const logs = rawLogs.map(toSnake);
    const ind = computeIndicators(logs, profile);
    const redFlagReasons = checkRedFlags(logs);
    const weeklyTrend = computeWeeklyComparison(logs);

    // Lazy-load OpenAI so the server starts even without the key
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: buildPrompt(ind, profile) }],
      temperature: 0.4,
    });

    let response;
    try {
      response = JSON.parse(completion.choices[0].message.content);
    } catch {
      return res.status(502).json({ error: 'AI returned an invalid response. Please try again.' });
    }

    // Enforce reasoning_summary prefix
    let reasoningSummary = response.reasoning_summary || '';
    if (reasoningSummary && !reasoningSummary.startsWith('Based on patterns') && !reasoningSummary.startsWith('Your data suggests')) {
      reasoningSummary = 'Based on patterns in your logs, ' + reasoningSummary.charAt(0).toLowerCase() + reasoningSummary.slice(1);
    }

    // Red-flag override — procedural rules take precedence over LLM
    let doctorNudge = response.doctor_nudge || false;
    let doctorNudgeReason = response.doctor_nudge_reason || '';
    if (redFlagReasons) {
      doctorNudge = true;
      doctorNudgeReason = redFlagReasons.join(' ');
    }

    const insight = await Insight.create({
      userId: req.userId,
      awarenessLevel: response.awareness_level,
      reasoningSummary,
      symptomImpacts: response.symptom_impacts ?? [],
      correlations: response.correlations ?? [],
      redFlags: response.red_flags ?? [],
      doctorNudge,
      doctorNudgeReason,
      weeklyTrendSummary: weeklyTrend || '',
      logCountAnalyzed: ind.totalLogs,
      dateRangeStart: ind.dateRange?.start,
      dateRangeEnd: ind.dateRange?.end,
    });

    // Invalidate insights cache so the next GET returns the freshly generated insight
    await cache.del(cache.KEY.insights(req.userId));

    res.status(201).json({
      id: insight._id,
      awareness_level: insight.awarenessLevel,
      reasoning_summary: insight.reasoningSummary,
      symptom_impacts: insight.symptomImpacts,
      correlations: insight.correlations,
      red_flags: insight.redFlags,
      doctor_nudge: insight.doctorNudge,
      doctor_nudge_reason: insight.doctorNudgeReason,
      weekly_trend_summary: insight.weeklyTrendSummary,
      log_count_analyzed: insight.logCountAnalyzed,
      date_range_start: insight.dateRangeStart,
      date_range_end: insight.dateRangeEnd,
      created_date: insight.createdAt,
    });
  })
);

// ─── POST /api/ai/summary/doctor-report ─────────────────────────────────────
router.post(
  '/summary/doctor-report',
  validate(aiInsightSchema),
  asyncHandler(async (req, res) => {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Add OPENAI_API_KEY to .env' });
    }

    const { period } = req.body;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - period);
    const cutoffStr = cutoff.toISOString().slice(0, 10);

    const [rawLogs, profile] = await Promise.all([
      (async () => {
        const logsKey = cache.KEY.logsList(req.userId, 200);
        const cachedLogs = await cache.get(logsKey);
        if (cachedLogs) return cachedLogs;
        const logs = await SymptomLog.find({ userId: req.userId, logDate: { $gte: cutoffStr } }).sort({ logDate: 1 }).lean();
        if (logs.length > 0) await cache.set(logsKey, logs, cache.TTL.LOGS);
        return logs;
      })(),
      (async () => {
        const profileKey = cache.KEY.profile(req.userId);
        const cachedProfile = await cache.get(profileKey);
        if (cachedProfile) return cachedProfile;
        const p = await UserProfile.findOne({ userId: req.userId }).lean();
        if (p) await cache.set(profileKey, p, cache.TTL.PROFILE);
        return p;
      })(),
    ]);

    if (rawLogs.length === 0) {
      return res.status(400).json({ error: 'No logs found in this period.' });
    }

    const logs = rawLogs.map(toSnake);
    const ind = computeIndicators(logs, profile);

    const prompt = `You are FemCare's report assistant. Summarise the following self-tracked symptom data for a patient to share with their gynaecologist. Be factual, concise, and non-diagnostic. Never use words like "diagnose" or "you have PCOS". Frame everything as self-reported observations.

PATIENT: ${profile?.displayName || 'Unknown'}, age ${profile?.age || 'unknown'}
PERIOD: last ${period} days (${logs[0].log_date} to ${logs[logs.length - 1].log_date})
LOGS: ${ind.totalLogs} entries

CYCLE:
- Period starts logged: ${ind.cycleIntervals.length + (ind.totalCycles > 0 ? 1 : 0)}
- Cycle intervals (days): [${ind.cycleIntervals.join(', ') || 'insufficient data'}]
- Average cycle length: ${ind.avgCycleLength || 'N/A'} days
- Cycles outside 21-35 day range: ${ind.irregularCycles}

SYMPTOMS (averages):
- Acne severity (0-5): ${ind.acneAvg.toFixed(1)}
- Facial hair growth: ${(ind.facialHairFrequency * 100).toFixed(0)}% of days
- Hair thinning: ${(ind.hairThinningFrequency * 100).toFixed(0)}% of days
- Pelvic pain: ${(ind.pelvicPainFrequency * 100).toFixed(0)}% of days
- Mood (1-5): ${ind.moodAvg.toFixed(1)}
- Sleep quality (1-5): ${ind.sleepAvg.toFixed(1)}
- Cravings intensity (0-5): ${ind.cravingsAvg.toFixed(1)}

Write a 3-5 sentence plain-language summary suitable for a doctor visit. Start with "Over the past ${period} days, this patient self-reported...".
Return only the summary text, no JSON, no headers.`;

    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 300,
    });

    const summary = completion.choices[0].message.content?.trim() || '';
    res.json({ summary });
  })
);

module.exports = router;
