import React from 'react';
import { format } from 'date-fns';

export default function ConsistencyBadge({ logs = [] }) {
  const now = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    days.push({ dateStr, logged: logs.some(l => l.log_date === dateStr) });
  }
  const count = days.filter(d => d.logged).length;

  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-sm font-semibold text-foreground mb-3">
        {count} {count === 1 ? 'check-in' : 'check-ins'} this week 🌸
      </p>
      <div className="flex justify-between gap-1.5">
        {days.map(d => (
          <div
            key={d.dateStr}
            className={`flex-1 h-2.5 rounded-full transition-colors ${d.logged ? 'bg-primary/40' : 'bg-muted/40'}`}
          />
        ))}
      </div>
    </div>
  );
}