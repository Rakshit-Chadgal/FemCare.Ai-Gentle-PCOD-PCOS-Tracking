import React from 'react';
import CompanionMascot from './CompanionMascot';

export default function CompanionLoader({ phase = 'unknown', size = 56, label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="animate-companion-bob">
        <CompanionMascot mood={3} phase={phase} size={size} />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}