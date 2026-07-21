import React, { useState, useEffect } from 'react';
import { logTemplateService } from '@/services/logTemplates';
import { Bookmark, X, Plus } from 'lucide-react';

const TEMPLATE_FIELDS = [
  'cycle_started', 'cycle_ended', 'acne_severity', 'facial_hair_growth',
  'hair_thinning', 'weight_change', 'mood', 'sleep_quality',
  'pelvic_pain', 'pelvic_pain_severity', 'cravings_intensity', 'discomfort_areas'
];

export default function LogTemplates({ formData, onApply }) {
  const [templates, setTemplates] = useState(null);
  const [showSave, setShowSave] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    const data = await logTemplateService.list();
    setTemplates(data);
  }

  function apply(t) {
    const applied = {};
    TEMPLATE_FIELDS.forEach(f => { applied[f] = t[f]; });
    onApply(applied);
  }

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    const data = { template_name: name.trim() };
    TEMPLATE_FIELDS.forEach(f => { data[f] = formData[f]; });
    try {
      await logTemplateService.create(data);
      setName('');
      setShowSave(false);
      await loadTemplates();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    await logTemplateService.remove(id);
    setTemplates(templates.filter(t => t.id !== id));
  }

  if (!templates) return null;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Bookmark size={13} /> Quick templates
        </p>
        {!showSave && (
          <button onClick={() => setShowSave(true)} className="text-xs font-medium text-primary flex items-center gap-1 hover:underline">
            <Plus size={12} /> Save current
          </button>
        )}
      </div>

      {showSave && (
        <div className="flex gap-2 mb-3 animate-card-rise">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Period day, Low mood…"
            className="flex-1 rounded-xl border border-input bg-card px-3 py-2 text-sm"
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
          />
          <button onClick={save} disabled={saving || !name.trim()} className="rounded-xl bg-primary text-primary-foreground px-4 text-sm font-medium disabled:opacity-50">
            {saving ? '…' : 'Save'}
          </button>
          <button onClick={() => { setShowSave(false); setName(''); }} aria-label="Cancel save template" className="rounded-xl border border-border px-3 text-sm text-muted-foreground">
            <X size={14} />
          </button>
        </div>
      )}

      {templates.length === 0 ? (
        <p className="text-xs text-muted-foreground/70 leading-relaxed">
          Save a recurring symptom set, then apply it with one tap next time you log.
        </p>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {templates.map(t => (
            <div key={t.id} className="shrink-0 flex items-center gap-1 bg-card border border-border/60 rounded-full pl-4 pr-1.5 py-1.5">
              <button onClick={() => apply(t)} className="text-sm font-medium text-foreground hover:text-primary transition whitespace-nowrap">
                {t.template_name}
              </button>
              <button
                onClick={() => remove(t.id)}
                aria-label={`Delete template ${t.template_name}`}
                className="w-5 h-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}