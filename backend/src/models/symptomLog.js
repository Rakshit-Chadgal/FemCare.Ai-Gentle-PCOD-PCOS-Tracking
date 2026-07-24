const mongoose = require('mongoose');

const symptomLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Stored as YYYY-MM-DD string to avoid timezone drift on date-only values.
    // ISO string lexicographic order == chronological order, so range queries work correctly.
    logDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    cycleStarted:      { type: Boolean, default: false },
    cycleEnded:        { type: Boolean, default: false },
    acneSeverity:      { type: Number,  min: 0, max: 5, default: 0 },
    facialHairGrowth:  { type: Boolean, default: false },
    hairThinning:      { type: Boolean, default: false },
    weightChange: {
      type: String,
      enum: ['up', 'down', 'same', 'unknown'],
      default: 'unknown',
    },
    mood:              { type: Number,  min: 1, max: 5, default: 3 },
    sleepQuality:      { type: Number,  min: 1, max: 5, default: 3 },
    pelvicPain:        { type: Boolean, default: false },
    pelvicPainSeverity:{ type: Number,  min: 0, max: 5, default: 0 },
    cravingsIntensity: { type: Number,  min: 0, max: 5, default: 0 },
    discomfortAreas:   [{ type: String, maxlength: 50 }],
    notes:             { type: String,  trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// Primary access pattern: fetch all logs for a user sorted by date.
// A single compound unique index on (userId, logDate) covers:
//   - Uniqueness enforcement (one log per user per day)
//   - find({ userId }) with sort({ logDate: -1 })   ← list endpoint
//   - findOne({ userId, logDate })                   ← get-by-date endpoint
//   - find({ userId, logDate: { $gte: cutoff } })    ← doctor-report range query
// MongoDB can use this index for both ascending and descending sorts on logDate,
// so a second { userId:1, logDate:-1 } index is redundant and has been removed.
symptomLogSchema.index(
  { userId: 1, logDate: 1 },
  { unique: true, name: 'idx_symptomlog_user_date' }
);

symptomLogSchema.index(
  { userId: 1, logDate: 1, cycleStarted: 1 },
  { name: 'idx_symptomlog_user_date_cycle' }
);

// ── Virtual: back-reference to User ──────────────────────────────────────────
symptomLogSchema.virtual('user', {
  ref:          'User',
  localField:   'userId',
  foreignField: '_id',
  justOne:      true,
});

module.exports = mongoose.model('SymptomLog', symptomLogSchema);
