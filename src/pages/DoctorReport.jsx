import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { symptomLogService } from '@/services/symptomLogs';
import { insightService } from '@/services/insights';
import { Button } from '@/components/ui/button';
import { Printer, FileText, Calendar, Droplet, Heart, Moon } from 'lucide-react';
import { format, subDays, isAfter, parseISO, differenceInDays } from 'date-fns';

const periods = [30, 60, 90];

export default function DoctorReport() {
  const { profile } = useOutletContext();
  const [logs, setLogs] = useState(null);
  const [insight, setInsight] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    async function loadData() {
      const [logData, insightData] = await Promise.all([
        symptomLogService.list(500),
        insightService.getLatest()
      ]);
      setLogs(logData);
      setInsight(insightData || null);
    }
    loadData();
  }, []);

  const report = useMemo(() => {
    if (!logs) return null;
    const cutoff = subDays(new Date(), selectedPeriod);
    const recent = logs.filter(l => isAfter(parseISO(l.log_date), cutoff));
    const sorted = [...recent].sort((a, b) => new Date(a.log_date) - new Date(b.log_date));
    const n = sorted.length;

    const cycleStarts = sorted.filter(l => l.cycle_started).map(l => l.log_date);
    const intervals = [];
    for (let i = 1; i < cycleStarts.length; i++) {
      intervals.push(differenceInDays(parseISO(cycleStarts[i]), parseISO(cycleStarts[i - 1])));
    }
    const avgCycle = intervals.length > 0 ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length) : null;
    const irregularCount = intervals.filter(d => d < 21 || d > 35).length;

    return {
      totalLogs: n,
      startDate: sorted.length > 0 ? sorted[0].log_date : null,
      endDate: sorted.length > 0 ? sorted[n - 1].log_date : null,
      cycleStarts,
      intervals,
      avgCycle,
      irregularCount,
      acneAvg: n > 0 ? (sorted.reduce((a, l) => a + (l.acne_severity || 0), 0) / n).toFixed(1) : '0.0',
      acneActive: n > 0 ? sorted.filter(l => (l.acne_severity || 0) >= 2).length : 0,
      facialHairPct: n > 0 ? Math.round(sorted.filter(l => l.facial_hair_growth).length / n * 100) : 0,
      hairThinningPct: n > 0 ? Math.round(sorted.filter(l => l.hair_thinning).length / n * 100) : 0,
      pelvicPainPct: n > 0 ? Math.round(sorted.filter(l => l.pelvic_pain).length / n * 100) : 0,
      moodAvg: n > 0 ? (sorted.reduce((a, l) => a + (l.mood || 3), 0) / n).toFixed(1) : '—',
      sleepAvg: n > 0 ? (sorted.reduce((a, l) => a + (l.sleep_quality || 3), 0) / n).toFixed(1) : '—',
      cravingsAvg: n > 0 ? (sorted.reduce((a, l) => a + (l.cravings_intensity || 0), 0) / n).toFixed(1) : '—',
      weightUp: sorted.filter(l => l.weight_change === 'up').length,
      weightDown: sorted.filter(l => l.weight_change === 'down').length,
      notes: sorted.filter(l => l.notes).map(l => ({ date: l.log_date, note: l.notes }))
    };
  }, [logs, selectedPeriod]);

  if (!logs || !report) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="pt-6 pb-4">
      <div className="no-print mb-5">
        <h1 className="text-2xl font-bold text-foreground">Doctor Visit Report</h1>
        <p className="text-sm text-muted-foreground mt-1">A clean summary to bring to your gynecologist.</p>
      </div>

      <div className="no-print flex items-center gap-2 mb-5">
        {periods.map(p => (
          <button
            key={p}
            onClick={() => setSelectedPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              selectedPeriod === p ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            Last {p} days
          </button>
        ))}
        <Button onClick={() => window.print()} className="ml-auto rounded-xl h-10 px-4">
          <Printer size={16} className="mr-1.5" /> Print / Save PDF
        </Button>
      </div>

      <div className="print-area rounded-2xl bg-card border border-border/60 p-6 shadow-sm space-y-6">
        <div className="text-center pb-4 border-b border-border/40">
          <div className="inline-flex items-center gap-2 mb-1">
            <FileText size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-foreground">FemCare Symptom Summary</h2>
          </div>
          <p className="text-xs text-muted-foreground">Generated {format(new Date(), 'MMMM d, yyyy')}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Patient</p>
            <p className="font-semibold text-foreground">{profile.display_name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Age</p>
            <p className="font-semibold text-foreground">{profile.age || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Diagnosis Status</p>
            <p className="font-semibold text-foreground capitalize">{(profile.diagnosis_status || 'not_sure').replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Self-reported Cycle Pattern</p>
            <p className="font-semibold text-foreground">{(profile.cycle_regularity || 'unknown').replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ultrasound Finding</p>
            <p className="font-semibold text-foreground">{profile.has_ultrasound_finding ? 'Polycystic ovaries noted' : 'None reported'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reporting Period</p>
            <p className="font-semibold text-foreground">
              {report.startDate ? `${format(parseISO(report.startDate), 'MMM d')} – ${format(parseISO(report.endDate), 'MMM d, yyyy')}` : 'No data'}
            </p>
          </div>
        </div>

        {report.totalLogs === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No logs in this period. Start tracking to generate a meaningful report.</p>
          </div>
        ) : (
          <>
            <ReportSection icon={Calendar} title="Cycle History">
              {report.cycleStarts.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {report.cycleStarts.map((d, i) => (
                      <span key={i} className="text-xs bg-blush px-2 py-1 rounded-lg font-medium text-foreground">
                        {format(parseISO(d), 'MMM d')}
                      </span>
                    ))}
                  </div>
                  {report.intervals.length > 0 && (
                    <div className="text-sm text-foreground/80">
                      <p>Cycle intervals: {report.intervals.join(', ')} days</p>
                      <p>Average cycle length: <strong>{report.avgCycle} days</strong></p>
                      <p>Cycles outside 21–35 day range: {report.irregularCount} of {report.intervals.length}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No period starts logged in this period.</p>
              )}
            </ReportSection>

            <ReportSection icon={Droplet} title="Symptom Summary">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">Symptom</th>
                    <th className="text-right py-2 text-xs text-muted-foreground font-medium">Frequency</th>
                    <th className="text-right py-2 text-xs text-muted-foreground font-medium">Avg Severity</th>
                  </tr>
                </thead>
                <tbody>
                  <ReportRow label="Acne (severity ≥ 2)" value={`${report.acneActive}/${report.totalLogs} logs`} detail={`Avg: ${report.acneAvg}/5`} />
                  <ReportRow label="Facial/body hair growth" value={`${report.facialHairPct}%`} detail="—" />
                  <ReportRow label="Hair thinning/loss" value={`${report.hairThinningPct}%`} detail="—" />
                  <ReportRow label="Pelvic pain" value={`${report.pelvicPainPct}%`} detail="—" />
                  <ReportRow label="Food cravings" value={`${report.totalLogs} logs`} detail={`Avg: ${report.cravingsAvg}/5`} />
                  <ReportRow label="Weight increased" value={`${report.weightUp} logs`} detail="—" />
                  <ReportRow label="Weight decreased" value={`${report.weightDown} logs`} detail="—" />
                </tbody>
              </table>
            </ReportSection>

            <ReportSection icon={Heart} title="Wellbeing Averages">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-blush/50 p-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Heart size={12} /> Mood</p>
                  <p className="text-lg font-bold text-foreground">{report.moodAvg}<span className="text-xs text-muted-foreground">/5</span></p>
                </div>
                <div className="rounded-xl bg-lavender/50 p-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Moon size={12} /> Sleep Quality</p>
                  <p className="text-lg font-bold text-foreground">{report.sleepAvg}<span className="text-xs text-muted-foreground">/5</span></p>
                </div>
              </div>
            </ReportSection>

            {insight && (
              <ReportSection icon={FileText} title="AI Awareness Summary">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Awareness Level</span>
                    <span className={`text-sm font-bold capitalize ${
                      insight.awareness_level === 'low' ? 'text-low' :
                      insight.awareness_level === 'moderate' ? 'text-moderate' : 'text-high'
                    }`}>{insight.awareness_level}</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{insight.reasoning_summary}</p>
                  {insight.correlations?.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Patterns noticed:</p>
                      <ul className="list-disc pl-5 space-y-0.5">
                        {insight.correlations.map((c, i) => <li key={i} className="text-xs text-foreground/70">{c}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </ReportSection>
            )}

            {report.notes.length > 0 && (
              <ReportSection icon={FileText} title="Patient Notes">
                <div className="space-y-2">
                  {report.notes.map((n, i) => (
                    <div key={i} className="text-sm">
                      <span className="text-xs text-muted-foreground font-medium">{format(parseISO(n.date), 'MMM d')}:</span>{' '}
                      <span className="text-foreground/80">{n.note}</span>
                    </div>
                  ))}
                </div>
              </ReportSection>
            )}

            <div className="pt-4 border-t border-border/40">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <strong>Disclaimer:</strong> This report was generated by FemCare, an awareness and tracking tool. It summarizes self-reported symptoms and is <strong>not a medical diagnosis</strong>. The AI awareness summary is for informational purposes only. Please consult a licensed healthcare provider for evaluation, diagnosis, and treatment.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ReportSection({ icon: Icon, title, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ReportRow({ label, value, detail }) {
  return (
    <tr className="border-b border-border/20">
      <td className="py-2 text-sm text-foreground/80">{label}</td>
      <td className="py-2 text-right text-sm font-medium text-foreground">{value}</td>
      <td className="py-2 text-right text-sm text-muted-foreground">{detail}</td>
    </tr>
  );
}