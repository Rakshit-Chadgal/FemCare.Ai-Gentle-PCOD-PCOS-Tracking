import React from 'react';

const PETALS = [
  { x: '12%', delay: 0, driftX: 15, driftY: -90, rot: 160, size: 14, color: '#F5B8C8' },
  { x: '28%', delay: 120, driftX: -12, driftY: -110, rot: 220, size: 10, color: '#E8A0B8' },
  { x: '52%', delay: 60, driftX: 20, driftY: -95, rot: 140, size: 12, color: '#D4B8E0' },
  { x: '72%', delay: 180, driftX: -8, driftY: -80, rot: 200, size: 16, color: '#F5C8D5' },
  { x: '88%', delay: 90, driftX: 12, driftY: -100, rot: 170, size: 11, color: '#E8C8F0' },
];

export default function PetalCelebration() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {PETALS.map((p, i) => (
        <div
          key={i}
          className="absolute bottom-1/3 animate-petal"
          style={{
            left: p.x,
            animationDelay: `${p.delay}ms`,
            '--drift-x': `${p.driftX}px`,
            '--drift-y': `${p.driftY}px`,
            '--drift-rot': `${p.rot}deg`,
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 20 20">
            <path d="M 10 1 Q 17 7 10 19 Q 3 7 10 1 Z" fill={p.color} opacity="0.75" />
          </svg>
        </div>
      ))}
    </div>
  );
}