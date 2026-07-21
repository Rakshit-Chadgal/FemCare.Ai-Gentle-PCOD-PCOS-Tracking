import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { userProfileService } from '@/services/userProfile';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import BottomNav from '@/components/BottomNav';
import CompanionLoader from '@/components/CompanionLoader';

export default function Layout() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const profile = await userProfileService.get();
        if (!profile || !profile.onboarding_completed) {
          navigate('/onboarding', { replace: true });
          return;
        }
        setProfile(profile);
      } catch (e) {
        console.error('Failed to fetch profile:', e);
      } finally {
        setLoading(false);
      }
    }
    checkOnboarding();
  }, [navigate]);

  if (loading || !profile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <CompanionLoader size={64} />
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-60 dark:opacity-30 blur-[80px]" style={{ background: 'var(--blob-blush)' }} />
        <div className="absolute top-[30%] right-[-15%] w-[55%] h-[55%] rounded-full opacity-50 dark:opacity-25 blur-[80px]" style={{ background: 'var(--blob-lavender)' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full opacity-40 dark:opacity-20 blur-[80px]" style={{ background: 'var(--blob-cream)' }} />
      </div>
      <div className="min-h-screen flex flex-col relative z-10">
        <DisclaimerBanner />
        <main className="flex-1 pb-28 max-w-2xl mx-auto w-full px-4 sm:px-6">
          <Outlet context={{ profile, setProfile }} />
        </main>
        <BottomNav />
      </div>
    </>
  );
}