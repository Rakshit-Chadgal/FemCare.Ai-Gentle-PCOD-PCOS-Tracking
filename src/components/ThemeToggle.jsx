import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('femcare-theme', newDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDark);
  }

  return (
    <button
      onClick={toggle}
      className="relative h-9 w-[68px] rounded-full bg-muted border border-border/60 transition-colors duration-300 overflow-hidden"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun size={14} className="absolute top-1/2 left-2 -translate-y-1/2 text-amber-500/50" />
      <Moon size={14} className="absolute top-1/2 right-2 -translate-y-1/2 text-indigo-300/50" />
      <div
        className="absolute top-1 left-0 h-7 w-7 rounded-full bg-card dark:bg-white/15 shadow-md flex items-center justify-center theme-knob"
        style={{ transform: isDark ? 'translateX(36px)' : 'translateX(4px)' }}
      >
        {isDark ? <Moon size={15} className="text-indigo-300" /> : <Sun size={15} className="text-amber-500" />}
      </div>
    </button>
  );
}