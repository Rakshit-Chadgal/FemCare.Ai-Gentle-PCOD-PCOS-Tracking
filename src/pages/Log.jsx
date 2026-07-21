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
import { Check, ArrowRight, Droplet, Sparkle, Scale, Heart, PenLine, Activity, TrendingDown, User, Trash2 } from 'lucide-react';

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
        <div className="glass rounded-2xl p-8 text-center animate-card-rise relative z-10">
          <div className="flex justify-center mb-4">
            <CompanionMascot mood={5} phase="ovulation" size={64} animate="bounce" />
          </div>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-low/20 mb-4">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M 6 14 L 12 20 L 22 8" stroke="hsl(var(--awareness-low))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-checkmark" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Your log is saved</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Every entry helps paint a clearer picture of your patterns.
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link to="/insights" className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl h-12 text-sm font-semibold hover:opacity-90 transition">
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
    );
  }

  return (
    <div className="pt-6 pb-4">
      <div className="mb-5">
        <h1 className="text-2xl font-display font-bold text-foreground">How are you today?</h1>
        <p className="text-sm text-muted-foreground mt-1">Takes under a minute. Be honest — this is just for you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          value={formData.log_date}
          onChange={handleDateChange}
          max={format(new Date(), 'yyyy-MM-dd')}
          className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm font-medium text-foreground"
        />

        <LogTemplates formData={formData} onApply={applyTemplate} />

        <SectionCard icon={Droplet} title="Cycle" delay={0}>
          <div className="space-y-2.5">
            <SymptomChip icon={Droplet} label="Period started" selected={formData.cycle_started} onClick={() => update('cycle_started', !formData.cycle_started)} />
            <SymptomChip icon={Check} label="Period ended" selected={formData.cycle_ended} onClick={() => update('cycle_ended', !formData.cycle_ended)} />
          </div>
        </SectionCard>

        <SectionCard icon={Sparkle} title="Skin & Hair" delay={50}>
          <div className="space-y-5">
            <SeveritySlider label="Acne severity" emoji="🔵" value={formData.acne_severity} onChange={(v) => update('acne_severity', v)} leftLabel="Clear" rightLabel="Severe" />
            <div className="space-y-2.5">
              <SymptomChip icon={User} label="Facial or body hair growth" selected={formData.facial_hair_growth} onClick={() => update('facial_hair_growth', !formData.facial_hair_growth)} />
              <SymptomChip icon={TrendingDown} label="Hair thinning or shedding" selected={formData.hair_thinning} onClick={() => update('hair_thinning', !formData.hair_thinning)} />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Scale} title="Body" delay={100}>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Weight compared to last week</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: 'up', l: 'Up' },
                  { v: 'same', l: 'Same' },
                  { v: 'down', l: 'Down' }
                ].map(opt => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => update('weight_change', opt.v)}
                    className={`py-2.5 rounded-xl text-sm font-medium border-2 transition ${
                      formData.weight_change === opt.v ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
            <SymptomChip icon={Activity} label="Pelvic pain or discomfort" selected={formData.pelvic_pain} onClick={() => update('pelvic_pain', !formData.pelvic_pain)} />
            {formData.pelvic_pain && (
              <div className="pl-1">
                <SeveritySlider label="Pain severity" value={formData.pelvic_pain_severity} onChange={(v) => update('pelvic_pain_severity', v)} leftLabel="Mild" rightLabel="Severe" />
              </div>
            )}
            <div className="pt-2">
              <Label className="text-sm font-medium mb-2 block">Where are you feeling discomfort?</Label>
              <BodyOutlinePicker selected={formData.discomfort_areas || []} onChange={(v) => update('discomfort_areas', v)} />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Heart} title="Wellbeing" delay={150}>
          <div className="space-y-5">
            <div>
              <Label className="text-sm font-medium mb-2 block">Mood</Label>
              <MoodStickerPicker value={formData.mood} onChange={(v) => update('mood', v)} />
            </div>
            <SeveritySlider label="Sleep quality" emoji="😴" value={formData.sleep_quality} min={1} max={5} onChange={(v) => update('sleep_quality', v)} leftLabel="Poor" rightLabel="Restful" />
            <SeveritySlider label="Food cravings" emoji="🍫" value={formData.cravings_intensity} onChange={(v) => update('cravings_intensity', v)} leftLabel="None" rightLabel="Intense" />
          </div>
        </SectionCard>

        <SectionCard icon={PenLine} title="Journal" delay={200}>
          <Textarea
            value={formData.notes}
            onChange={(e) => update('notes', e.target.value)}
            placeholder="A private space for anything on your mind today… (optional)"
            className="rounded-xl min-h-[100px] resize-none bg-blush/5"
          />
        </SectionCard>

        <div className="animate-card-rise" style={{ animationDelay: '250ms' }}>
          <Button type="submit" disabled={saving} className="w-full rounded-[22px] h-12 text-base font-semibold">
            {saving ? 'Saving...' : editingId ? 'Update Log' : 'Save Log'}
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

function SectionCard({ icon: Icon, title, children, delay = 0 }) {
  return (
    <div className="glass rounded-2xl p-5 animate-card-rise" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}