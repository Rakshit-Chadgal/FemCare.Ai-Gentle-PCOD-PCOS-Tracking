import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { symptomLogService } from '@/services/symptomLogs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SeveritySlider from '@/components/SeveritySlider';
import MoodStickerPicker from '@/components/MoodStickerPicker';
import BodyOutlinePicker from '@/components/BodyOutlinePicker';
import SymptomChip from '@/components/SymptomChip';
import LogTemplates from '@/components/LogTemplates';
import PetalCelebration from '@/components/PetalCelebration';
import CompanionMascot from '@/components/CompanionMascot';
import CompanionLoader from '@/components/CompanionLoader';
import { format } from 'date-fns';
import { Check, ArrowRight, Droplet, Sparkle, Scale, Heart, PenLine, Activity, TrendingDown, User, Trash2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const defaultForm = {
  log_date: format(new Date(), 'yyyy-MM-dd'),
  cycle_started: false,
  cycle_ended: false,
  acne_severity: 0,
  facial_hair_growth: false,
  hair_thinning: false,
  weight_change: 'unknown',
  mood: 3,
  sleep_quality: 3,
  pelvic_pain: false,
  pelvic_pain_severity: 0,
  cravings_intensity: 0,
  notes: '',
  discomfort_areas: []
};

export default function Log() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ ...defaultForm, log_date: searchParams.get('date') || defaultForm.log_date });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    async function checkExisting() {
      try {
        const existing = await symptomLogService.getByDate(formData.log_date);
        if (existing) {
          setFormData({ ...defaultForm, ...existing });
          setEditingId(existing.id);
        } else {
          setEditingId(null);
          setFormData({ ...defaultForm, log_date: formData.log_date });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    checkExisting();
  }, [formData.log_date]);

  function update(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function applyTemplate(applied) {
    setFormData(prev => ({ ...applied, log_date: prev.log_date, notes: prev.notes }));
    setSaved(false);
  }

  function handleDateChange(e) {
    setFormData({ ...defaultForm, log_date: e.target.value });
    setSaved(false);
  }

  function shiftDate(days) {
    const current = new Date(formData.log_date + 'T00:00:00');
    current.setDate(current.getDate() + days);
    const max = new Date();
    max.setHours(23, 59, 59, 999);
    if (current > max) return;
    setFormData({ ...defaultForm, log_date: format(current, 'yyyy-MM-dd') });
    setSaved(false);
  }

  const formattedDate = (() => {
    try {
      const d = new Date(formData.log_date + 'T00:00:00');
      return format(d, 'EEEE, MMMM d');
    } catch {
      return formData.log_date;
    }
  })();

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await symptomLogService.update(editingId, formData);
      } else {
        const created = await symptomLogService.create(formData);
        setEditingId(created.id);
      }
      sessionStorage.setItem('femcare-log-just-saved', 'true');
      setSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!editingId) return;
    setDeleting(true);
    try {
      await symptomLogService.remove(editingId);
      setFormData({ ...defaultForm, log_date: formData.log_date });
      setEditingId(null);
      setSaved(false);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <CompanionLoader />;
  }

  if (saved) {
    return (
      <div className="pt-10 px-2 relative">
        <PetalCelebration />
        <div className="glass-card rounded-3xl p-8 text-center relative z-10 animate-card-rise">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          <div className="relative">
            <div className="flex justify-center mb-5">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm">
                <CompanionMascot mood={5} phase="ovulation" size={72} animate="bounce" />
              </div>
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-400/20 backdrop-blur-sm mb-5 ring-1 ring-emerald-400/20">
              <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
                <path d="M 6 14 L 12 20 L 22 8" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark" />
              </svg>
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground">Your log is saved</h2>
            <p className="text-sm text-muted-foreground mt-1.5 mb-7 leading-relaxed">
              Every entry helps paint a clearer picture of your patterns.
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <Link to="/insights" className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-[hsl(340_65%_60%)] text-primary-foreground rounded-full h-12 text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-primary/20">
                View your trends <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => setSaved(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
              >
                Review this log
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-28">
      <div className="relative mb-6 px-1">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[300px] h-[120px] rounded-full bg-gradient-to-r from-primary/8 via-accent/6 to-blush/8 blur-3xl pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl font-display font-bold text-foreground">How are you today?</h1>
          <p className="text-sm text-muted-foreground mt-1">Takes under a minute. Be honest — this is just for you.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between animate-card-rise" style={{ animationDelay: '0ms' }}>
          <button type="button" onClick={() => shiftDate(-1)} aria-label="Previous day" className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition">
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2.5">
            <Calendar size={16} className="text-primary/70" />
            <span className="text-sm font-semibold text-foreground">{formattedDate}</span>
          </div>
          <button type="button" onClick={() => shiftDate(1)} aria-label="Next day" className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="animate-card-rise" style={{ animationDelay: '50ms' }}>
          <LogTemplates formData={formData} onApply={applyTemplate} />
        </div>

        <div className="space-y-3 stagger-cards">
          <SectionCard
            icon={Droplet}
            title="Cycle"
            color="from-rose-400/20 to-pink-400/10"
            iconColor="text-rose-400"
            isActive={activeSection === 'cycle'}
            onToggle={() => setActiveSection(activeSection === 'cycle' ? null : 'cycle')}
          >
            <div className="space-y-2.5">
              <SymptomChip icon={Droplet} label="Period started" selected={formData.cycle_started} onClick={() => update('cycle_started', !formData.cycle_started)} />
              <SymptomChip icon={Check} label="Period ended" selected={formData.cycle_ended} onClick={() => update('cycle_ended', !formData.cycle_ended)} />
            </div>
          </SectionCard>

          <SectionCard
            icon={Sparkle}
            title="Skin & Hair"
            color="from-amber-400/20 to-orange-400/10"
            iconColor="text-amber-400"
            isActive={activeSection === 'skin'}
            onToggle={() => setActiveSection(activeSection === 'skin' ? null : 'skin')}
          >
            <div className="space-y-5">
              <SeveritySlider label="Acne severity" emoji="🔵" value={formData.acne_severity} onChange={(v) => update('acne_severity', v)} leftLabel="Clear" rightLabel="Severe" />
              <div className="space-y-2.5">
                <SymptomChip icon={User} label="Facial or body hair growth" selected={formData.facial_hair_growth} onClick={() => update('facial_hair_growth', !formData.facial_hair_growth)} />
                <SymptomChip icon={TrendingDown} label="Hair thinning or shedding" selected={formData.hair_thinning} onClick={() => update('hair_thinning', !formData.hair_thinning)} />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={Scale}
            title="Body"
            color="from-purple-400/20 to-violet-400/10"
            iconColor="text-purple-400"
            isActive={activeSection === 'body'}
            onToggle={() => setActiveSection(activeSection === 'body' ? null : 'body')}
          >
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2.5 block">Weight compared to last week</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: 'up', l: 'Up', icon: '↗' },
                    { v: 'same', l: 'Same', icon: '→' },
                    { v: 'down', l: 'Down', icon: '↘' }
                  ].map(opt => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => update('weight_change', opt.v)}
                      className={`glass-pill py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        formData.weight_change === opt.v
                          ? 'border-primary/50 bg-primary/5 text-primary shadow-sm shadow-primary/10'
                          : 'border-transparent bg-white/40 dark:bg-white/5 text-muted-foreground hover:bg-white/60 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="mr-1">{opt.icon}</span> {opt.l}
                    </button>
                  ))}
                </div>
              </div>
              <SymptomChip icon={Activity} label="Pelvic pain or discomfort" selected={formData.pelvic_pain} onClick={() => update('pelvic_pain', !formData.pelvic_pain)} />
              {formData.pelvic_pain && (
                <div className="pl-1 pt-1 animate-card-rise">
                  <SeveritySlider label="Pain severity" value={formData.pelvic_pain_severity} onChange={(v) => update('pelvic_pain_severity', v)} leftLabel="Mild" rightLabel="Severe" />
                </div>
              )}
              <div className="pt-2">
                <Label className="text-sm font-medium mb-2.5 block">Where are you feeling discomfort?</Label>
                <div className="glass-card rounded-2xl p-3 bg-white/40 dark:bg-white/5">
                  <BodyOutlinePicker selected={formData.discomfort_areas || []} onChange={(v) => update('discomfort_areas', v)} />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={Heart}
            title="Wellbeing"
            color="from-emerald-400/20 to-teal-400/10"
            iconColor="text-emerald-400"
            isActive={activeSection === 'wellbeing'}
            onToggle={() => setActiveSection(activeSection === 'wellbeing' ? null : 'wellbeing')}
          >
            <div className="space-y-5">
              <div>
                <Label className="text-sm font-medium mb-2.5 block">Mood</Label>
                <MoodStickerPicker value={formData.mood} onChange={(v) => update('mood', v)} />
              </div>
              <SeveritySlider label="Sleep quality" emoji="😴" value={formData.sleep_quality} min={1} max={5} onChange={(v) => update('sleep_quality', v)} leftLabel="Poor" rightLabel="Restful" />
              <SeveritySlider label="Food cravings" emoji="🍫" value={formData.cravings_intensity} onChange={(v) => update('cravings_intensity', v)} leftLabel="None" rightLabel="Intense" />
            </div>
          </SectionCard>

          <SectionCard
            icon={PenLine}
            title="Journal"
            color="from-sky-400/20 to-blue-400/10"
            iconColor="text-sky-400"
            isActive={activeSection === 'journal'}
            onToggle={() => setActiveSection(activeSection === 'journal' ? null : 'journal')}
          >
            <Textarea
              value={formData.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="A private space for anything on your mind today… (optional)"
              className="rounded-2xl min-h-[110px] resize-none bg-white/50 dark:bg-white/5 backdrop-blur-sm border-white/40 dark:border-white/10 focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </SectionCard>
        </div>

        <div className="animate-card-rise pt-2" style={{ animationDelay: '250ms' }}>
          <Button type="submit" disabled={saving} className="w-full rounded-full h-13 text-base font-semibold bg-gradient-to-r from-primary to-[hsl(340_65%_55%)] hover:from-primary/90 hover:to-[hsl(340_65%_50%)] shadow-lg shadow-primary/20 transition-all duration-300">
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </span>
            ) : editingId ? 'Update Log' : 'Save Log'}
          </Button>
        </div>

        {editingId && (
          <div className="animate-card-rise" style={{ animationDelay: '300ms' }}>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition py-3"
            >
              <Trash2 size={16} /> {deleting ? 'Deleting...' : 'Delete this log'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children, color, iconColor, isActive, onToggle }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-white/20 dark:hover:bg-white/5 transition-colors"
      >
        <div className={`shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center ring-1 ring-white/20`}>
          <Icon size={17} className={iconColor} />
        </div>
        <h3 className="text-sm font-semibold text-foreground flex-1">{title}</h3>
        <div className={`w-5 h-5 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
          <ChevronRight size={12} className="text-muted-foreground" />
        </div>
      </button>
      <div className={`px-5 pb-5 transition-all duration-300 ${isActive ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
}
