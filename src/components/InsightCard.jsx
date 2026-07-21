import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import SwipeableCards from '@/components/SwipeableCards';

const levelConfig = {
  low: { label: 'Low', className: 'text-low', bg: 'bg-low-soft', dot: 'bg-low' },
  moderate: { label: 'Moderate', className: 'text-moderate', bg: 'bg-moderate-soft', dot: 'bg-moderate' },
  high: { label: 'High', className: 'text-high', bg: 'bg-high-soft', dot: 'bg-high' }
};

export default function InsightCard({ insight, compact = false }) {
  if (!insight) return null;
  const cfg = levelConfig[insight.awareness_level] || levelConfig.moderate;

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className={`${cfg.bg} px-5 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Sparkles size={18} className={cfg.className} />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">AI Awareness Summary</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className={`text-sm font-semibold ${cfg.className}`}>{cfg.label}</span>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">This is an awareness tool, not a medical diagnosis.</p>
          <p className="text-sm text-foreground leading-relaxed">{insight.reasoning_summary}</p>
        </div>

        {insight.symptom_impacts?.length > 0 && !compact && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">What influenced this assessment</p>
            <SwipeableCards
              items={insight.symptom_impacts}
              renderCard={(si) => (
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-foreground">{si.symptom}</p>
                  <p className="text-sm text-foreground/80 leading-relaxed">{si.impact}</p>
                </div>
              )}
              desktopContent={
                <div className="space-y-2">
                  {insight.symptom_impacts.map((si, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-sm font-medium text-foreground shrink-0">{si.symptom}</span>
                      <span className="text-sm text-muted-foreground shrink-0">→</span>
                      <span className="text-sm text-foreground/80">{si.impact}</span>
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        )}

        {insight.correlations?.length > 0 && !compact && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <TrendingUp size={14} /> Patterns Noticed
            </p>
            <SwipeableCards
              items={insight.correlations}
              renderCard={(c) => (
                <p className="text-sm text-foreground/80 leading-relaxed">{c}</p>
              )}
              desktopContent={
                <div className="space-y-1.5">
                  {insight.correlations.map((c, i) => (
                    <p key={i} className="text-sm text-foreground/80 pl-5 border-l-2 border-accent/40 ml-1">{c}</p>
                  ))}
                </div>
              }
            />
          </div>
        )}

        {insight.red_flags?.length > 0 && !compact && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-high flex items-center gap-1.5">
              <AlertTriangle size={14} /> Worth Discussing with a Doctor
            </p>
            <SwipeableCards
              items={insight.red_flags}
              renderCard={(f) => (
                <p className="text-sm text-foreground/80 leading-relaxed">{f}</p>
              )}
              desktopContent={
                <div className="space-y-1.5">
                  {insight.red_flags.map((f, i) => (
                    <p key={i} className="text-sm text-foreground/80 pl-5 border-l-2 border-high/40 ml-1">{f}</p>
                  ))}
                </div>
              }
            />
          </div>
        )}

        <div className="pt-2 border-t border-border/40">
          <p className="text-[11px] text-muted-foreground">
            Awareness tool — not a diagnosis. Based on {insight.log_count_analyzed || 0} logs{insight.created_date ? ` · ${format(new Date(insight.created_date), 'MMM d, yyyy')}` : ''}.
          </p>
        </div>
      </div>
    </div>
  );
}