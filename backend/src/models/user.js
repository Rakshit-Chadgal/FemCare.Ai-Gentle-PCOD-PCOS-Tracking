const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    // ── Auth lifecycle fields ─────────────────────────────────────────────────
    // Kept on the User document (not a separate collection) because they are
    // short-lived and always accessed alongside the user record.
    otpCode:          { type: String,  select: false },
    otpExpiresAt:     { type: Date,    select: false },
    resetToken:       { type: String,  select: false },
    resetTokenExpiry: { type: Date,    select: false },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// Sparse so documents without these fields don't consume index space.
// resetToken is looked up directly in POST /reset-password — needs an index.
userSchema.index({ resetToken: 1 },  { sparse: true, name: 'idx_user_resetToken' });
userSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0, name: 'idx_user_otp_ttl' });
userSchema.index({ resetTokenExpiry: 1 }, { expireAfterSeconds: 0, name: 'idx_user_reset_ttl' });
// otpCode is always looked up via email (already indexed), so no extra index needed.

// ── Password hashing ──────────────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

// ── Cascade delete ────────────────────────────────────────────────────────────
// Fires when User.deleteOne({ _id }) or User.findByIdAndDelete() is called.
// Lazy-requires child models to avoid circular-require issues at module load.
userSchema.pre('findOneAndDelete', async function () {
  const userId = this.getQuery()._id;
  if (!userId) return;
  const [SymptomLog, Insight, LogTemplate, UserProfile] = [
    'SymptomLog', 'Insight', 'LogTemplate', 'UserProfile',
  ].map(m => mongoose.model(m));
  await Promise.all([
    SymptomLog.deleteMany({ userId }),
    Insight.deleteMany({ userId }),
    LogTemplate.deleteMany({ userId }),
    UserProfile.deleteOne({ userId }),
  ]);
});

module.exports = mongoose.model('User', userSchema);
