const express = require('express');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.get(
  '/privacy',
  (req, res) => {
    res.json({
      policyVersion: '1.0.0',
      lastUpdated: '2026-07-24',
      dataCollected: ['email', 'symptom logs', 'profile data', 'insights'],
      dataRetentionDays: parseInt(process.env.DATA_RETENTION_DAYS) || 365,
      rightToExport: true,
      rightToDeletion: true,
      contactEmail: process.env.PRIVACY_CONTACT_EMAIL || 'privacy@femcare.ai',
    });
  }
);

module.exports = router;
