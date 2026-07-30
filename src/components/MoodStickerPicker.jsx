import React from 'react';

const MOOD_OPTIONS = [
  { value: 1, emoji: '😢', label: 'Low', gradient: 'from-blue-400/20 to-blue-500/10' },
  { value: 2, emoji: '😕', label: 'Down', gradient: 'from-purple-400/20 to-violet-500/10' },
  { value: 3, emoji: '🙂', label: 'Okay', gradient: 'from-amber-400/20 to-yellow-500/10' },
  { value: 4, emoji: '😊', label: 'Good', gradient: 'from-emerald-400/20 to-green-500/10' },
  { value: 5, emoji: '🌸', label: 'Great', gradient: 'from-rose-400/25 to-pink-500/15' }
];

export default function MoodStickerPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-2.5">
      {MOOD_OPTIONS.map(opt => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-label={`Mood: ${opt.label}`}
            aria-pressed={selected}
            className={`flex flex-col items-center gap-1.5 py-3.5 px-1 rounded-2xl border transition-all duration-300 ${
              selected
                ? `border-primary/40 bg-gradient-to-b ${opt.gradient} scale-[1.02] shadow-md shadow-primary/10`
                : 'border-white/30 dark:border-white/8 bg-white/40 dark:bg-white/5 backdrop-blur-sm hover:border-primary/20 hover:bg-white/60 dark:hover:bg-white/10'
            }`}
          >
            <span className="text-2xl leading-none transform transition-transform duration-200" style={selected ? { transform: 'scale(1.15)' } : {}}>{opt.emoji}</span>
            <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${selected ? 'text-primary' : 'text-muted-foreground'}`}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
