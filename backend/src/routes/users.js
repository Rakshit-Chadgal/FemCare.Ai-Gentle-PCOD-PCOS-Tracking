const express = require('express');
const User = require('../models/user');
const UserProfile = require('../models/userProfile');
const SymptomLog = require('../models/symptomLog');
const Insight = require('../models/insight');
const LogTemplate = require('../models/logTemplate');
const requireAuth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const cache = require('../services/cache');

const router = express.Router();

router.use(requireAuth);

// ─── DELETE /api/users/me ─────────────────────────────────────────────────────
// The User model's pre('findOneAndDelete') hook cascades deletion of all child
// documents (SymptomLog, Insight, LogTemplate, UserProfile) automatically.
router.delete(
  '/me',
  asyncHandler(async (req, res) => {
    const deleted = await User.findByIdAndDelete(req.userId);
    if (!deleted) return res.status(404).json({ error: 'User not found' });

    await Promise.all([
      cache.delPattern(`fc:profile:${req.userId}`),
      cache.delPattern(`fc:logs:*:${req.userId}:*`),
      cache.del(cache.KEY.insights(req.userId)),
      cache.del(cache.KEY.templates(req.userId)),
    ]);

    res.status(204).end();
  })
);

// ─── GET /api/users/me/export ─────────────────────────────────────────────────
// GDPR Article 20 — Right to Data Portability
router.get(
  '/me/export',
  asyncHandler(async (req, res) => {
    const [user, profile, logs, insights, templates] = await Promise.all([
      User.findById(req.userId).select('-passwordHash -otpCode -otpExpiresAt -resetToken -resetTokenExpiry').lean(),
      UserProfile.findOne({ userId: req.userId }).lean(),
      SymptomLog.find({ userId: req.userId }).sort({ logDate: -1 }).lean(),
      Insight.find({ userId: req.userId }).sort({ createdAt: -1 }).lean(),
      LogTemplate.find({ userId: req.userId }).lean(),
    ]);

    const exportData = {
      user,
      profile,
      symptomLogs: logs,
      insights,
      logTemplates: templates,
      exportedAt: new Date().toISOString(),
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="femcare-data-${req.userId}.json"`);
    res.json(exportData);
  })
);

// ─── DELETE /api/users/me/gdpr ────────────────────────────────────────────────
// GDPR Article 17 — Right to Erasure (anonymize + cascade)
router.delete(
  '/me/gdpr',
  asyncHandler(async (req, res) => {
    const deleted = await User.findByIdAndDelete(req.userId);
    if (!deleted) return res.status(404).json({ error: 'User not found' });

    await Promise.all([
      cache.delPattern(`fc:profile:${req.userId}`),
      cache.delPattern(`fc:logs:*:${req.userId}:*`),
      cache.del(cache.KEY.insights(req.userId)),
      cache.del(cache.KEY.templates(req.userId)),
    ]);

    res.status(204).end();
  })
);

module.exports = router;
