-- ============================================================
-- USERS — custom user accounts (used by Express JWT auth)
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  google_id TEXT UNIQUE,
  name TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  reset_token TEXT,
  reset_token_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROFILES — extends users with health metadata
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
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
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
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
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  acne_severity INTEGER CHECK (acne_severity BETWEEN 0 AND 5) DEFAULT 0,
  mood INTEGER CHECK (mood BETWEEN 1 AND 5) DEFAULT 3,
  pelvic_pain BOOLEAN DEFAULT FALSE,
  pelvic_pain_severity INTEGER CHECK (pelvic_pain_severity BETWEEN 0 AND 5) DEFAULT 0,
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5) DEFAULT 3,
  sleep_hours NUMERIC CHECK (sleep_hours BETWEEN 0 AND 24),
  cravings_intensity INTEGER CHECK (cravings_intensity BETWEEN 0 AND 5) DEFAULT 0,
  cravings_type TEXT,
  facial_hair_growth BOOLEAN DEFAULT FALSE,
  hair_thinning BOOLEAN DEFAULT FALSE,
  bloating INTEGER CHECK (bloating BETWEEN 0 AND 5) DEFAULT 0,
  anxiety INTEGER CHECK (anxiety BETWEEN 0 AND 5) DEFAULT 0,
  fatigue INTEGER CHECK (fatigue BETWEEN 0 AND 5) DEFAULT 0,
  weight_kg NUMERIC,
  weight_change TEXT CHECK (weight_change IN ('up', 'down', 'same', 'unknown')),
  intercourse_pain BOOLEAN DEFAULT FALSE,
  nausea BOOLEAN DEFAULT FALSE,
  headache BOOLEAN DEFAULT FALSE,
  cycle_started BOOLEAN DEFAULT FALSE,
  cycle_ended BOOLEAN DEFAULT FALSE,
  discomfort_areas TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

CREATE INDEX idx_symptom_logs_user_date ON symptom_logs(user_id, log_date DESC);

-- ============================================================
-- LOG_TEMPLATES — reusable symptom entry templates
-- ============================================================
CREATE TABLE log_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  template_name TEXT NOT NULL,
  cycle_started BOOLEAN DEFAULT FALSE,
  cycle_ended BOOLEAN DEFAULT FALSE,
  acne_severity INTEGER DEFAULT 0,
  facial_hair_growth BOOLEAN DEFAULT FALSE,
  hair_thinning BOOLEAN DEFAULT FALSE,
  weight_change TEXT DEFAULT 'unknown',
  mood INTEGER DEFAULT 3,
  sleep_quality INTEGER DEFAULT 3,
  pelvic_pain BOOLEAN DEFAULT FALSE,
  pelvic_pain_severity INTEGER DEFAULT 0,
  cravings_intensity INTEGER DEFAULT 0,
  discomfort_areas TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AI_INSIGHTS — personalized pattern analysis
-- ============================================================
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
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
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
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
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
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
-- TRIGGER — auto-update updated_at timestamps
-- ============================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER cycle_logs_updated_at BEFORE UPDATE ON cycle_logs FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER symptom_logs_updated_at BEFORE UPDATE ON symptom_logs FOR EACH ROW EXECUTE FUNCTION update_timestamp();
