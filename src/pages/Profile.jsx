import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { authService } from '@/services/auth';
import { userProfileService } from '@/services/userProfile';
import { symptomLogService } from '@/services/symptomLogs';
import { insightService } from '@/services/insights';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { FileText, LogOut, Shield, Pencil, Check, X, BookOpen, Mail, Download, Trash2, AlertTriangle } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import DailyReminder from '@/components/DailyReminder';

const diagnosisLabels = { suspect: 'Suspects PCOD/PCOS', diagnosed: 'Diagnosed', not_sure: 'Not sure yet' };
const cycleLabels = { regular: 'Regular (21–35 days)', irregular: 'Irregular', very_irregular: 'Very irregular', unknown: 'Unknown' };

export default function Profile() {
  const { profile, setProfile } = useOutletContext();
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authService.me().then(user => setEmail(user.email || '')).catch(() => {});
  }, []);

  function startEdit() {
    setEditData({
      display_name: profile.display_name || '',
      age: profile.age || '',
      diagnosis_status: profile.diagnosis_status || 'not_sure',
      cycle_regularity: profile.cycle_regularity || 'unknown',
      typical_cycle_length: profile.typical_cycle_length || '',
      has_ultrasound_finding: profile.has_ultrasound_finding || false,
      ultrasound_notes: profile.ultrasound_notes || ''
    });
    setEditing(true);
  }

  async function saveEdit() {
    setSaving(true);
    try {
      const data = {
        ...editData,
        age: editData.age ? Number(editData.age) : null,
        typical_cycle_length: editData.typical_cycle_length ? Number(editData.typical_cycle_length) : null
      };
      await userProfileService.update(data);
      setProfile({ ...profile, ...data });
      setEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    authService.logout();
    window.location.href = '/login';
  }

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleExport() {
    const logs = await symptomLogService.list(500);
    const data = { exported_at: new Date().toISOString(), profile, symptom_logs: logs };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `femcare-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      await symptomLogService.removeAll();
      await insightService.removeAll();
      await userProfileService.remove();
      authService.logout();
      window.location.href = '/login';
    } catch (e) {
      console.error(e);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  const displayProfile = editing ? editData : profile;

  return (
    <div className="pt-6 pb-4 space-y-5">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/40 flex items-center justify-center text-2xl font-bold text-primary">
          {profile.display_name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{profile.display_name}</h1>
          {email && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Mail size={12} /> {email}</p>}
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Health Profile</h2>
          {!editing && (
            <button onClick={startEdit} className="text-xs font-medium text-primary flex items-center gap-1 hover:underline">
              <Pencil size={12} /> Edit
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Name</Label>
            {editing ? (
              <Input value={editData.display_name} onChange={(e) => setEditData({ ...editData, display_name: e.target.value })} className="rounded-xl mt-1" />
            ) : (
              <p className="text-sm font-medium text-foreground">{profile.display_name}</p>
            )}
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Age</Label>
            {editing ? (
              <Input type="number" value={editData.age} onChange={(e) => setEditData({ ...editData, age: e.target.value })} className="rounded-xl mt-1" />
            ) : (
              <p className="text-sm font-medium text-foreground">{profile.age || '—'}</p>
            )}
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Diagnosis Status</Label>
            {editing ? (
              <select
                value={editData.diagnosis_status}
                onChange={(e) => setEditData({ ...editData, diagnosis_status: e.target.value })}
                className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm mt-1"
              >
                <option value="suspect">Suspects PCOD/PCOS</option>
                <option value="diagnosed">Diagnosed</option>
                <option value="not_sure">Not sure yet</option>
              </select>
            ) : (
              <p className="text-sm font-medium text-foreground">{diagnosisLabels[profile.diagnosis_status]}</p>
            )}
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Cycle Regularity</Label>
            {editing ? (
              <select
                value={editData.cycle_regularity}
                onChange={(e) => setEditData({ ...editData, cycle_regularity: e.target.value })}
                className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm mt-1"
              >
                <option value="regular">Regular (21–35 days)</option>
                <option value="irregular">Irregular</option>
                <option value="very_irregular">Very irregular</option>
                <option value="unknown">Unknown</option>
              </select>
            ) : (
              <p className="text-sm font-medium text-foreground">{cycleLabels[profile.cycle_regularity]}</p>
            )}
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Typical Cycle Length</Label>
            {editing ? (
              <Input type="number" value={editData.typical_cycle_length} onChange={(e) => setEditData({ ...editData, typical_cycle_length: e.target.value })} placeholder="days" className="rounded-xl mt-1" />
            ) : (
              <p className="text-sm font-medium text-foreground">{profile.typical_cycle_length ? `${profile.typical_cycle_length} days` : '—'}</p>
            )}
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Ultrasound Finding</Label>
            {editing ? (
              <div className="flex items-center gap-2 mt-1">
                <Checkbox checked={editData.has_ultrasound_finding} onCheckedChange={(v) => setEditData({ ...editData, has_ultrasound_finding: !!v })} />
                <span className="text-sm text-foreground">Polycystic ovaries on ultrasound</span>
              </div>
            ) : (
              <p className="text-sm font-medium text-foreground">{profile.has_ultrasound_finding ? 'Yes — polycystic ovaries noted' : 'No / not reported'}</p>
            )}
          </div>

          {editing && (
            <div className="flex gap-2 pt-2">
              <Button onClick={saveEdit} disabled={saving} className="flex-1 rounded-xl h-10">
                <Check size={16} className="mr-1" /> {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)} className="rounded-xl h-10 px-4">
                <X size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Link to="/doctor-report" className="block rounded-2xl bg-card border border-border/60 p-4 shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blush flex items-center justify-center">
            <FileText size={18} className="text-[hsl(338_50%_45%)]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Doctor Visit Report</p>
            <p className="text-xs text-muted-foreground">Generate a printable summary to bring to your gynecologist</p>
          </div>
        </div>
      </Link>

      <Link to="/learn" className="block rounded-2xl bg-card border border-border/60 p-4 shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lavender flex items-center justify-center">
            <BookOpen size={18} className="text-[hsl(256_40%_45%)]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Learn Section</p>
            <p className="text-xs text-muted-foreground">Credible articles on PCOD/PCOS</p>
          </div>
        </div>
      </Link>

      <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Appearance</p>
            <p className="text-xs text-muted-foreground mt-0.5">Switch between light and dark</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-sm">
        <DailyReminder />
      </div>

      <div className="rounded-2xl bg-low-soft border border-low/30 p-4">
        <div className="flex items-start gap-3">
          <Shield size={18} className="shrink-0 text-low mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Your data is private</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Only you can see your logs, insights, and profile. Your data is never shared with other users.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-sm">
        <p className="text-sm font-semibold text-foreground mb-3">Your data</p>
        <button onClick={handleExport} className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:bg-accent/20 transition text-left">
          <Download size={16} className="text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Export my data</p>
            <p className="text-xs text-muted-foreground">Download all your logs as a JSON file</p>
          </div>
        </button>
      </div>

      <div className="flex gap-4 px-1 text-xs">
        <Link to="/privacy" className="text-muted-foreground hover:text-primary transition">Privacy Policy</Link>
        <Link to="/terms" className="text-muted-foreground hover:text-primary transition">Terms of Service</Link>
      </div>

      {!showDeleteConfirm ? (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition py-3"
        >
          <Trash2 size={16} /> Delete my account
        </button>
      ) : (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle size={16} className="text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/80 leading-relaxed">
              This permanently deletes all your logs, insights, and profile. This cannot be undone.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDeleteAccount} disabled={deleting} className="flex-1 rounded-xl bg-destructive text-destructive-foreground h-10 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
              {deleting ? 'Deleting...' : 'Yes, delete everything'}
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="rounded-xl border border-border px-4 h-10 text-sm font-medium hover:bg-accent/20 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition py-3"
      >
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}