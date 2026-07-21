import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

const PHASE_BG = {
  menstrual: 'bg-primary/15',
  follicular: 'bg-accent/30',
  ovulation: 'bg-low-soft',
  luteal: 'bg-muted/60',
};

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CycleCalendar({ logs, avgCycleLength }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const data = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calStart, end: calEnd });

    const starts = logs.filter(l => l.cycle_started).map(l => l.log_date).sort();
    const ends = logs.filter(l => l.cycle_ended).map(l => l.log_date).sort();

    const predicted = [];
    const cycleLen = avgCycleLength && avgCycleLength > 0 ? Math.round(avgCycleLength) : null;
    if (cycleLen && starts.length > 0) {
      let last = new Date(starts[starts.length - 1] + 'T00:00:00');
      const calEndStr = format(calEnd, 'yyyy-MM-dd');
      for (let i = 0; i < 12; i++) {
        last = new Date(last.getTime() + cycleLen * 86400000);
        const ds = format(last, 'yyyy-MM-dd');
        if (ds > calEndStr) break;
        if (!starts.includes(ds)) predicted.push(ds);
      }
    }

    return { starts, ends, predicted, days, allStarts: [...starts, ...predicted] };
  }, [logs, currentMonth, avgCycleLength]);

  function getPhase(dateStr) {
    const preceding = data.allStarts.filter(s => s <= dateStr).sort((a, b) => b.localeCompare(a));
    if (preceding.length === 0) return null;
    const day = Math.floor((new Date(dateStr + 'T00:00:00') - new Date(preceding[0] + 'T00:00:00')) / 86400000);
    if (day < 0) return null;
    if (day <= 5) return 'menstrual';
    if (day <= 13) return 'follicular';
    if (day <= 16) return 'ovulation';
    return 'luteal';
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="p-1.5 rounded-lg hover:bg-accent/30 transition">
          <ChevronLeft size={20} className="text-muted-foreground" />
        </button>
        <h2 className="text-sm font-semibold text-foreground">{format(currentMonth, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-accent/30 transition">
          <ChevronRight size={20} className="text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-muted-foreground">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {data.days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const inMonth = isSameMonth(day, currentMonth);
          const today = isSameDay(day, new Date());
          const phase = getPhase(dateStr);
          const isStart = data.starts.includes(dateStr);
          const isEnd = data.ends.includes(dateStr);
          const isPredicted = data.predicted.includes(dateStr);

          return (
            <div
              key={dateStr}
              className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-[11px] transition ${
                inMonth ? '' : 'opacity-30'
              } ${phase ? PHASE_BG[phase] : ''} ${today ? 'ring-2 ring-primary' : ''}`}
            >
              <span className={`font-medium ${today ? 'text-primary' : inMonth ? 'text-foreground' : 'text-muted-foreground'}`}>
                {format(day, 'd')}
              </span>
              <div className="absolute bottom-1 flex items-center gap-0.5">
                {(isStart || isPredicted) && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isPredicted ? 'bg-primary/40' : 'bg-primary'}`} />
                )}
                {isEnd && (
                  <span className="w-1.5 h-1.5 rounded-full border border-primary" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary" />Period start</span>
        <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary/40" />Predicted</span>
        <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full border border-primary" />Period end</span>
        <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-primary/15" />Menstrual</span>
        <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-accent/30" />Follicular</span>
        <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-low-soft" />Ovulation</span>
        <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-muted/60" />Luteal</span>
      </div>
    </div>
  );
}