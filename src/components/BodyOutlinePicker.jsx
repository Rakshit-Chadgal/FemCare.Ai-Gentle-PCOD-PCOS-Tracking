import React from 'react';

const AREAS = [
  { id: 'head', label: 'Head / Scalp', cx: 100, cy: 28, rx: 18, ry: 22 },
  { id: 'face', label: 'Face', cx: 100, cy: 36, rx: 12, ry: 8 },
  { id: 'chest', label: 'Chest', cx: 100, cy: 82, rx: 27, ry: 20 },
  { id: 'abdomen', label: 'Lower Abdomen', cx: 100, cy: 125, rx: 26, ry: 22 },
  { id: 'left_arm', label: 'Left Arm', cx: 50, cy: 108, rx: 10, ry: 42 },
  { id: 'right_arm', label: 'Right Arm', cx: 150, cy: 108, rx: 10, ry: 42 },
  { id: 'left_leg', label: 'Left Leg', cx: 74, cy: 230, rx: 12, ry: 78 },
  { id: 'right_leg', label: 'Right Leg', cx: 126, cy: 230, rx: 12, ry: 78 },
];

export default function BodyOutlinePicker({ selected = [], onChange }) {
  function toggle(id) {
    if (selected.includes(id)) {
      onChange(selected.filter(a => a !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  const selectedLabels = selected.map(id => AREAS.find(a => a.id === id)?.label).filter(Boolean);

  return (
    <div className="py-3">
      <svg viewBox="0 0 200 320" className="w-full max-w-[220px] mx-auto">
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.35)" />
            <stop offset="50%" stopColor="hsl(var(--blush) / 0.3)" />
            <stop offset="100%" stopColor="hsl(var(--lavender) / 0.25)" />
          </linearGradient>
        </defs>

        {/* Body silhouette */}
        <g fill="url(#bodyGradient)" stroke="hsl(var(--muted-foreground) / 0.15)" strokeWidth="1.5" strokeLinejoin="round">
          <ellipse cx="100" cy="28" rx="19" ry="23" />
          <rect x="92" y="48" width="16" height="10" rx="5" />
          <path d="M 70 58 Q 62 60 58 72 Q 54 85 54 105 L 56 140 Q 56 148 62 150 Q 68 150 70 145 L 70 135 Q 74 128 82 128 L 118 128 Q 126 128 130 135 L 130 145 Q 132 150 138 150 Q 144 148 144 140 L 146 105 Q 146 85 142 72 Q 138 60 130 58 L 116 52 Q 100 56 84 52 Z" />
          <path d="M 58 68 Q 48 72 44 92 L 42 148 Q 41 154 46 156 Q 51 157 52 152 L 56 100 Q 58 82 64 72 Z" />
          <path d="M 142 68 Q 152 72 156 92 L 158 148 Q 159 154 154 156 Q 149 157 148 152 L 144 100 Q 142 82 136 72 Z" />
          <path d="M 70 148 Q 66 160 65 185 L 62 300 Q 61 310 68 312 Q 74 312 75 305 L 80 200 Q 82 170 86 152 Z" />
          <path d="M 130 148 Q 134 160 135 185 L 138 300 Q 139 310 132 312 Q 126 312 125 305 L 120 200 Q 118 170 114 152 Z" />
        </g>

        {/* Tappable zones */}
        {AREAS.map(area => {
          const isSelected = selected.includes(area.id);
          return (
            <ellipse
              key={area.id}
              cx={area.cx}
              cy={area.cy}
              rx={area.rx}
              ry={area.ry}
              fill={isSelected ? 'hsl(var(--primary) / 0.25)' : 'hsl(var(--primary) / 0.02)'}
              stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.2)'}
              strokeWidth={isSelected ? 2 : 1}
              className="cursor-pointer transition-all duration-200"
              onClick={() => toggle(area.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(area.id); } }}
              tabIndex={0}
              role="button"
              aria-label={area.label}
              aria-pressed={isSelected}
              style={isSelected ? { filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.5))' } : {}}
            >
              <title>{area.label}</title>
            </ellipse>
          );
        })}
      </svg>

      {selectedLabels.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 justify-center mt-3">
          {selectedLabels.map(label => (
            <span key={label} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
              {label}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground/60 text-center mt-2">Tap any area to note discomfort</p>
      )}
    </div>
  );
}