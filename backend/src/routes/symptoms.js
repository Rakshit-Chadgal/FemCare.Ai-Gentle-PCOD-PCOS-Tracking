const express = require('express');
const SymptomLog = require('../models/symptomLog');
const requireAuth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const cache = require('../services/cache');
const { validate, logCreateSchema } = require('../middleware/validate');

const router = express.Router();
router.use(requireAuth);

// ─── GET /api/symptom-logs ───────────────────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 200, 500);
    const key = cache.KEY.logsList(req.userId, limit);

    const cached = await cache.get(key);
    if (cached) return res.json(cached);

    const logs = await SymptomLog.find({ userId: req.userId })
      .sort({ logDate: -1 })
      .limit(limit)
      .select('-__v')
      .lean();

    const payload = logs.map(toClientLog);
    await cache.set(key, payload, cache.TTL.LOGS);
    res.json(payload);
  })
);

// ─── GET /api/symptom-logs/:date ─────────────────────────────────────────────
router.get(
  '/:date',
  asyncHandler(async (req, res) => {
    const key = cache.KEY.logsDate(req.userId, req.params.date);

    const cached = await cache.get(key);
    if (cached) return res.json(cached);

    const log = await SymptomLog.findOne({
      userId: req.userId,
      logDate: req.params.date,
    }).lean();

    if (!log) return res.status(404).json({ error: 'Log not found' });

    const payload = toClientLog(log);
    await cache.set(key, payload, cache.TTL.LOGS);
    res.json(payload);
  })
);

// ─── POST /api/symptom-logs ──────────────────────────────────────────────────
router.post(
  '/',
  validate(logCreateSchema),
  asyncHandler(async (req, res) => {
    const log_date = req.body.log_date;
    const update = {
      ...(req.body.cycle_started !== undefined && { cycleStarted: Boolean(req.body.cycle_started) }),
      ...(req.body.cycle_ended !== undefined && { cycleEnded: Boolean(req.body.cycle_ended) }),
      ...(req.body.acne_severity !== undefined && { acneSeverity: Number(req.body.acne_severity) }),
      ...(req.body.facial_hair_growth !== undefined && { facialHairGrowth: Boolean(req.body.facial_hair_growth) }),
      ...(req.body.hair_thinning !== undefined && { hairThinning: Boolean(req.body.hair_thinning) }),
      ...(req.body.weight_change !== undefined && { weightChange: req.body.weight_change }),
      ...(req.body.mood !== undefined && { mood: Number(req.body.mood) }),
      ...(req.body.sleep_quality !== undefined && { sleepQuality: Number(req.body.sleep_quality) }),
      ...(req.body.pelvic_pain !== undefined && { pelvicPain: Boolean(req.body.pelvic_pain) }),
      ...(req.body.pelvic_pain_severity !== undefined && { pelvicPainSeverity: Number(req.body.pelvic_pain_severity) }),
      ...(req.body.cravings_intensity !== undefined && { cravingsIntensity: Number(req.body.cravings_intensity) }),
      ...(req.body.discomfort_areas !== undefined && { discomfortAreas: req.body.discomfort_areas }),
      ...(req.body.notes !== undefined && { notes: req.body.notes }),
    };

    const log = await SymptomLog.findOneAndUpdate(
      { userId: req.userId, logDate: log_date },
      { $set: update },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();

    const payload = toClientLog(log);

    await Promise.all([
      cache.delPattern(`fc:logs:list:${req.userId}:*`),
      cache.set(cache.KEY.logsDate(req.userId, log_date), payload, cache.TTL.LOGS),
    ]);

    res.status(200).json(payload);
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

    await Promise.all([
      cache.delPattern(`fc:logs:list:${req.userId}:*`),
      cache.del(cache.KEY.logsDate(req.userId, req.params.date)),
    ]);

    res.status(204).end();
  })
);

// ─── DELETE /api/symptom-logs (bulk) ─────────────────────────────────────────
router.delete(
  '/',
  asyncHandler(async (req, res) => {
    await SymptomLog.deleteMany({ userId: req.userId });
    await cache.delPattern(`fc:logs:*:${req.userId}:*`);
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
