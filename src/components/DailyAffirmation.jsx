import React from 'react';

const AFFIRMATIONS = {
  menstrual: [
    'Rest is productive too. You deserve comfort today. 🌙',
    'Be extra gentle with yourself — warmth and rest are always enough. ☕',
    "It's okay to slow down. Your body deserves kindness today. 🤍",
  ],
  follicular: [
    'Your energy is rising — a good day for something that makes you smile. 🌱',
    'A fresh start. What would feel good to begin today? ✨',
    'Notice what feels a little lighter today. 🌸',
  ],
  ovulation: [
    'Your energy is peaking today — use it kindly. 💫',
    'A good day to trust yourself. 🌟',
    'Connect with someone you trust today — including yourself. 💛',
  ],
  luteal: [
    'Slow and steady is just right today. No need to rush. 🍂',
    'What is your body asking for today — rest, water, kindness? 🫖',
    "Your feelings are valid. Be as gentle with yourself as you'd be with a friend. 🤍",
  ],
  unknown: [
    'Every check-in is an act of self-care. You are doing great. 🌸',
    'Small notes lead to big understanding. Keep going. 🌷',
    "You don't need to have it all figured out. Just notice today. 🤍",
  ]
};

export default function DailyAffirmation({ phase = 'unknown' }) {
  const pool = AFFIRMATIONS[phase] || AFFIRMATIONS.unknown;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const affirmation = pool[dayOfYear % pool.length];

  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Today's Note</p>
      <p className="text-sm text-foreground leading-relaxed font-display">{affirmation}</p>
    </div>
  );
}