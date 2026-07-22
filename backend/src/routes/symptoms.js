const express = require('express');
const SymptomLog = require('../models/symptomLog');
const requireAuth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(requireAuth);

// ─── GET /api/symptom-logs ───────────────────────────────────────────────────
// Query params: limit (default 200), sort (default -logDate)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 200, 500);
    const logs = await SymptomLog.find({ userId: req.userId })
      .sort({ logDate: -1 })
      .limit(limit)
      .lean();
    res.json(logs.map(toClientLog));
  })
);

// ─── GET /api/symptom-logs/:date ─────────────────────────────────────────────
router.get(
  '/:date',
  asyncHandler(async (req, res) => {
    const log = await SymptomLog.findOne({
      userId: req.userId,
      logDate: req.params.date,
    }).lean();
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json(toClientLog(log));
  })
);

// ─── POST /api/symptom-logs ──────────────────────────────────────────────────
// Upsert by (userId, logDate) — matches Base44's create + filter pattern
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const {
      log_date,
      cycle_started,
      cycle_ended,
      acne_severity,
      facial_hair_growth,
      hair_thinning,
      weight_change,
      mood,
      sleep_quality,
      pelvic_pain,
      pelvic_pain_severity,
      cravings_intensity,
      discomfort_areas,
      notes,
    } = req.body;

    if (!log_date || !/^\d{4}-\d{2}-\d{2}$/.test(log_date)) {
      return res.status(400).json({ error: 'log_date must be YYYY-MM-DD' });
    }

    const update = {
      ...(cycle_started !== undefined && { cycleStarted: Boolean(cycle_started) }),
      ...(cycle_ended !== undefined && { cycleEnded: Boolean(cycle_ended) }),
      ...(acne_severity !== undefined && { acneSeverity: Number(acne_severity) }),
      ...(facial_hair_growth !== undefined && { facialHairGrowth: Boolean(facial_hair_growth) }),
      ...(hair_thinning !== undefined && { hairThinning: Boolean(hair_thinning) }),
      ...(weight_change !== undefined && { weightChange: weight_change }),
      ...(mood !== undefined && { mood: Number(mood) }),
      ...(sleep_quality !== undefined && { sleepQuality: Number(sleep_quality) }),
      ...(pelvic_pain !== undefined && { pelvicPain: Boolean(pelvic_pain) }),
      ...(pelvic_pain_severity !== undefined && {
        pelvicPainSeverity: Number(pelvic_pain_severity),
      }),
      ...(cravings_intensity !== undefined && { cravingsIntensity: Number(cravings_intensity) }),
      ...(discomfort_areas !== undefined && { discomfortAreas: discomfort_areas }),
      ...(notes !== undefined && { notes }),
    };

    const log = await SymptomLog.findOneAndUpdate(
      { userId: req.userId, logDate: log_date },
      { $set: update },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();

    res.status(200).json(toClientLog(log));
  })
);

// ─── DELETE /api/symptom-logs/:date ──────────────────────────────────────────
router.delete(
  '/:date',
  asyncHandler(async (req, res) => {
    const result = await SymptomLog.deleteOne({
      userId: req.userId,
      logDate: req.params.date,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.status(204).end();
  })
);

// ─── DELETE /api/symptom-logs (bulk — used by account deletion) ──────────────
router.delete(
  '/',
  asyncHandler(async (req, res) => {
    await SymptomLog.deleteMany({ userId: req.userId });
    res.status(204).end();
  })
);

// ─── Serializer ──────────────────────────────────────────────────────────────
function toClientLog(doc) {
  return {
    id: doc._id,
    log_date: doc.logDate,
    cycle_started: doc.cycleStarted,
    cycle_ended: doc.cycleEnded,
    acne_severity: doc.acneSeverity,
    facial_hair_growth: doc.facialHairGrowth,
    hair_thinning: doc.hairThinning,
    weight_change: doc.weightChange,
    mood: doc.mood,
    sleep_quality: doc.sleepQuality,
    pelvic_pain: doc.pelvicPain,
    pelvic_pain_severity: doc.pelvicPainSeverity,
    cravings_intensity: doc.cravingsIntensity,
    discomfort_areas: doc.discomfortAreas ?? [],
    notes: doc.notes ?? '',
    created_date: doc.createdAt,
    updated_date: doc.updatedAt,
  };
}

module.exports = router;
