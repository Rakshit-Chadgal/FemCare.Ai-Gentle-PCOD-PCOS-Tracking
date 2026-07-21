import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, Moon, Sparkle, Activity, TrendingDown, User, Scale } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function HistoryLogEntry({ log }) {
  const symptoms = [];
  if (log.pelvic_pain) symptoms.push({ icon: Activity, label: 'Pelvic pain', color: 'text-high' });
  if ((log.acne_severity || 0) >= 2) symptoms.push({ icon: Sparkle, label: 'Acne', color: 'text-moderate' });
  if (log.facial_hair_growth) symptoms.push({ icon: User, label: 'Facial hair', color: 'text-muted-foreground' });
  if (log.hair_thinning) symptoms.push({ icon: TrendingDown, label: 'Hair thinning', color: 'text-muted-foreground' });
  if (log.cycle_started) symptoms.push({ icon: Droplet, label: 'Period started', color: 'text-primary' });
  if (log.cycle_ended) symptoms.push({ icon: Droplet, label: 'Period ended', color: 'text-muted-foreground' });
  if ((log.mood || 3) <= 2) symptoms.push({ icon: Heart, label: 'Low mood', color: 'text-high' });
  if ((log.mood || 3) >= 4) symptoms.push({ icon: Heart, label: 'Good mood', color: 'text-low' });
  if ((log.sleep_quality || 3) <= 2) symptoms.push({ icon: Moon, label: 'Poor sleep', color: 'text-moderate' });
  if ((log.cravings_intensity || 0) >= 3) symptoms.push({ icon: Sparkle, label: 'Cravings', color: 'text-moderate' });
  if (log.weight_change === 'up') symptoms.push({ icon: Scale, label: 'Weight up', color: 'text-moderate' });
  if (log.weight_change === 'down') symptoms.push({ icon: Scale, label: 'Weight down', color: 'text-low' });

  return (
    <Link
      to={`/log?date=${log.log_date}`}
      className="block glass rounded-2xl p-4 hover:shadow-md transition group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{format(parseISO(log.log_date), 'EEEE, MMM d')}</p>
          <p className="text-xs text-muted-foreground">{format(parseISO(log.log_date), 'yyyy')}</p>
        </div>
      </div>
      {symptoms.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {symptoms.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-xs bg-secondary/60 text-foreground/80 px-2 py-1 rounded-full">
              <s.icon size={11} className={s.color} />
              {s.label}
            </span>
          ))}
        </div>
      )}
      {log.notes && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{log.notes}</p>
      )}
    </Link>
  );
}