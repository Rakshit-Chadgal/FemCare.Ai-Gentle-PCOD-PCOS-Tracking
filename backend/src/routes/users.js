const express = require('express');
const User = require('../models/user');
const UserProfile = require('../models/userProfile');
const SymptomLog = require('../models/symptomLog');
const Insight = require('../models/insight');
const LogTemplate = require('../models/logTemplate');
const requireAuth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(requireAuth);

// ─── DELETE /api/users/me ─────────────────────────────────────────────────────
// Deletes all user data in order, then the user account itself
router.delete(
  '/me',
  asyncHandler(async (req, res) => {
    const uid = req.userId;
    await Promise.all([
      SymptomLog.deleteMany({ userId: uid }),
      Insight.deleteMany({ userId: uid }),
      LogTemplate.deleteMany({ userId: uid }),
      UserProfile.deleteOne({ userId: uid }),
    ]);
    await User.findByIdAndDelete(uid);
    res.status(204).end();
  })
);

module.exports = router;
