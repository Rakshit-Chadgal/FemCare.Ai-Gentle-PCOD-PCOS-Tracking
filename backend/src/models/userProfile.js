const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    displayName: { type: String, required: true, trim: true },
    age: { type: Number, min: 18, max: 60 },
    diagnosisStatus: {
      type: String,
      enum: ['suspect', 'diagnosed', 'not_sure'],
      default: 'not_sure',
    },
    cycleRegularity: {
      type: String,
      enum: ['regular', 'irregular', 'very_irregular', 'unknown'],
      default: 'unknown',
    },
    typicalCycleLength: { type: Number, min: 15, max: 60 },
    hasUltrasoundFinding: { type: Boolean, default: false },
    ultrasoundNotes: { type: String, trim: true },
    disclaimerAcknowledged: { type: Boolean, default: false },
    onboardingCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserProfile', userProfileSchema);
