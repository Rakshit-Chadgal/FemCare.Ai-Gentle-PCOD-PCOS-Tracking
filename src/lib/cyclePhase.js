export function getCyclePhase(logs) {
  if (!logs || logs.length === 0) {
    return { phase: 'unknown', day: null, label: 'Start tracking to see your cycle phase' };
  }

  const sorted = [...logs].sort((a, b) => new Date(b.log_date) - new Date(a.log_date));
  const cycleStarts = sorted.filter(l => l.cycle_started);

  if (cycleStarts.length === 0) {
    return { phase: 'unknown', day: null, label: 'Log a period start to see your phase' };
  }

  const lastStart = new Date(cycleStarts[0].log_date);
  lastStart.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = Math.floor((today - lastStart) / 86400000);

  if (day < 0) {
    return { phase: 'unknown', day: null, label: 'Log a period start to see your phase' };
  }

  let phase, label;
  if (day <= 5) {
    phase = 'menstrual';
    label = 'Menstrual phase';
  } else if (day <= 13) {
    phase = 'follicular';
    label = 'Follicular phase';
  } else if (day <= 16) {
    phase = 'ovulation';
    label = 'Ovulation phase';
  } else {
    phase = 'luteal';
    label = 'Luteal phase';
  }

  return { phase, day, label };
}