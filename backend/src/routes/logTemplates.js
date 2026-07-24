const express = require('express');
const LogTemplate = require('../models/logTemplate');
const requireAuth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const cache = require('../services/cache');
const { validate, templateCreateSchema } = require('../middleware/validate');

const router = express.Router();
router.use(requireAuth);

// ─── GET /api/log-templates ──────────────────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const key = cache.KEY.templates(req.userId);

    const cached = await cache.get(key);
    if (cached) return res.json(cached);

    const templates = await LogTemplate.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const payload = templates.map(toClientTemplate);
    await cache.set(key, payload, cache.TTL.TEMPLATES);
    res.json(payload);
  })
);

// ─── POST /api/log-templates ─────────────────────────────────────────────────
router.post(
  '/',
  validate(templateCreateSchema),
  asyncHandler(async (req, res) => {
    const { template_name, ...fields } = req.body;

    let template;
    try {
      template = await LogTemplate.create({
        userId: req.userId,
        templateName: template_name.trim(),
        cycleStarted: fields.cycle_started ?? false,
        cycleEnded: fields.cycle_ended ?? false,
        acneSeverity: fields.acne_severity ?? 0,
        facialHairGrowth: fields.facial_hair_growth ?? false,
        hairThinning: fields.hair_thinning ?? false,
        weightChange: fields.weight_change ?? 'unknown',
        mood: fields.mood ?? 3,
        sleepQuality: fields.sleep_quality ?? 3,
        pelvicPain: fields.pelvic_pain ?? false,
        pelvicPainSeverity: fields.pelvic_pain_severity ?? 0,
        cravingsIntensity: fields.cravings_intensity ?? 0,
        discomfortAreas: fields.discomfort_areas ?? [],
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: 'A template with that name already exists' });
      }
      if (err.message?.includes('Template limit reached')) {
        return res.status(422).json({ error: err.message });
      }
      throw err;
    }

    await cache.del(cache.KEY.templates(req.userId));
    res.status(201).json(toClientTemplate(template.toObject()));
  })
);

// ─── DELETE /api/log-templates/:id ───────────────────────────────────────────
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const result = await LogTemplate.deleteOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    await cache.del(cache.KEY.templates(req.userId));
    res.status(204).end();
  })
);

// ─── Serializer ──────────────────────────────────────────────────────────────
function toClientTemplate(doc) {
  return {
    id: doc._id,
    template_name: doc.templateName,
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
    created_date: doc.createdAt,
  };
}

module.exports = router;
