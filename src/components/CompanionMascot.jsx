import React from 'react';

const PHASE_COLORS = {
  menstrual: { from: '#C8A2D5', to: '#B89AD0' },
  follicular: { from: '#B8D8C8', to: '#A0CFB8' },
  ovulation: { from: '#F5B8C8', to: '#E8A0B8' },
  luteal: { from: '#D4B8E0', to: '#C4A0D4' },
  unknown: { from: '#F5C8D5', to: '#E0C4E8' }
};

export default function CompanionMascot({ mood = 3, phase = 'unknown', size = 88, animate = null }) {
  const colors = PHASE_COLORS[phase] || PHASE_COLORS.unknown;
  const gid = `mascot-${phase}`;

  const renderEyes = () => {
    if (mood <= 2) {
      return (
        <>
          <path d="M 46 50 Q 51 55 56 50" fill="none" stroke="#5A4A6C" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 64 50 Q 69 55 74 50" fill="none" stroke="#5A4A6C" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    }
    if (mood >= 4) {
      return (
        <>
          <path d="M 46 52 Q 51 46 56 52" fill="none" stroke="#5A4A6C" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 64 52 Q 69 46 74 52" fill="none" stroke="#5A4A6C" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    }
    return (
      <>
        <circle cx="51" cy="51" r="2.8" fill="#5A4A6C" />
        <circle cx="69" cy="51" r="2.8" fill="#5A4A6C" />
      </>
    );
  };

  const renderMouth = () => {
    if (mood <= 2) {
      return <path d="M 52 68 Q 60 64 68 68" fill="none" stroke="#5A4A6C" strokeWidth="2.5" strokeLinecap="round" />;
    }
    if (mood >= 4) {
      return <path d="M 52 66 Q 60 74 68 66" fill="none" stroke="#5A4A6C" strokeWidth="2.5" strokeLinecap="round" />;
    }
    return <path d="M 54 68 Q 60 71 66 68" fill="none" stroke="#5A4A6C" strokeWidth="2.5" strokeLinecap="round" />;
  };

  return (
    <svg width={size} height={size} viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={animate === 'bounce' ? 'animate-companion-bounce' : ''} style={animate === 'bounce' ? { transformBox: 'fill-box', transformOrigin: 'center bottom' } : {}}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.from} />
          <stop offset="100%" stopColor={colors.to} />
        </linearGradient>
      </defs>
      <path
        d="M 60 15 C 80 15 98 30 98 52 C 98 74 82 88 60 88 C 38 88 22 74 22 52 C 22 30 40 15 60 15 Z"
        fill={`url(#${gid})`}
      />
      <circle cx="36" cy="58" r="4.5" fill="#F5B8C8" opacity="0.45" />
      <circle cx="84" cy="58" r="4.5" fill="#F5B8C8" opacity="0.45" />
      {renderEyes()}
      {renderMouth()}
    </svg>
  );
}