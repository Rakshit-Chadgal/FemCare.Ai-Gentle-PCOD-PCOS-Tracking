import React from 'react';

export default function SeveritySlider({ label, value, onChange, min = 0, max = 5, leftLabel = 'None', rightLabel = 'Severe', emoji }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          {emoji && <span className="text-base">{emoji}</span>}
          {label}
        </label>
        <span className="text-sm font-semibold text-primary tabular-nums">{value}/{max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}