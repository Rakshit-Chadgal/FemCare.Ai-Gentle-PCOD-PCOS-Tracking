const mongoose = require('mongoose');

// ── Subdocument schema ────────────────────────────────────────────────────────
const symptomImpactSchema = new mongoose.Schema(
  {
    symptom: { type: String, required: true, trim: true, maxlength: 100 },
    impact:  { type: String, required: true, trim: true, maxlength: 300 },
  },
  { _id: false }   // no separate _id per subdoc — these are value objects
);

const insightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    awarenessLevel: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      required: true,
    },
    reasoningSummary:   { type: String, required: true, trim: true, maxlength: 2000 },
    symptomImpacts:     { type: [symptomImpactSchema], default: [], validate: { validator: v => v.length <= 20, message: 'symptomImpacts may not exceed 20 entries' } },
    correlations:       { type: [String], default: [], validate: { validator: v => v.length <= 20, message: 'correlations may not exceed 20 entries' } },
    redFlags:           { type: [String], default: [], validate: { validator: v => v.length <= 10, message: 'redFlags may not exceed 10 entries' } },
    doctorNudge:        { type: Boolean, default: false },
    doctorNudgeReason:  { type: String,  trim: true, maxlength: 1000, default: '' },
    weeklyTrendSummary: { type: String,  trim: true, maxlength: 500,  default: '' },
    logCountAnalyzed:   { type: Number,  min: 0, default: 0 },
    // Stored as YYYY-MM-DD strings — consistent with SymptomLog.logDate.
    // Lexicographic comparison is valid for ISO date strings.
    dateRangeStart:     { type: String,  match: /^\d{4}-\d{2}-\d{2}$/ },
    dateRangeEnd:       { type: String,  match: /^\d{4}-\d{2}-\d{2}$/ },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// Primary access pattern: GET /api/insights?limit=1 — latest insight for a user.
insightSchema.index(
  { userId: 1, createdAt: -1 },
  { name: 'idx_insight_user_created' }
);

insightSchema.index(
  { userId: 1, dateRangeStart: 1, dateRangeEnd: 1 },
  { name: 'idx_insight_user_daterange' }
);

// ── Virtual: back-reference to User ──────────────────────────────────────────
insightSchema.virtual('user', {
  ref:          'User',
  localField:   'userId',
  foreignField: '_id',
  justOne:      true,
});

module.exports = mongoose.model('Insight', insightSchema);
