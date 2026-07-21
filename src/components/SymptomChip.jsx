import React from 'react';
import { Check } from 'lucide-react';

export default function SymptomChip({ icon: Icon, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl border transition-all duration-200 ${
        selected
          ? 'border-primary bg-primary/10 shadow-sm'
          : 'border-white/60 bg-white/40 dark:bg-white/5 backdrop-blur-sm hover:bg-white/50'
      }`}
    >
      <div className={`flex items-center justify-center w-9 h-9 rounded-xl transition-colors shrink-0 ${
        selected ? 'bg-primary/20' : 'bg-muted/50'
      }`}>
        <Icon size={18} className={selected ? 'text-primary' : 'text-muted-foreground'} />
      </div>
      <span className={`text-sm font-medium flex-1 text-left ${selected ? 'text-primary' : 'text-foreground'}`}>
        {label}
      </span>
      {selected && <Check size={16} className="text-primary shrink-0" />}
    </button>
  );
}