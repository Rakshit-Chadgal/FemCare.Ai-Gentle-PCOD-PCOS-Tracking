const express = require('express');
const Insight = require('../models/insight');
const requireAuth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(requireAuth);

// ─── GET /api/insights ───────────────────────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const insights = await Insight.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json(insights.map(toClientInsight));
  })
);

// ─── POST /api/insights ──────────────────────────────────────────────────────
// Called by the AI route after generating — persists the result
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const {
      awareness_level,
      reasoning_summary,
      symptom_impacts,
      correlations,
      red_flags,
      doctor_nudge,
      doctor_nudge_reason,
      weekly_trend_summary,
      log_count_analyzed,
      date_range_start,
      date_range_end,
    } = req.body;

    if (!awareness_level || !reasoning_summary) {
      return res.status(400).json({ error: 'awareness_level and reasoning_summary are required' });
    }

    const insight = await Insight.create({
      userId: req.userId,
      awarenessLevel: awareness_level,
      reasoningSummary: reasoning_summary,
      symptomImpacts: symptom_impacts ?? [],
      correlations: correlations ?? [],
      redFlags: red_flags ?? [],
      doctorNudge: doctor_nudge ?? false,
      doctorNudgeReason: doctor_nudge_reason ?? '',
      weeklyTrendSummary: weekly_trend_summary ?? '',
      logCountAnalyzed: log_count_analyzed ?? 0,
      dateRangeStart: date_range_start,
      dateRangeEnd: date_range_end,
    });

    res.status(201).json(toClientInsight(insight.toObject()));
  })
);

// ─── DELETE /api/insights (bulk — used by account deletion) ──────────────────
router.delete(
  '/',
  asyncHandler(async (req, res) => {
    await Insight.deleteMany({ userId: req.userId });
    res.status(204).end();
  })
);

// ─── Serializer ──────────────────────────────────────────────────────────────
function toClientInsight(doc) {
  return {
    id: doc._id,
    awareness_level: doc.awarenessLevel,
    reasoning_summary: doc.reasoningSummary,
    symptom_impacts: doc.symptomImpacts ?? [],
    correlations: doc.correlations ?? [],
    red_flags: doc.redFlags ?? [],
    doctor_nudge: doc.doctorNudge,
    doctor_nudge_reason: doc.doctorNudgeReason ?? '',
    weekly_trend_summary: doc.weeklyTrendSummary ?? '',
    log_count_analyzed: doc.logCountAnalyzed ?? 0,
    date_range_start: doc.dateRangeStart,
    date_range_end: doc.dateRangeEnd,
    created_date: doc.createdAt,
  };
}

module.exports = router;
