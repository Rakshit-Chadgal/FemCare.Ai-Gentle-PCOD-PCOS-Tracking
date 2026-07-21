import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, AlertCircle, UserCheck, Scale, RefreshCw, Mail } from 'lucide-react';

export default function Terms() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background px-4 py-8 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-6">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground">Terms of Service</h1>
        </div>
        <p className="text-xs text-muted-foreground">Last updated: July 2026</p>

        <Section title="Acceptance of terms">
          <p>By creating an account and using FemCare, you agree to these terms. If you do not agree, please do not use the app.</p>
        </Section>

        <Section title="The service">
          <p>FemCare is a personal health awareness and symptom tracking tool. It helps you log symptoms, visualize trends, and generate awareness summaries to bring to a healthcare provider.</p>
        </Section>

        <Section icon={AlertCircle} title="Not a medical diagnosis">
          <p>FemCare is <strong>not a medical device</strong> and does not diagnose, treat, cure, or prevent any condition. AI-generated awareness summaries are informational only and are independent of a doctor's evaluation. Always consult a licensed healthcare provider for medical advice, diagnosis, and treatment.</p>
        </Section>

        <Section icon={UserCheck} title="Your responsibilities">
          <ul className="list-disc pl-5 space-y-1">
            <li>You provide accurate information about your own health.</li>
            <li>You are responsible for keeping your account credentials secure.</li>
            <li>You understand the app is for awareness, not diagnosis.</li>
          </ul>
        </Section>

        <Section icon={Scale} title="Limitation of liability">
          <p>FemCare is provided "as is" for personal awareness. We are not liable for health decisions made based on the app's summaries. You are responsible for consulting a qualified healthcare provider.</p>
        </Section>

        <Section title="Age requirement">
          <p>By registering, you confirm that you are 18 years of age or older.</p>
        </Section>

        <Section icon={RefreshCw} title="Changes to these terms">
          <p>We may update these terms occasionally. Continued use of FemCare after changes means you accept the updated terms.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about these terms? Reach out through the app's support channel.</p>
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