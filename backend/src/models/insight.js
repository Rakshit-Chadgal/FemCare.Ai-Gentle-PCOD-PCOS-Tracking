const mongoose = require('mongoose');

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
    reasoningSummary: { type: String, required: true },
    symptomImpacts: [
      {
        symptom: { type: String, required: true },
        impact: { type: String, required: true },
      },
    ],
    correlations: [{ type: String }],
    redFlags: [{ type: String }],
    doctorNudge: { type: Boolean, default: false },
    doctorNudgeReason: { type: String },
    weeklyTrendSummary: { type: String },
    logCountAnalyzed: { type: Number },
    dateRangeStart: { type: String },
    dateRangeEnd: { type: String },
  },
  { timestamps: true }
);

insightSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Insight', insightSchema);
