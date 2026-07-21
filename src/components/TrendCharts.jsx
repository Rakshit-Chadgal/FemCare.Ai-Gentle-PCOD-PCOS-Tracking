import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format, parseISO, differenceInDays } from 'date-fns';

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5 mb-4">{subtitle}</p>}
      <div className={subtitle ? '' : 'mt-4'} style={{ width: '100%', height: 200 }}>
        {children}
      </div>
    </div>
  );
}

const tooltipStyle = {
  borderRadius: '0.75rem',
  border: '1px solid hsl(340 15% 93%)',
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  fontSize: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
};

export default function TrendCharts({ logs }) {
  const sorted = useMemo(() =>
    [...logs].sort((a, b) => new Date(a.log_date) - new Date(b.log_date)),
    [logs]
  );

  const cycleData = useMemo(() => {
    const starts = sorted.filter(l => l.cycle_started);
    const intervals = [];
    for (let i = 1; i < starts.length; i++) {
      const days = differenceInDays(parseISO(starts[i].log_date), parseISO(starts[i - 1].log_date));
      intervals.push({ label: `Cycle ${i}`, days });
    }
    return intervals;
  }, [sorted]);

  const trendData = useMemo(() =>
    sorted.map(l => ({
      date: format(parseISO(l.log_date), 'MMM d'),
      acne: l.acne_severity || 0,
      mood: l.mood || 3,
      sleep: l.sleep_quality || 3,
      cravings: l.cravings_intensity || 0
    })),
    [sorted]
  );

  const frequencyData = useMemo(() => {
    const n = sorted.length || 1;
    return [
      { name: 'Acne', count: sorted.filter(l => (l.acne_severity || 0) >= 2).length, fill: 'hsl(338 72% 66%)' },
      { name: 'Facial Hair', count: sorted.filter(l => l.facial_hair_growth).length, fill: 'hsl(256 52% 70%)' },
      { name: 'Hair Thinning', count: sorted.filter(l => l.hair_thinning).length, fill: 'hsl(200 55% 65%)' },
      { name: 'Pelvic Pain', count: sorted.filter(l => l.pelvic_pain).length, fill: 'hsl(38 72% 60%)' },
      { name: 'Cravings', count: sorted.filter(l => (l.cravings_intensity || 0) >= 3).length, fill: 'hsl(152 38% 60%)' }
    ].map(d => ({ ...d, pct: Math.round((d.count / n) * 100) }));
  }, [sorted]);

  if (sorted.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-sm text-muted-foreground">No logs yet. Start tracking to see your trends here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cycleData.length > 0 && (
        <ChartCard title="Cycle Length Over Time" subtitle="Days between each logged period start">
          <ResponsiveContainer>
            <LineChart data={cycleData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(340 15% 93%)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(275 8% 46%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(275 8% 46%)' }} axisLine={false} tickLine={false} domain={[0, 'dataMax + 5']} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="days" stroke="hsl(338 72% 66%)" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(338 72% 66%)' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {trendData.length > 0 && (
        <>
          <ChartCard title="Acne Severity Trend" subtitle="Your logged acne severity over time">
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(340 15% 93%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(275 8% 46%)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(275 8% 46%)' }} axisLine={false} tickLine={false} domain={[0, 5]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="acne" stroke="hsl(338 72% 66%)" strokeWidth={2.5} dot={{ r: 3, fill: 'hsl(338 72% 66%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Mood & Sleep Quality" subtitle="How you've been feeling and resting">
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(340 15% 93%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(275 8% 46%)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(275 8% 46%)' }} axisLine={false} tickLine={false} domain={[1, 5]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="mood" name="Mood" stroke="hsl(256 52% 70%)" strokeWidth={2.5} dot={{ r: 3, fill: 'hsl(256 52% 70%)' }} />
                <Line type="monotone" dataKey="sleep" name="Sleep" stroke="hsl(200 55% 65%)" strokeWidth={2.5} dot={{ r: 3, fill: 'hsl(200 55% 65%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      )}

      <ChartCard title="Symptom Frequency" subtitle="How often each symptom appears in your logs">
        <ResponsiveContainer>
          <BarChart data={frequencyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(340 15% 93%)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(275 8% 46%)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(275 8% 46%)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} logs`, 'Frequency']} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {frequencyData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}