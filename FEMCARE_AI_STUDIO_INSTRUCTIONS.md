# FemCare AI — App Building Instructions for Google AI Studio

## PROJECT OVERVIEW

Build a complete single-page web app called "FemCare" — a gentle, privacy-first health tracking companion for individuals managing PCOS/PCOD symptoms. The app is 100% free and open source, for educational purposes only, not a medical device.

## TECH STACK

- **Frontend:** React 18 + Vite + Tailwind CSS 3 + shadcn/ui components
- **Backend/Auth/Database:** Supabase (free tier) — PostgreSQL, Auth, Row Level Security
- **IMPORTANT:** There is NO custom backend server. No Express. No Flask. No Python. No Node.js server. The React frontend talks to Supabase directly via `@supabase/supabase-js`. All auth, database, and storage goes through Supabase client.
- **Typography:** Inter font (Google Fonts, weights 400, 500, 600, 700)
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Charts:** Recharts

## ENVIRONMENT VARIABLES

Create `.env.example`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=from_google_cloud_console
```

## SUPABASE SETUP

1. Create a free project at supabase.com
2. Enable Auth → Email/Password provider (no email confirmation required)
3. Enable Auth → Google provider (add Google Client ID and Secret)
4. Run the following SQL in Supabase SQL Editor:

```sql
-- ============================================================
-- PROFILES — extends Supabase auth.users with health metadata
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name TEXT,
  age INTEGER CHECK (age >= 13),
  diagnosis_status TEXT CHECK (diagnosis_status IN ('confirmed_pcos', 'suspected_pcos', 'exploring', 'other', 'none')),
  cycle_regularity TEXT CHECK (cycle_regularity IN ('regular', 'irregular', 'not_tracking')),
  typical_cycle_length INTEGER CHECK (typical_cycle_length BETWEEN 18 AND 60),
  last_period_date DATE,
  medications TEXT[],
  height_cm NUMERIC,
  weight_kg NUMERIC,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  notification_enabled BOOLEAN DEFAULT TRUE,
  notification_time TIME DEFAULT '09:00',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);


-- ============================================================
-- CYCLE_LOGS — dedicated menstrual cycle tracking
-- ============================================================
CREATE TABLE cycle_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cycle_start_date DATE NOT NULL,
  cycle_end_date DATE,
  period_flow TEXT CHECK (period_flow IN ('spotting', 'light', 'medium', 'heavy')),
  is_predicted BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cycle_logs_user_date ON cycle_logs(user_id, cycle_start_date DESC);


-- ============================================================
-- SYMPTOM_LOGS — daily symptom tracking
-- ============================================================
CREATE TABLE symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  acne_severity INTEGER CHECK (acne_severity BETWEEN 0 AND 4) DEFAULT 0,
  mood INTEGER CHECK (mood BETWEEN 1 AND 5) DEFAULT 3,
  pelvic_pain INTEGER CHECK (pelvic_pain BETWEEN 0 AND 4) DEFAULT 0,
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5) DEFAULT 3,
  sleep_hours NUMERIC CHECK (sleep_hours BETWEEN 0 AND 24),
  cravings_intensity INTEGER CHECK (cravings_intensity BETWEEN 0 AND 4) DEFAULT 0,
  cravings_type TEXT,
  facial_hair_growth BOOLEAN DEFAULT FALSE,
  hair_thinning BOOLEAN DEFAULT FALSE,
  bloating INTEGER CHECK (bloating BETWEEN 0 AND 4) DEFAULT 0,
  anxiety INTEGER CHECK (anxiety BETWEEN 0 AND 4) DEFAULT 0,
  fatigue INTEGER CHECK (fatigue BETWEEN 0 AND 4) DEFAULT 0,
  weight_kg NUMERIC,
  intercourse_pain BOOLEAN DEFAULT FALSE,
  nausea BOOLEAN DEFAULT FALSE,
  headache BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

CREATE INDEX idx_symptom_logs_user_date ON symptom_logs(user_id, log_date DESC);


-- ============================================================
-- AI_INSIGHTS — personalized pattern analysis
-- ============================================================
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  insight_type TEXT CHECK (insight_type IN ('cycle_prediction', 'symptom_correlation', 'lifestyle_tip', 'doctor_alert', 'general')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  is_actionable BOOLEAN DEFAULT FALSE,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_insights_user_generated ON ai_insights(user_id, generated_at DESC);


-- ============================================================
-- HEALTH_REPORTS — doctor-friendly summaries
-- ============================================================
CREATE TABLE health_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  format TEXT CHECK (format IN ('pdf', 'text', 'json')) DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_reports_user ON health_reports(user_id, created_at DESC);


-- ============================================================
-- CHAT_HISTORY — AI companion conversation log
-- ============================================================
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  message TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_history_user ON chat_history(user_id, created_at DESC);


-- ============================================================
-- EDUCATIONAL_CONTENT — articles about hormonal health
-- ============================================================
CREATE TABLE educational_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  read_time_minutes INTEGER DEFAULT 3,
  category TEXT CHECK (category IN ('basics', 'nutrition', 'exercise', 'mental_health', 'treatment', 'myth_busting')),
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- ROW LEVEL SECURITY — strict user isolation
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;

-- Users own their data
CREATE POLICY "profiles_user_ownership" ON profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "cycle_logs_user_ownership" ON cycle_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "symptom_logs_user_ownership" ON symptom_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "ai_insights_user_ownership" ON ai_insights FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "health_reports_user_ownership" ON health_reports FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "chat_history_user_ownership" ON chat_history FOR ALL USING (auth.uid() = user_id);

-- Educational content is readable by everyone, writable by no one
CREATE POLICY "educational_content_public_read" ON educational_content FOR SELECT USING (true);
CREATE POLICY "educational_content_no_write" ON educational_content FOR INSERT WITH CHECK (false);
CREATE POLICY "educational_content_no_update" ON educational_content FOR UPDATE USING (false);
CREATE POLICY "educational_content_no_delete" ON educational_content FOR DELETE USING (false);


-- ============================================================
-- TRIGGER — auto-update updated_at timestamps
-- ============================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER cycle_logs_updated_at BEFORE UPDATE ON cycle_logs FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ============================================================
-- FUNCTION — auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## DESIGN SYSTEM

### Colors
- **Primary:** #E0859F (soft rose pink)
- **Gradient Accent:** #F97316 → #EC4899 (sunset gradient)
- **Background Light:** #FFF8F3 (warm off-white)
- **Background Dark:** #1A1020 (deep plum)
- **Card:** white with backdrop-blur (glass effect)
- **Danger:** #EF4444 (soft red)
- **Muted Text:** #8B7B8B

### Typography
- **Font:** Inter (loaded from Google Fonts with Latin subset)
- **H1:** text-2xl font-bold (mobile), md:text-3xl (desktop)
- **H2:** text-xl font-semibold
- **Body:** text-sm leading-relaxed
- **Captions:** text-xs text-muted-foreground

### Components (shadcn/ui)
Install these shadcn components: button, input, label, checkbox, card, dialog, toast, dropdown-menu, avatar, tabs, select, textarea, badge, separator, progress, scroll-area, accordion.

### Overall Style
- iOS-inspired UI: soft shadows, subtle glass effect, generous padding, rounded-xl/c rounded-2xl borders
- No sharp corners anywhere. Minimum border-radius is rounded-lg.
- Dark mode toggle in Profile page, persisted to localStorage as "femcare-theme"
- Animations: subtle fade-in on page load, soft spring animation for cards appearing
- Mobile-first responsive design. Max width 480px on main content, center aligned.

## PAGES TO BUILD

### 1. Login Page (/login)
- Centered card with app name and sunset gradient accent
- "Continue with Google" button (top, prominent, uses Supabase signInWithOAuth)
- Divider with "or"
- Email + password inputs
- "Log in" submit button with loading spinner
- Link to "Forgot password?" and "Don't have an account? Create one"
- On submit: supabase.auth.signInWithPassword
- On success: redirect to /
- On error: show red error banner with backend error message

### 2. Register Page (/register)
- "Continue with Google" button (uses same Supabase OAuth — creates account automatically)
- Email + password + confirm password inputs
- Two checkboxes: "I am 18+" and "I agree to Privacy Policy"
- Submit button disabled until both checkboxes are checked
- On submit: supabase.auth.signUp with email auto-confirmed
- On success: redirect to /
- Password minimum 6 characters

### 3. Forgot Password Page (/forgot-password)
- Email input + submit button
- Uses supabase.auth.resetPasswordForEmail with redirectTo = window.location.origin + '/reset-password'
- Shows success message regardless of whether email exists (privacy)

### 4. Reset Password Page (/reset-password)
- Reads token from URL search params (?token=...)
- New password + confirm password inputs
- Uses supabase.auth.updateUser with new password
- On success: redirect to /login with success toast

### 5. Home Page (Protected route: /)
- Requires auth — redirect to /login if not logged in
- Fetch user profile from `profiles` table
- Fetch cycle data from `cycle_logs` table
- Fetch today's symptom log and recent logs from `symptom_logs`
- Display: cycle phase indicator (menstrual/follicular/ovulation/luteal)
- Display: calendar showing period days and log days
- Display: latest AI insight card from `ai_insights` if exists, otherwise "Log more to see insights"
- Display: daily affirmation text
- FAB (floating action button) linking to /log to add new entry
- Consistency badge showing streak of consecutive logging days
- Full page shows companion loader spinner while fetching

### 6. Symptom Log Page (/log)
- Date selector (default today, max today, no future dates)
- All fields from symptom_logs table as form inputs:
  - Acne severity: 0-4 scale with descriptive labels (None, Mild, Moderate, Noticeable, Severe)
  - Mood: 1-5 emoji scale (😞 to 😊)
  - Pelvic pain: 0-4 scale
  - Sleep quality: 1-5 stars
  - Cravings: 0-4 scale
  - Period started / ended: toggle switches
  - Period flow: light/medium/heavy radio group (only shown if period started is on)
  - Facial hair, Hair thinning: toggle switches
  - Weight change: up/down/stable selector
  - Notes: textarea
- If a log already exists for today's date: populate form and show "Update" button
- If no log exists: show "Save" button
- On save: upsert into symptom_logs table
- On success: set session flag and navigate to home
- Cancel button returns to home

### 7. Insights Page (/insights)
- Fetch all user logs from `symptom_logs` and latest insight from `ai_insights`
- Show "Generate AI Insight" button with sparkle icon
- Once generated: show insight card with AI-generated text from `ai_insights.content`
- Display trend charts (Recharts) using data from `symptom_logs` and `cycle_logs`:
  - Line chart: mood over time
  - Line chart: pelvic pain over time
  - Bar chart: cycle length variation
- Show doctor alert banner if concerning patterns detected via `ai_insights`
- Loading state with companion mascot animation

### 8. Doctor Report Page (/doctor-report)
- Period selector: 30 days / 60 days / 90 days toggle
- Fetch logs within selected period
- Display summary cards: total logs, average mood, average pain, average sleep
- List all trend highlights as bullet points
- Print button (window.print with print CSS to hide nav)
- Share/export button (downloads as PDF or plain text)

### 9. History Page (/history)
- Fetch all logs (max 500)
- Search bar filtering by date and notes text
- Filter chips: Pelvic pain, Low mood, Acne, Cravings, Poor sleep, Period started
- Log entries displayed as cards sorted by date (newest first)
- Each card shows date, mood emoji, pain level, period indicator
- Empty state: "No logs yet. Start tracking your first day!"

### 10. Learn Page (/learn)
- Fetch articles from `educational_content` table
- Grid of article cards with title, excerpt, category badge, and read time
- Categories: Basics, Nutrition, Exercise, Mental Health, Treatment, Myth Busting
- Click opens Learn Detail page

### 11. Learn Detail Page (/learn/:id)
- Fetch single article from `educational_content` by slug
- Full article content with markdown rendering
- Back button to /learn
- "Was this helpful?" thumbs up/down at bottom

### 12. Profile Page (/profile)
- Display name, email, join date
- Edit profile: display_name, age, diagnosis_status, cycle_regularity
- Theme toggle (dark/light mode)
- Daily reminder toggle (future feature — show coming soon badge)
- Delete account button with confirmation dialog
- Delete account: removes all user data from all tables, then deletes auth user
- Export data button (downloads all logs as JSON)
- Logout button (supabase.auth.signOut, redirect to /login)

### 13. Onboarding Page (/onboarding)
- Shown after first login if profiles.onboarding_completed is false
- Slide 1: Welcome with app name, sunset gradient, "Your gentle companion" tagline
- Slide 2: Name input + age input
- Slide 3: Diagnosis status selector + cycle regularity selector + last period date picker
- Slide 4: "You're all set!" celebration with confetti animation
- On complete: create/update profile, set onboarding_completed = true, redirect to /
- Can be skipped entirely via skip button

### 14. Privacy Page (/privacy)
- Static privacy policy content explaining:
  - What data is collected (symptoms, cycle info)
  - Data is stored encrypted at rest in Supabase
  - No third-party sharing, no advertising, no analytics
  - User can delete all data anytime from Profile
  - HIPAA not applicable (we are not a medical provider)
- Contact email for privacy questions

### 15. Terms Page (/terms)
- Static terms of service
- Medical disclaimer prominently displayed
- "This is not a medical device" — repeated multiple times
- Age requirement (18+)

## AUTHENTICATION FLOW

1. App loads → check supabase.auth.getSession()
2. If session exists → fetch profile → render authenticated app
3. If no session → render login/register pages
4. Auth state changes → React context updates all components
5. AuthContext provides: user object, profile data, logout function, isLoading boolean

## SUPABASE CLIENT SETUP

Create `/src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

## ROUTING STRUCTURE

```
/                     → Home (protected)
/login                → Login
/register             → Register
/forgot-password      → ForgotPassword
/reset-password       → ResetPassword
/onboarding           → Onboarding (protected, shown if not completed)
/log                  → SymptomLog (protected)
/insights             → Insights (protected)
/doctor-report        → DoctorReport (protected)
/history              → History (protected)
/learn                → Learn (public)
/learn/:id            → LearnDetail (public)
/profile              → Profile (protected)
/privacy              → Privacy (public)
/terms                → Terms (public)
```

Layout component wraps all protected routes with:
- Bottom tab navigation bar (Home, Log, Insights, Learn, Profile)
- Top header with app name
- Disclaimer banner: "FemCare is not a medical diagnosis tool"
- Protected routes redirect to /login if unauthenticated

## DATA FETCHING PATTERN

All Supabase queries follow this pattern:
```js
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', user.id)

if (error) throw error
return data
```

Use React hooks (useState + useEffect) for data fetching. Show loading spinner while fetching. Show error state with retry button on failure.

## KEY BUSINESS LOGIC

### Cycle Phase Detection
Based on symptom logs and cycle_started dates:
- Calculate average cycle length from last 3-6 cycles
- Determine current phase: menstrual (days 1-5), follicular (days 6-13), ovulation (day 14-ish), luteal (post-ovulation)
- Display current phase with icon and description on Home page

### Insight Generation Pattern Detection
Scan logs for concerning patterns:
- Period absence > 60 days → flag
- Pelvic pain consistently > 3 → flag
- Mood consistently < 2 → flag
- Sleep consistently < 2 → flag
- Weight up trend over 4+ weeks → flag
Return flagged patterns as "doctor conversation starters"

### Consistency Streak
Count consecutive days with logs backwards from today.
Show badge: "3-day streak", "7-day streak", "30-day streak" with different colors.

## ERROR HANDLING RULES

1. Every async function must have try/catch
2. API errors: display user-friendly message (not raw error)
3. Network errors: show "No internet connection" state
4. Auth errors: redirect to /login, clear session
5. Supabase errors: log to console in dev, show generic error to user
6. Form validation: inline error messages under fields
7. Empty states: never show blank screen, always show helpful message with CTA

## WHAT NOT TO DO

- NO Flask, Express, Django, Python, or any custom backend server (Supabase is the backend)
- NO email verification / OTP flow (Supabase email auto-confirm is ON)
- NO SMTP configuration
- NO server-side rendering
- NO custom backend server (Supabase handles everything)
- NO SMS, push notifications, or webhooks (future scope)
- NO Stripe/payments (free app)
- NO AI API integration yet (insights use pattern-matching rules for MVP)
- NO offline support (requires internet)
- NO file uploads (future scope)
- NO real-time subscriptions (use normal queries)
- NO admin panel or admin roles
- NO social features, sharing, or communities
