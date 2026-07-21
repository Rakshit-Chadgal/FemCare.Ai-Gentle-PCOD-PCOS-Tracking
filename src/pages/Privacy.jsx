import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Heart, Database, Lock, UserCheck, FileText } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background px-4 py-8 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-6">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground">Privacy Policy</h1>
        </div>
        <p className="text-xs text-muted-foreground">Last updated: July 2026</p>

        <Section icon={Heart} title="Our promise">
          <p>FemCare is a private health awareness tool. Your data belongs to you. We do not sell, share, or make your data available to any third party.</p>
        </Section>

        <Section icon={Database} title="What we collect">
          <ul className="list-disc pl-5 space-y-1">
            <li>Profile details you provide (name, age, diagnosis status, cycle patterns, ultrasound notes).</li>
            <li>Daily symptom logs (cycle, skin, body, mood, sleep, notes).</li>
            <li>AI-generated awareness summaries based on your logs.</li>
          </ul>
        </Section>

        <Section title="How we use your data">
          <p>We use your data only to provide your tracking, insights, and trends — all visible only to you. Your logs are never shown to other users.</p>
        </Section>

        <Section icon={Lock} title="Storage & security">
          <p>Your data is stored securely and tied to your account. Only you can access it when logged in.</p>
        </Section>

        <Section icon={UserCheck} title="Your rights">
          <p>You can export all your data as a JSON file from your Profile at any time. You can permanently delete your account and all associated data from your Profile — this action cannot be undone.</p>
        </Section>

        <Section icon={FileText} title="Awareness, not diagnosis">
          <p>FemCare is an awareness and tracking tool. It is <strong>not a medical device</strong> and does not provide medical diagnoses. Always consult a licensed healthcare provider for evaluation and treatment.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about your data? Reach out through the app's support channel.</p>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="space-y-1.5">
      <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
        {Icon && <Icon size={14} className="text-muted-foreground" />}
        {title}
      </h2>
      <div className="text-sm text-foreground/80 leading-relaxed">{children}</div>
    </div>
  );
}