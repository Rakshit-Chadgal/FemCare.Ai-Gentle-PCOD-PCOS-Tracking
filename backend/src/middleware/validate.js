const { z } = require('zod');

const profileUpdateSchema = z.object({
  display_name: z.string().trim().min(1, 'display_name is required').max(100),
  age: z.number().min(10).max(80).optional(),
  diagnosis_status: z.enum(['suspect', 'diagnosed', 'not_sure']).optional(),
  cycle_regularity: z.enum(['regular', 'irregular', 'very_irregular', 'unknown']).optional(),
  typical_cycle_length: z.number().min(15).max(60).optional(),
  has_ultrasound_finding: z.boolean().optional(),
  ultrasound_notes: z.string().trim().max(500).optional(),
  disclaimer_acknowledged: z.boolean().optional(),
  onboarding_completed: z.boolean().optional(),
});

const logCreateSchema = z.object({
  log_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'log_date must be YYYY-MM-DD'),
  cycle_started: z.boolean().optional(),
  cycle_ended: z.boolean().optional(),
  acne_severity: z.number().min(0).max(5).optional(),
  facial_hair_growth: z.boolean().optional(),
  hair_thinning: z.boolean().optional(),
  weight_change: z.enum(['up', 'down', 'same', 'unknown']).optional(),
  mood: z.number().min(1).max(5).optional(),
  sleep_quality: z.number().min(1).max(5).optional(),
  pelvic_pain: z.boolean().optional(),
  pelvic_pain_severity: z.number().min(0).max(5).optional(),
  cravings_intensity: z.number().min(0).max(5).optional(),
  discomfort_areas: z.array(z.string().max(50)).optional(),
  notes: z.string().trim().max(1000).optional(),
});

const insightCreateSchema = z.object({
  awareness_level: z.enum(['low', 'moderate', 'high']),
  reasoning_summary: z.string().trim().min(1).max(2000),
  symptom_impacts: z.array(z.object({
    symptom: z.string().trim().max(100),
    impact: z.string().trim().max(300),
  })).max(20).optional(),
  correlations: z.array(z.string()).max(20).optional(),
  red_flags: z.array(z.string()).max(10).optional(),
  doctor_nudge: z.boolean().optional(),
  doctor_nudge_reason: z.string().trim().max(1000).optional(),
  weekly_trend_summary: z.string().trim().max(500).optional(),
  log_count_analyzed: z.number().min(0).optional(),
  date_range_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  date_range_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

const templateCreateSchema = z.object({
  template_name: z.string().trim().min(1).max(80),
  cycle_started: z.boolean().optional(),
  cycle_ended: z.boolean().optional(),
  acne_severity: z.number().min(0).max(5).optional(),
  facial_hair_growth: z.boolean().optional(),
  hair_thinning: z.boolean().optional(),
  weight_change: z.enum(['up', 'down', 'same', 'unknown']).optional(),
  mood: z.number().min(1).max(5).optional(),
  sleep_quality: z.number().min(1).max(5).optional(),
  pelvic_pain: z.boolean().optional(),
  pelvic_pain_severity: z.number().min(0).max(5).optional(),
  cravings_intensity: z.number().min(0).max(5).optional(),
  discomfort_areas: z.array(z.string().max(50)).optional(),
});

const authRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const authGoogleSchema = z.object({
  idToken: z.string().min(1),
});

const authForgotPasswordSchema = z.object({
  email: z.string().email().optional(),
});

const authResetPasswordSchema = z.object({
  resetToken: z.string().min(1),
  newPassword: z.string().min(8),
});

const aiInsightSchema = z.object({
  period: z.coerce.number().int().refine(v => [30, 60, 90].includes(v), {
    message: 'period must be 30, 60, or 90',
  }),
});

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors.map(e => e.message).join(', ') });
    }
    req.body = result.data;
    next();
  };
}

module.exports = {
  profileUpdateSchema,
  logCreateSchema,
  insightCreateSchema,
  templateCreateSchema,
  authRegisterSchema,
  authLoginSchema,
  authGoogleSchema,
  authForgotPasswordSchema,
  authResetPasswordSchema,
  aiInsightSchema,
  validate,
};
