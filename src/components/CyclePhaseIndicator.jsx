import React from 'react';

const PHASES = [
  { key: 'menstrual', label: 'Menstrual' },
  { key: 'follicular', label: 'Follicular' },
  { key: 'ovulation', label: 'Ovulation' },
  { key: 'luteal', label: 'Luteal' },
];

function MoonIcon({ type, active }) {
  const fill = active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.3)';
  const stroke = active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.25)';

  if (type === 0) {
    return <circle cx="16" cy="16" r="11" fill="none" stroke={stroke} strokeWidth="2" />;
  }
  if (type === 1) {
    return (
      <>
        <circle cx="16" cy="16" r="11" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M 16 5 A 11 11 0 0 1 16 27 A 8 11 0 0 0 16 5 Z" fill={fill} />
      </>
    );
  }
  if (type === 2) {
    return <circle cx="16" cy="16" r="11" fill={fill} />;
  }
  return (
    <>
      <circle cx="16" cy="16" r="11" fill="none" stroke={stroke} strokeWidth="2" />
      <path d="M 16 5 A 11 11 0 0 0 16 27 A 8 11 0 0 1 16 5 Z" fill={fill} />
    </>
  );
}

export default function CyclePhaseIndicator({ currentPhase, day }) {
  const activeIndex = PHASES.findIndex(p => p.key === currentPhase);

  return (
    <div className="flex items-center justify-between gap-1">
      {PHASES.map((p, i) => {
        const active = i === activeIndex;
        return (
          <div key={p.key} className="flex flex-col items-center gap-1 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition ${active ? 'bg-primary/10' : ''}`}>
              <div key={`${p.key}-${active}`} className={active ? 'animate-phase-bloom' : ''} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                <MoonIcon type={i} active={active} />
              </div>
            </div>
            <span className={`text-[9px] font-medium ${active ? 'text-primary' : 'text-muted-foreground/50'}`}>{p.label}</span>
          </div>
        );
      })}
    </div>
  );
}