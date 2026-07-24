const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,       // creates the primary lookup index
    },
    displayName:            { type: String,  required: true, trim: true, maxlength: 100 },
    age:                    { type: Number,  min: 10, max: 80 },
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
    typicalCycleLength:     { type: Number,  min: 15, max: 60 },
    hasUltrasoundFinding:   { type: Boolean, default: false },
    ultrasoundNotes:        { type: String,  trim: true, maxlength: 500 },
    disclaimerAcknowledged: { type: Boolean, default: false },
    onboardingCompleted:    { type: Boolean, default: false },
  },
  { timestamps: true, strict: 'throw' }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// The unique: true on userId above creates the only index this collection needs.
// Every query is a point lookup on userId alone:
//   findOne({ userId })            ← GET /profiles/me
//   findOneAndUpdate({ userId })   ← POST /profiles/me (upsert)
//   deleteOne({ userId })          ← DELETE /profiles/me
// No additional indexes are warranted for this access pattern.

// ── Virtual: back-reference to User ──────────────────────────────────────────
userProfileSchema.virtual('user', {
  ref:          'User',
  localField:   'userId',
  foreignField: '_id',
  justOne:      true,
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
