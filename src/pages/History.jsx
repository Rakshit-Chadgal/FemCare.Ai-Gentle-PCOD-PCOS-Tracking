import React, { useState, useEffect, useMemo } from 'react';
import { symptomLogService } from '@/services/symptomLogs';
import CompanionLoader from '@/components/CompanionLoader';
import HistoryLogEntry from '@/components/HistoryLogEntry';
import { Search, X, Calendar } from 'lucide-react';

const FILTERS = [
  { id: 'pelvic_pain', label: 'Pelvic pain', check: (log) => log.pelvic_pain },
  { id: 'low_mood', label: 'Low mood', check: (log) => (log.mood || 3) <= 2 },
  { id: 'good_mood', label: 'Good mood', check: (log) => (log.mood || 3) >= 4 },
  { id: 'acne', label: 'Acne', check: (log) => (log.acne_severity || 0) >= 2 },
  { id: 'facial_hair', label: 'Facial hair', check: (log) => log.facial_hair_growth },
  { id: 'hair_thinning', label: 'Hair thinning', check: (log) => log.hair_thinning },
  { id: 'weight_up', label: 'Weight up', check: (log) => log.weight_change === 'up' },
  { id: 'weight_down', label: 'Weight down', check: (log) => log.weight_change === 'down' },
  { id: 'cravings', label: 'Cravings', check: (log) => (log.cravings_intensity || 0) >= 3 },
  { id: 'poor_sleep', label: 'Poor sleep', check: (log) => (log.sleep_quality || 3) <= 2 },
  { id: 'cycle_start', label: 'Period started', check: (log) => log.cycle_started },
  { id: 'cycle_end', label: 'Period ended', check: (log) => log.cycle_ended },
];

export default function History() {
  const [logs, setLogs] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    symptomLogService.list(500).then(setLogs);
  }, []);

  const filtered = useMemo(() => {
    if (!logs) return [];
    return logs.filter(log => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!(log.notes || '').toLowerCase().includes(q) && !(log.log_date || '').includes(q)) return false;
      }
      if (activeFilters.length > 0) {
        return activeFilters.every(filterId => {
          const f = FILTERS.find(fl => fl.id === filterId);
          return f ? f.check(log) : false;
        });
      }
      return true;
    });
  }, [logs, search, activeFilters]);

  function toggleFilter(id) {
    setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }

  if (!logs) return <CompanionLoader />;

  return (
    <div className="pt-6 pb-4 space-y-5">
      <div className="animate-card-rise" style={{ animationDelay: '0ms' }}>
        <h1 className="text-2xl font-semibold text-foreground">History</h1>
        <p className="text-sm text-muted-foreground mt-1">Search and filter your past logs.</p>
      </div>

      {logs.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center animate-card-rise" style={{ animationDelay: '50ms' }}>
          <Calendar size={28} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No logs yet. Start tracking to build your history.</p>
        </div>
      ) : (
        <>
          <div className="animate-card-rise" style={{ animationDelay: '50ms' }}>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes or dates…"
                className="w-full rounded-2xl border border-input bg-card pl-11 pr-10 py-3 text-sm text-foreground"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide animate-card-rise" style={{ animationDelay: '100ms' }}>
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => toggleFilter(f.id)}
                className={`shrink-0 px-3 py-2 rounded-full text-xs font-medium transition ${
                  activeFilters.includes(f.id)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {(search || activeFilters.length > 0) && (
            <p className="text-xs text-muted-foreground px-1">
              {filtered.length} {filtered.length === 1 ? 'log' : 'logs'} found
              <button onClick={() => { setSearch(''); setActiveFilters([]); }} className="ml-2 text-primary hover:underline">
                Clear all
              </button>
            </p>
          )}

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center">
                <p className="text-sm text-muted-foreground">No logs match your search. Try different filters.</p>
              </div>
            ) : (
              filtered.map(log => <HistoryLogEntry key={log.id} log={log} />)
            )}
          </div>
        </>
      )}
    </div>
  );
}