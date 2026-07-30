import React from 'react';
import { Check } from 'lucide-react';

export default function SymptomChip({ icon: Icon, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl border transition-all duration-300 ${
        selected
          ? 'border-primary/40 bg-gradient-to-r from-primary/10 to-primary/5 shadow-sm shadow-primary/5'
          : 'glass-pill bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 hover:border-primary/20'
      }`}
    >
      <div className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 shrink-0 ${
        selected ? 'bg-primary/15 ring-1 ring-primary/20' : 'bg-muted/40'
      }`}>
        <Icon size={18} className={selected ? 'text-primary' : 'text-muted-foreground'} />
      </div>
      <span className={`text-sm font-medium flex-1 text-left transition-colors duration-200 ${selected ? 'text-primary' : 'text-foreground'}`}>
        {label}
      </span>
      {selected && (
        <div className="shrink-0 w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center">
          <Check size={12} className="text-primary" />
        </div>
      )}
    </button>
  );
}
