const express = require('express');
const UserProfile = require('../models/userProfile');
const requireAuth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// All profile routes require auth
router.use(requireAuth);

// ─── GET /api/profiles/me ────────────────────────────────────────────────────
router.get(
  '/me',
  asyncHandler(async (req, res) => {
    const profile = await UserProfile.findOne({ userId: req.userId }).lean();
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(toClientProfile(profile));
  })
);

// ─── POST /api/profiles/me ───────────────────────────────────────────────────
// Creates or updates the profile (upsert)
router.post(
  '/me',
  asyncHandler(async (req, res) => {
    const {
      display_name,
      age,
      diagnosis_status,
      cycle_regularity,
      typical_cycle_length,
      has_ultrasound_finding,
      ultrasound_notes,
      disclaimer_acknowledged,
      onboarding_completed,
    } = req.body;

    if (!display_name || !display_name.trim()) {
      return res.status(400).json({ error: 'display_name is required' });
    }

    const update = {
      displayName: display_name.trim(),
      ...(age !== undefined && { age: Number(age) }),
      ...(diagnosis_status && { diagnosisStatus: diagnosis_status }),
      ...(cycle_regularity && { cycleRegularity: cycle_regularity }),
      ...(typical_cycle_length !== undefined && {
        typicalCycleLength: Number(typical_cycle_length),
      }),
      ...(has_ultrasound_finding !== undefined && {
        hasUltrasoundFinding: Boolean(has_ultrasound_finding),
      }),
      ...(ultrasound_notes !== undefined && { ultrasoundNotes: ultrasound_notes }),
      ...(disclaimer_acknowledged !== undefined && {
        disclaimerAcknowledged: Boolean(disclaimer_acknowledged),
      }),
      ...(onboarding_completed !== undefined && {
        onboardingCompleted: Boolean(onboarding_completed),
      }),
    };

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.userId },
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    res.json(toClientProfile(profile));
  })
);

// ─── DELETE /api/profiles/me ─────────────────────────────────────────────────
// Used by account deletion flow in Profile.jsx
router.delete(
  '/me',
  asyncHandler(async (req, res) => {
    await UserProfile.deleteOne({ userId: req.userId });
    res.status(204).end();
  })
);

// ─── Serializer ──────────────────────────────────────────────────────────────
// Maps camelCase Mongoose doc → snake_case for the frontend (matches Base44 shape)
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
