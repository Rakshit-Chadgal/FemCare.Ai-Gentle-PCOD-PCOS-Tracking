const mongoose = require('mongoose');

const logTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    templateName:      { type: String,  required: true, trim: true, maxlength: 80 },
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
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// Unique per user — prevents duplicate template names silently accumulating.
logTemplateSchema.index(
  { userId: 1, templateName: 1 },
  { unique: true, name: 'idx_template_user_name' }
);

// List endpoint sorts by createdAt descending.
logTemplateSchema.index(
  { userId: 1, createdAt: -1 },
  { name: 'idx_template_user_created' }
);

// ── Per-user template cap ─────────────────────────────────────────────────────
// Prevents unbounded growth; 20 templates is more than enough for any user.
logTemplateSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  const count = await mongoose.model('LogTemplate').countDocuments({ userId: this.userId });
  if (count >= 20) {
    return next(new Error('Template limit reached. Delete an existing template before creating a new one.'));
  }
  next();
});

// ── Virtual: back-reference to User ──────────────────────────────────────────
logTemplateSchema.virtual('user', {
  ref:          'User',
  localField:   'userId',
  foreignField: '_id',
  justOne:      true,
});

module.exports = mongoose.model('LogTemplate', logTemplateSchema);
