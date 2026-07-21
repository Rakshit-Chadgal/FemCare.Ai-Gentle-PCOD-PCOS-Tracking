import React from 'react';

const MOOD_OPTIONS = [
  { value: 1, emoji: '😢', label: 'Low' },
  { value: 2, emoji: '😕', label: 'Down' },
  { value: 3, emoji: '🙂', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '🌸', label: 'Great' }
];

export default function MoodStickerPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {MOOD_OPTIONS.map(opt => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-label={`Mood: ${opt.label}`}
            aria-pressed={selected}
            className={`flex flex-col items-center gap-1 py-3 rounded-2xl border-2 transition-all duration-200 ${
              selected ? 'border-primary bg-primary/5 scale-105 shadow-sm' : 'border-border bg-card hover:border-primary/30'
            }`}
          >
            <span className="text-2xl leading-none">{opt.emoji}</span>
            <span className={`text-[10px] font-medium ${selected ? 'text-primary' : 'text-muted-foreground'}`}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}