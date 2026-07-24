const express = require('express');
const UserProfile = require('../models/userProfile');
const requireAuth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const cache = require('../services/cache');
const { validate, profileUpdateSchema } = require('../middleware/validate');

const router = express.Router();
router.use(requireAuth);

// ─── GET /api/profiles/me ────────────────────────────────────────────────────
router.get(
  '/me',
  asyncHandler(async (req, res) => {
    const key = cache.KEY.profile(req.userId);

    const cached = await cache.get(key);
    if (cached) return res.json(cached);

    const profile = await UserProfile.findOne({ userId: req.userId }).lean();
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const payload = toClientProfile(profile);
    await cache.set(key, payload, cache.TTL.PROFILE);
    res.json(payload);
  })
);

// ─── POST /api/profiles/me ───────────────────────────────────────────────────
router.post(
  '/me',
  validate(profileUpdateSchema),
  asyncHandler(async (req, res) => {
    const update = {
      displayName: req.body.display_name,
      ...(req.body.age !== undefined && { age: Number(req.body.age) }),
      ...(req.body.diagnosis_status && { diagnosisStatus: req.body.diagnosis_status }),
      ...(req.body.cycle_regularity && { cycleRegularity: req.body.cycle_regularity }),
      ...(req.body.typical_cycle_length !== undefined && { typicalCycleLength: Number(req.body.typical_cycle_length) }),
      ...(req.body.has_ultrasound_finding !== undefined && { hasUltrasoundFinding: Boolean(req.body.has_ultrasound_finding) }),
      ...(req.body.ultrasound_notes !== undefined && { ultrasoundNotes: req.body.ultrasound_notes }),
      ...(req.body.disclaimer_acknowledged !== undefined && { disclaimerAcknowledged: Boolean(req.body.disclaimer_acknowledged) }),
      ...(req.body.onboarding_completed !== undefined && { onboardingCompleted: Boolean(req.body.onboarding_completed) }),
    };

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.userId },
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    const payload = toClientProfile(profile);
    await cache.set(cache.KEY.profile(req.userId), payload, cache.TTL.PROFILE);
    res.json(payload);
  })
);

// ─── DELETE /api/profiles/me ─────────────────────────────────────────────────
router.delete(
  '/me',
  asyncHandler(async (req, res) => {
    await UserProfile.deleteOne({ userId: req.userId });
    await cache.del(cache.KEY.profile(req.userId));
    res.status(204).end();
  })
);

// ─── Serializer ──────────────────────────────────────────────────────────────
function toClientProfile(doc) {
  return {
    id: doc._id,
    display_name: doc.displayName,
    age: doc.age ?? null,
    diagnosis_status: doc.diagnosisStatus,
    cycle_regularity: doc.cycleRegularity,
    typical_cycle_length: doc.typicalCycleLength ?? null,
    has_ultrasound_finding: doc.hasUltrasoundFinding,
    ultrasound_notes: doc.ultrasoundNotes ?? '',
    disclaimer_acknowledged: doc.disclaimerAcknowledged,
    onboarding_completed: doc.onboardingCompleted,
    created_date: doc.createdAt,
    updated_date: doc.updatedAt,
  };
}

module.exports = router;
