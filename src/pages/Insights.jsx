import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { symptomLogService } from '@/services/symptomLogs';
import { insightService } from '@/services/insights';
import { computeIndicators, checkRedFlags, computeWeeklyComparison } from '@/lib/insightEngine';
import InsightCard from '@/components/InsightCard';
import DoctorAlert from '@/components/DoctorAlert';
import TrendCharts from '@/components/TrendCharts';
import CompanionLoader from '@/components/CompanionLoader';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';

export default function Insights() {
  const { profile } = useOutletContext();
  const [logs, setLogs] = useState(null);
  const [insight, setInsight] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [logData, insightData] = await Promise.all([
          symptomLogService.list(200),
          insightService.getLatest()
        ]);
        setLogs(logData);
        setInsight(insightData || null);
      } catch (err) {
        console.error('Insights loadData failed:', err);
        setError('Failed to load data');
        setLogs([]);
      }
    }
    loadData();
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      if (!logs || logs.length === 0) {
        setError('You need at least one log entry before we can generate insights. Try logging a few days first.');
        setGenerating(false);
        return;
      }

      const indicators = computeIndicators(logs, profile);
      const redFlags = checkRedFlags(logs, profile);
      const weeklyTrend = computeWeeklyComparison(logs);

      const n = indicators.totalLogs;
      const hasSomeData = indicators.acneAvg > 0.5 || indicators.pelvicPainFrequency > 0 || 
        indicators.facialHairFrequency > 0 || indicators.hairThinningFrequency > 0 ||
        (indicators.avgCycleLength && indicators.totalCycles > 0);

      let awarenessLevel = 'low';
      let impactScore = 0;

      if (indicators.acneAvg > 2.5) impactScore++;
      if (indicators.facialHairFrequency > 0.3) impactScore++;
      if (indicators.hairThinningFrequency > 0.3) impactScore++;
      if (indicators.pelvicPainFrequency > 0.3) impactScore++;
      if (indicators.moodAvg < 2.5) impactScore++;
      if (indicators.sleepAvg < 2.5) impactScore++;
      if (indicators.cravingsAvg > 2.5) impactScore++;
      if (redFlags && redFlags.length > 0) impactScore += 2;
      if (indicators.irregularCycles > indicators.totalCycles * 0.5) impactScore++;
      if (indicators.hasUltrasoundFinding) impactScore += 2;

      if (impactScore >= 6) awarenessLevel = 'high';
      else if (impactScore >= 3) awarenessLevel = 'moderate';

      const symptomImpacts = [];
      if (indicators.acneAvg > 0.5) {
        symptomImpacts.push({ symptom: 'Acne', impact: `Averaged ${indicators.acneAvg.toFixed(1)}/5 across ${n} logs — ${indicators.acneAvg > 2.5 ? 'a noticeable level of skin concern' : `within a ${indicators.acneAvg < 1.5 ? 'manageable' : 'moderate'} range`}` });
      }
      if (indicators.pelvicPainFrequency > 0) {
        symptomImpacts.push({ symptom: 'Pelvic Pain', impact: `Present in ${Math.round(indicators.pelvicPainFrequency * 100)}% of your logs${indicators.pelvicPainFrequency > 0.3 ? ' — may be worth flagging' : ''}` });
      }
      if (indicators.facialHairFrequency > 0) {
        symptomImpacts.push({ symptom: 'Facial/Body Hair', impact: `Noted in ${Math.round(indicators.facialHairFrequency * 100)}% of entries — a common androgen-related marker` });
      }
      if (indicators.hairThinningFrequency > 0) {
        symptomImpacts.push({ symptom: 'Hair Thinning', impact: `Logged in ${Math.round(indicators.hairThinningFrequency * 100)}% of entries — another androgen-related indicator` });
      }
      if (indicators.moodAvg < 4) {
        symptomImpacts.push({ symptom: 'Mood', impact: `Averaged ${indicators.moodAvg.toFixed(1)}/5 — ${indicators.moodAvg < 2.5 ? 'lower than ideal, mood tracking is important' : 'within a reasonable range'}` });
      }
      if (indicators.sleepAvg < 4) {
        symptomImpacts.push({ symptom: 'Sleep', impact: `Averaged ${indicators.sleepAvg.toFixed(1)}/5 — ${indicators.sleepAvg < 2.5 ? 'poor sleep can worsen PCOS symptoms' : 'room for improvement'}` });
      }
      if (indicators.cravingsAvg > 0.5) {
        symptomImpacts.push({ symptom: 'Cravings', impact: `Averaged ${indicators.cravingsAvg.toFixed(1)}/5 intensity — linked to insulin resistance patterns` });
      }

      const correlations = [];
      if (indicators.irregularCycles > 0) {
        correlations.push(`${indicators.irregularCycles} out of ${indicators.totalCycles} cycles were irregular (<21 or >35 days) — irregular cycles are a core Rotterdam criterion for PCOS.`);
      }
      if (indicators.acneAvg > 1 && indicators.facialHairFrequency > 0) {
        correlations.push('Both acne and facial hair growth appeared together — these are potential androgen-related symptoms that increase the Rotterdam criterion count.');
      }
      if (indicators.pelvicPainFrequency > 0.2 && indicators.moodAvg < 3) {
        correlations.push('Higher pelvic pain frequency coincided with lower mood — pain and emotional wellbeing are connected.');
      }
      if (indicators.cravingsAvg > 2 && indicators.weight_change === 'up') {
        correlations.push('Intense cravings may be contributing to weight changes — insulin resistance often plays a role in both cravings and weight gain.');
      }
      if (indicators.avgCycleLength && indicators.avgCycleLength > 35) {
        correlations.push(`Your average cycle length of ~${indicators.avgCycleLength} days is above the typical 28-35 day range — longer cycles are associated with anovulation, a key PCOS feature.`);
      }
      if (indicators.hasUltrasoundFinding) {
        correlations.push('Ultrasound findings (polycystic-appearing ovaries) plus irregular cycles count toward the Rotterdam criteria for PCOS diagnosis.');
      }

      const rotterdamMet = [
        indicators.irregularCycles > 0 || (indicators.avgCycleLength && indicators.avgCycleLength > 35),
        indicators.acneAvg > 1.5 || indicators.facialHairFrequency > 0.2 || indicators.hairThinningFrequency > 0.2,
        indicators.hasUltrasoundFinding,
      ].filter(Boolean).length;

      const reasoningSummary = hasSomeData
        ? `Based on ${n} logs${indicators.dateRange ? ` spanning ${indicators.dateRange.start} to ${indicators.dateRange.end}` : ''}, your overall awareness level is **${awarenessLevel}**. ${rotterdamMet >= 2 ? `You currently meet ${rotterdamMet} out of 3 Rotterdam criteria — this is not a diagnosis, but it suggests discussing PCOS evaluation with your doctor. ` : `You currently meet ${rotterdamMet} out of 3 Rotterdam criteria. `}Keep logging regularly to build a clearer picture for your next doctor visit.`
        : `Based on ${n} logs, we don't yet have enough symptom data to assess your awareness level. Log a few more days of symptoms — especially cycle dates, skin and hair symptoms, and mood — to unlock richer insights.`;

      const doctorNudge = redFlags && redFlags.length > 0;

      const newInsight = {
        awareness_level: awarenessLevel,
        reasoning_summary: reasoningSummary,
        symptom_impacts: symptomImpacts,
        correlations,
        red_flags: redFlags || [],
        doctor_nudge: doctorNudge,
        doctor_nudge_reason: redFlags ? redFlags[0] : null,
        weekly_trend_summary: typeof weeklyTrend === 'string' ? weeklyTrend : null,
        log_count_analyzed: n,
        created_date: new Date().toISOString(),
      };

      const stored = await insightService.generate(newInsight);
      if (stored) {
        setInsight({ ...newInsight, id: stored.id });
      } else {
        setInsight(newInsight);
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
        <div className="glass-card rounded-2xl p-8 text-center animate-card-rise" style={{ animationDelay: '50ms' }}>
          <Sparkles size={28} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">Log a few days of symptoms first — insights need data to work with.</p>
        </div>
      ) : (
        <>
          <div className="glass-card rounded-2xl p-5 animate-card-rise" style={{ animationDelay: '50ms' }}>
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
              <div className="glass-card rounded-2xl p-5 animate-card-rise" style={{ animationDelay: '150ms' }}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-[hsl(256_40%_45%)]" />
                  <h2 className="text-sm font-semibold text-foreground">This Week vs. Last Week</h2>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{insight.weekly_trend_summary}</p>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-5 text-center animate-card-rise" style={{ animationDelay: '150ms' }}>
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