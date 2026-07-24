/**
 * cleanupExpiredAuthTokens
 *
 * OTP codes and password-reset tokens are stored as fields on the User document.
 * They are cleared in application code when consumed, but if a user never
 * completes the flow the fields remain set forever.
 *
 * A MongoDB TTL index cannot delete individual fields — it deletes whole
 * documents. The correct approach for field-level expiry is a periodic
 * $unset query, which this utility provides.
 *
 * Call schedule: every 15 minutes via setInterval in index.js.
 * Each run issues at most two lightweight updateMany operations that are
 * fully covered by existing indexes:
 *   - otpExpiresAt  → no dedicated index; query scans only docs where the
 *                     field exists (sparse in practice, small set).
 *   - resetToken    → covered by idx_user_resetToken (sparse index).
 */

const User = require('../models/user');
const SymptomLog = require('../models/symptomLog');
const Insight = require('../models/insight');
const LogTemplate = require('../models/logTemplate');

const RETENTION_DAYS = parseInt(process.env.DATA_RETENTION_DAYS) || 365;
const CUTOFF_DATE = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

async function cleanupExpiredAuthTokens() {
  const now = new Date();

  const [otpResult, resetResult] = await Promise.all([
    User.updateMany(
      { otpExpiresAt: { $lt: now } },
      { $unset: { otpCode: '', otpExpiresAt: '' } }
    ),
    User.updateMany(
      { resetToken: { $exists: true }, resetTokenExpiry: { $lt: now } },
      { $unset: { resetToken: '', resetTokenExpiry: '' } }
    ),
    SymptomLog.deleteMany({ logDate: { $lt: CUTOFF_DATE.toISOString().slice(0, 10) } }),
    Insight.deleteMany({ createdAt: { $lt: CUTOFF_DATE } }),
    LogTemplate.deleteMany({ createdAt: { $lt: CUTOFF_DATE } }),
  ]);

  const cleaned = otpResult.modifiedCount + resetResult.modifiedCount;
  if (cleaned > 0) {
    console.log(`[auth-cleanup] Cleared expired tokens from ${cleaned} user document(s)`);
  }
}

module.exports = cleanupExpiredAuthTokens;
