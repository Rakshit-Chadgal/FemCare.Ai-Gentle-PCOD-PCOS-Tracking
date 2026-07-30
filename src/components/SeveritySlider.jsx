import React from 'react';

export default function SeveritySlider({ label, value, onChange, min = 0, max = 5, leftLabel = 'None', rightLabel = 'Severe', emoji }) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          {emoji && <span className="text-base">{emoji}</span>}
          {label}
        </label>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary tabular-nums">{value}/{max}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full relative z-10"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary) / 0.35) 0%, hsl(var(--primary) / 0.6) ${pct}%, hsl(var(--muted)) ${pct}%, hsl(var(--muted)) 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
