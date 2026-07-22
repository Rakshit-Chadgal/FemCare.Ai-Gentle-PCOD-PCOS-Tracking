const mongoose = require('mongoose');

const logTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    templateName: { type: String, required: true, trim: true },
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
  },
  { timestamps: true }
);

logTemplateSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('LogTemplate', logTemplateSchema);
