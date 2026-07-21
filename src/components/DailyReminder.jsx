import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

export default function DailyReminder() {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('09:00');
  const [copy, setCopy] = useState('Quick check-in? 🌸');
  const [permission, setPermission] = useState('default');
  const intervalRef = useRef(null);
  const lastShownRef = useRef('');

  useEffect(() => {
    setEnabled(localStorage.getItem('femcare-reminder-enabled') === 'true');
    setTime(localStorage.getItem('femcare-reminder-time') || '09:00');
    setCopy(localStorage.getItem('femcare-reminder-copy') || 'Quick check-in? 🌸');
    if ('Notification' in window) {
      setPermission(Notification.permission);
    } else {
      setPermission('unsupported');
    }
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!enabled || permission !== 'granted') return;
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const [h, m] = time.split(':').map(Number);
      if (now.getHours() === h && now.getMinutes() === m) {
        const today = now.toDateString();
        if (lastShownRef.current !== today) {
          lastShownRef.current = today;
          try { new Notification('FemCare', { body: copy }); } catch (e) {}
        }
      }
    }, 30000);
    return () => clearInterval(intervalRef.current);
  }, [enabled, time, copy, permission]);

  async function handleToggle() {
    if (!enabled) {
      if ('Notification' in window && Notification.permission !== 'granted') {
        const result = await Notification.requestPermission();
        setPermission(result);
      }
      setEnabled(true);
      localStorage.setItem('femcare-reminder-enabled', 'true');
    } else {
      setEnabled(false);
      localStorage.setItem('femcare-reminder-enabled', 'false');
    }
  }

  const isUnsupported = !('Notification' in window);
  const isDenied = permission === 'denied';
  const showFallback = enabled && (isUnsupported || isDenied);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell size={16} className={enabled ? 'text-primary' : 'text-muted-foreground'} />
          <p className="text-sm font-semibold text-foreground">Daily reminder</p>
        </div>
        <button
          onClick={handleToggle}
          className="relative h-9 w-[68px] rounded-full bg-muted border border-border/60 transition-colors duration-300 overflow-hidden"
          aria-label="Toggle daily reminder"
        >
          <div
            className="absolute top-1 left-0 h-7 w-7 rounded-full bg-card dark:bg-white/15 shadow-md transition-transform duration-300 ease-out"
            style={{ transform: enabled ? 'translateX(36px)' : 'translateX(4px)' }}
          />
        </button>
      </div>

      {enabled && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Reminder time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => { setTime(e.target.value); localStorage.setItem('femcare-reminder-time', e.target.value); }}
              className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Message</label>
            <input
              type="text"
              value={copy}
              maxLength={80}
              onChange={(e) => { setCopy(e.target.value); localStorage.setItem('femcare-reminder-copy', e.target.value); }}
              className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground"
            />
          </div>
        </div>
      )}

      {showFallback && (
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          {isUnsupported
            ? "Your browser doesn't support notifications, but your reminder time is saved for when support is available."
            : "Notifications are blocked — you can enable them in your browser site settings to receive daily reminders."}
        </p>
      )}
    </div>
  );
}