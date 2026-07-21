import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { symptomLogService } from '@/services/symptomLogs';
import { insightService } from '@/services/insights';
import InsightCard from '@/components/InsightCard';
import DoctorAlert from '@/components/DoctorAlert';
import TrendCharts from '@/components/TrendCharts';
import CompanionLoader from '@/components/CompanionLoader';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function Insights() {
  const { profile } = useOutletContext();
  const [logs, setLogs] = useState(null);
  const [insight, setInsight] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

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

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const newInsight = await insightService.generate();
      if (newInsight) {
        setInsight(newInsight);
      } else {
        setError('You need at least one log entry before we can generate insights. Try logging a few days first.');
      }
    } catch (e) {
      console.error(e);
      setError('Something went wrong. Please try again in a moment.');
    } finally {
      setGenerating(false);
    }
  }

  if (!logs) {
    return <CompanionLoader />;
  }

  return (
    <div className="pt-6 pb-4 space-y-5">
      <div className="animate-card-rise" style={{ animationDelay: '0ms' }}>
        <h1 className="text-2xl font-semibold text-foreground">Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">AI awareness summaries and your trend patterns.</p>
      </div>

      {logs.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center animate-card-rise" style={{ animationDelay: '50ms' }}>
          <Sparkles size={28} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">Log a few days of symptoms first — insights need data to work with.</p>
        </div>
      ) : (
        <>
          <div className="glass rounded-2xl p-5 animate-card-rise" style={{ animationDelay: '50ms' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-card/80 flex items-center justify-center">
                <Sparkles size={20} className="text-[hsl(256_40%_45%)]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">AI Awareness Engine</h2>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Reviews your logged history and cross-references cycle patterns, androgen signs, and ultrasound info (Rotterdam-style) for an awareness level — not a diagnosis.
                </p>
              </div>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full rounded-[22px] h-11 font-semibold"
            >
              {generating ? (
                <><RefreshCw size={16} className="mr-2 animate-spin" /> Analyzing your patterns...</>
              ) : insight ? (
                <><RefreshCw size={16} className="mr-2" /> Refresh Awareness Summary</>
              ) : (
                <><Sparkles size={16} className="mr-2" /> Generate Awareness Summary</>
              )}
            </Button>
            {error && (
              <div className="mt-3 flex items-start gap-2 text-xs text-destructive bg-destructive/5 rounded-lg p-3">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {insight && (
            <>
              <InsightCard insight={insight} />
              {insight.doctor_nudge && (
                <DoctorAlert reason={insight.doctor_nudge_reason || 'Your recent tracked patterns suggest a doctor visit may be worthwhile.'} />
              )}
            </>
          )}

          {insight && (
            insight.weekly_trend_summary ? (
              <div className="glass rounded-2xl p-5 animate-card-rise" style={{ animationDelay: '150ms' }}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-[hsl(256_40%_45%)]" />
                  <h2 className="text-sm font-semibold text-foreground">This Week vs. Last Week</h2>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{insight.weekly_trend_summary}</p>
              </div>
            ) : (
              <div className="glass rounded-2xl p-5 text-center animate-card-rise" style={{ animationDelay: '150ms' }}>
                <p className="text-sm text-muted-foreground">Keep logging to start seeing weekly trends.</p>
              </div>
            )
          )}

          <div className="animate-card-rise" style={{ animationDelay: '200ms' }}>
            <h2 className="text-lg font-semibold text-foreground mb-3">Your Trends</h2>
            <TrendCharts logs={logs} />
          </div>
        </>
      )}
    </div>
  );
}