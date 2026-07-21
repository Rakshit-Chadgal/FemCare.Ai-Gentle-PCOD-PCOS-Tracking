import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userProfileService } from '@/services/userProfile';
import { symptomLogService } from '@/services/symptomLogs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import CompanionMascot from '@/components/CompanionMascot';
import { ArrowRight, Calendar, Shield, Heart } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [existingId, setExistingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [name, setName] = useState('');
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [disclaimerAck, setDisclaimerAck] = useState(false);

  useEffect(() => {
    async function checkExisting() {
      try {
        const profile = await userProfileService.get();
        if (profile?.onboarding_completed) {
          navigate('/', { replace: true });
          return;
        }
        if (profile) {
          setExistingId(profile.id);
          setName(profile.display_name || '');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    checkExisting();
  }, [navigate]);

  function handleScroll() {
    const container = scrollRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / container.offsetWidth);
    if (index !== activeSlide) setActiveSlide(index);
  }

  function goToSlide(index) {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({ left: index * container.offsetWidth, behavior: 'smooth' });
  }

  async function completeOnboarding() {
    if (!disclaimerAck || submitting) return;
    setSubmitting(true);
    try {
      const data = {
        display_name: name.trim() || 'Friend',
        disclaimer_acknowledged: true,
        onboarding_completed: true
      };
      if (existingId) {
        await userProfileService.update(data);
      } else {
        await userProfileService.create(data);
      }
      if (lastPeriodDate) {
        await symptomLogService.create({ log_date: lastPeriodDate, cycle_started: true });
      }
      window.location.href = '/';
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-background">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-60 dark:opacity-30 blur-[80px]" style={{ background: 'var(--blob-blush)' }} />
        <div className="absolute top-[30%] right-[-15%] w-[55%] h-[55%] rounded-full opacity-50 dark:opacity-25 blur-[80px]" style={{ background: 'var(--blob-lavender)' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full opacity-40 dark:opacity-20 blur-[80px]" style={{ background: 'var(--blob-cream)' }} />
      </div>

      {/* Skip button */}
      {activeSlide < 3 && (
        <button
          onClick={() => goToSlide(3)}
          className="absolute top-6 right-5 z-20 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          Skip
        </button>
      )}

      {/* Slides */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative z-10 h-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
      >
        <div className="flex h-full">
          {/* Slide 1: Welcome */}
          <div className="w-full h-full shrink-0 snap-center flex items-center justify-center px-5">
            <div className="glass rounded-3xl p-8 w-full max-w-sm text-center">
              <div className="flex justify-center mb-6">
                <CompanionMascot mood={4} phase="follicular" size={120} />
              </div>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-3">Welcome to FemCare</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                A calm, private space to track your symptoms, notice patterns, and feel more prepared for doctor visits.
              </p>
              <Button onClick={() => goToSlide(1)} className="w-full rounded-[22px] h-12 text-base">
                Get Started <ArrowRight size={18} className="ml-1" />
              </Button>
            </div>
          </div>

          {/* Slide 2: What FemCare Does */}
          <div className="w-full h-full shrink-0 snap-center flex items-center justify-center px-5">
            <div className="glass rounded-3xl p-8 w-full max-w-sm text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/30 mb-6">
                <Shield size={28} className="text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-3">Awareness, not diagnosis</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                FemCare helps you log symptoms, spot trends over time, and generate a summary for your doctor.
              </p>
              <p className="text-xs text-foreground/70 leading-relaxed mb-8 rounded-2xl bg-secondary/50 p-4">
                FemCare is an awareness and tracking tool — not a medical diagnostic device. It does not diagnose PCOD/PCOS or any condition. Always consult a licensed doctor.
              </p>
              <Button onClick={() => goToSlide(2)} className="w-full rounded-[22px] h-12 text-base">
                Continue <ArrowRight size={18} className="ml-1" />
              </Button>
            </div>
          </div>

          {/* Slide 3: Quick Setup */}
          <div className="w-full h-full shrink-0 snap-center flex items-center justify-center px-5">
            <div className="glass rounded-3xl p-8 w-full max-w-sm">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 mb-4">
                  <Heart size={24} className="text-primary" />
                </div>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-1">Let's personalize</h2>
                <p className="text-xs text-muted-foreground">Optional — you can skip and add these later.</p>
              </div>
              <div className="space-y-4 text-left">
                <div>
                  <Label className="text-xs text-muted-foreground">Your name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="What should we call you?"
                    className="rounded-xl mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar size={11} /> Last period start date
                  </Label>
                  <Input
                    type="date"
                    value={lastPeriodDate}
                    onChange={(e) => setLastPeriodDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="rounded-xl mt-1.5"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => goToSlide(3)} className="flex-1 rounded-[22px] h-12">
                  Skip
                </Button>
                <Button onClick={() => goToSlide(3)} className="flex-1 rounded-[22px] h-12">
                  Continue
                </Button>
              </div>
            </div>
          </div>

          {/* Slide 4: All Set */}
          <div className="w-full h-full shrink-0 snap-center flex items-center justify-center px-5">
            <div className="glass rounded-3xl p-8 w-full max-w-sm text-center">
              <div className="flex justify-center mb-6">
                <CompanionMascot mood={5} phase="ovulation" size={110} />
              </div>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-2">You're all set!</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Let's start tracking your patterns together. You can update everything later in your profile.
              </p>
              <div className="rounded-2xl bg-secondary/50 p-4 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="onboarding-disclaimer"
                    checked={disclaimerAck}
                    onCheckedChange={(v) => setDisclaimerAck(!!v)}
                    className="mt-0.5"
                  />
                  <label htmlFor="onboarding-disclaimer" className="text-xs text-foreground/90 cursor-pointer leading-relaxed">
                    I understand FemCare is an awareness and tracking tool, not a medical diagnostic device. I will consult a licensed doctor for diagnosis or treatment.
                  </label>
                </div>
              </div>
              <Button
                onClick={completeOnboarding}
                disabled={!disclaimerAck || submitting}
                className="w-full rounded-[22px] h-12 text-base"
              >
                {submitting ? 'Setting up...' : <>Enter FemCare <ArrowRight size={18} className="ml-1" /></>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeSlide ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}