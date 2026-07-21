import React from 'react';
import { Info } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="no-print sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-white/50">
      <div className="max-w-2xl mx-auto px-4 py-2 flex items-center gap-2">
        <Info size={14} className="shrink-0 text-muted-foreground" />
        <p className="text-[11px] leading-tight text-muted-foreground font-medium">
          FemCare is an awareness &amp; tracking tool — not a medical diagnosis. Always consult a licensed doctor.
        </p>
      </div>
    </div>
  );
}