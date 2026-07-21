import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { symptomLogService } from '@/services/symptomLogs';
import { insightService } from '@/services/insights';
import { computeIndicators } from '@/lib/insightEngine';
import InsightCard from '@/components/InsightCard';
import DoctorAlert from '@/components/DoctorAlert';
import CompanionMascot from '@/components/CompanionMascot';
import CyclePhaseIndicator from '@/components/CyclePhaseIndicator';
import CycleCalendar from '@/components/CycleCalendar';
import DailyAffirmation from '@/components/DailyAffirmation';
import ConsistencyBadge from '@/components/ConsistencyBadge';
import CompanionLoader from '@/components/CompanionLoader';
import { getCyclePhase } from '@/lib/cyclePhase';
import { PlusCircle, Sparkles, Calendar, TrendingUp, Droplet } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Home() {
  const { profile } = useOutletContext();
  const [logs, setLogs] = useState(null);
  const [insight, setInsight] = useState(null);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [logData, insightData] = await Promise.all([
        symptomLogService.list(200),
        insightService.getLatest()
      ]);
      setLogs(logData);
      setInsight(insightData || null);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('femcare-log-just-saved') === 'true') {
      sessionStorage.removeItem('femcare-log-just-saved');
      setBounce(true);
      const t = setTimeout(() => setBounce(false), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const indicators = logs ? computeIndicators(logs, profile) : null;
  const lastPeriod = logs?.find(l => l.cycle_started);
  const todayLog = logs?.find(l => l.log_date === format(new Date(), 'yyyy-MM-dd'));
  const cyclePhase = logs ? getCyclePhase(logs) : null;
  const lastMood = logs?.[0]?.mood || 3;

  if (!logs) {
    return <CompanionLoader />;
  }

  return (
    <div className="pt-6 pb-4 space-y-5">
      <div className="animate-card-rise" style={{ animationDelay: '0ms' }}>
        <p className="text-sm text-muted-foreground">{greeting},</p>
        <h1 className="text-2xl font-display font-bold text-foreground">{profile.display_name}</h1>
      </div>

      <div className="glass rounded-2xl p-5 flex items-center gap-4 animate-card-rise" style={{ animationDelay: '50ms' }}>
        <CompanionMascot mood={lastMood} phase={cyclePhase?.phase || 'unknown'} size={88} animate={bounce ? 'bounce' : null} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-muted-foreground mb-2">{cyclePhase?.label || 'Start tracking to see your cycle phase'}</p>
          {cyclePhase?.phase && cyclePhase.phase !== 'unknown' ? (
            <CyclePhaseIndicator currentPhase={cyclePhase.phase} day={cyclePhase.day} />
          ) : (
            <p className="text-xs text-muted-foreground/70">Your companion will reflect your cycle as you log.</p>
          )}
        </div>
      </div>

      <div className="animate-card-rise" style={{ animationDelay: '100ms' }}>
        <DailyAffirmation phase={cyclePhase?.phase} />
      </div>

      {logs.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-center animate-card-rise" style={{ animationDelay: '150ms' }}>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-card/80 mb-3">
            <PlusCircle size={24} className="text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Let's start tracking</h2>
          <p className="text-sm text-foreground/70 mt-1 mb-4 leading-relaxed">
            Your first log takes under a minute. Once you have a few entries, you'll start seeing personalized patterns.
          </p>
          <Link to="/log" className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition">
            <PlusCircle size={16} /> Log your first entry
          </Link>
        </div>
      ) : (
        <>
          <div className="animate-card-rise" style={{ animationDelay: '150ms' }}>
            <ConsistencyBadge logs={logs} />
          </div>
          <div className="grid grid-cols-3 gap-3 animate-card-rise" style={{ animationDelay: '200ms' }}>
            <StatBox icon={Calendar} label="Days Logged" value={indicators.totalLogs} />
            <StatBox icon={Droplet} label="Avg Cycle" value={indicators.avgCycleLength ? `${indicators.avgCycleLength}d` : '—'} />
            <StatBox icon={TrendingUp} label="Last Period" value={lastPeriod ? format(parseISO(lastPeriod.log_date), 'MMM d') : '—'} />
          </div>

          <div className="animate-card-rise" style={{ animationDelay: '250ms' }}>
            <CycleCalendar logs={logs} avgCycleLength={indicators.avgCycleLength || profile.typical_cycle_length} />
          </div>

          {insight ? (
            <>
              <InsightCard insight={insight} compact />
              {insight.doctor_nudge && <DoctorAlert reason={insight.doctor_nudge_reason || 'Your recent tracked patterns suggest a doctor visit may be worthwhile.'} />}
            </>
          ) : (
            <Link to="/insights" className="block glass rounded-2xl p-5 hover:shadow-md transition animate-card-rise" style={{ animationDelay: '250ms' }}>
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-card/80 flex items-center justify-center">
                  <Sparkles size={20} className="text-[hsl(256_40%_45%)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Generate your AI awareness summary</p>
                  <p className="text-xs text-muted-foreground mt-0.5">See what patterns your logs reveal</p>
                </div>
              </div>
            </Link>
          )}

          <div className="animate-card-rise" style={{ animationDelay: '300ms' }}>
            <Link
              to="/log"
              className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground rounded-2xl h-14 text-base font-semibold hover:opacity-90 transition shadow-sm"
            >
              <PlusCircle size={20} />
              {todayLog ? 'Update today\'s log' : 'Log today\'s symptoms'}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function StatBox({ icon: Icon, label, value }) {
  return (
    <div className="glass rounded-2xl p-4 text-center">
      <Icon size={18} className="mx-auto text-muted-foreground mb-1" />
      <p className="text-lg font-semibold text-foreground leading-tight tracking-tight">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}