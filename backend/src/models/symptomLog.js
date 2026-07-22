const mongoose = require('mongoose');

const symptomLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    logDate: {
      type: String, // YYYY-MM-DD — stored as string to avoid timezone drift
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    cycleStarted: { type: Boolean, default: false },
    cycleEnded: { type: Boolean, default: false },
    acneSeverity: { type: Number, min: 0, max: 5, default: 0 },
    facialHairGrowth: { type: Boolean, default: false },
    hairThinning: { type: Boolean, default: false },
    weightChange: {
      type: String,
      enum: ['up', 'down', 'same', 'unknown'],
      default: 'unknown',
    },
    mood: { type: Number, min: 1, max: 5, default: 3 },
    sleepQuality: { type: Number, min: 1, max: 5, default: 3 },
    pelvicPain: { type: Boolean, default: false },
    pelvicPainSeverity: { type: Number, min: 0, max: 5, default: 0 },
    cravingsIntensity: { type: Number, min: 0, max: 5, default: 0 },
    discomfortAreas: [{ type: String }],
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// One log per user per date
symptomLogSchema.index({ userId: 1, logDate: 1 }, { unique: true });

// Fast queries for listing by date descending
symptomLogSchema.index({ userId: 1, logDate: -1 });

module.exports = mongoose.model('SymptomLog', symptomLogSchema);
