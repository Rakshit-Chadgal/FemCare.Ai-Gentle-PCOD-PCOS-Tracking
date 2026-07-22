const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const UserProfile = require('../models/userProfile');
const { sendOtp, sendPasswordReset } = require('../services/emailService');
const requireAuth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── Helpers ────────────────────────────────────────────────────────────────

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function generateOtp() {
  return String(crypto.randomInt(100000, 999999));
}

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const otp = generateOtp();
    const user = new User({
      email,
      passwordHash: password, // pre-save hook hashes it
      otpCode: otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });
    await user.save();

    await sendOtp(email, otp);
    res.status(201).json({ message: 'Verification code sent to your email' });
  })
);

// ─── POST /api/auth/verify-otp ───────────────────────────────────────────────
router.post(
  '/verify-otp',
  asyncHandler(async (req, res) => {
    const { email, otpCode } = req.body;
    if (!email || !otpCode) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+otpCode +otpExpiresAt'
    );
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.otpCode !== otpCode) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    user.emailVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  })
);

// ─── POST /api/auth/resend-otp ───────────────────────────────────────────────
router.post(
  '/resend-otp',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal whether the email exists
      return res.json({ message: 'If that email exists, a new code was sent' });
    }

    const otp = generateOtp();
    user.otpCode = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtp(email, otp);
    res.json({ message: 'New verification code sent' });
  })
);

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.emailVerified) {
      // Resend OTP so they can verify
      const otp = generateOtp();
      user.otpCode = otp;
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendOtp(email, otp);
      return res.status(403).json({
        error: 'Email not verified',
        requiresVerification: true,
      });
    }

    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  })
);

// ─── POST /api/auth/google ───────────────────────────────────────────────────
router.post(
  '/google',
  asyncHandler(async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'idToken is required' });

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, email, email_verified } = ticket.getPayload();

    if (!email_verified) {
      return res.status(400).json({ error: 'Google account email is not verified' });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (!user) {
      user = await User.create({ email, googleId, emailVerified: true });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.emailVerified = true;
      await user.save();
    }

    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  })
);

// ─── POST /api/auth/forgot-password ─────────────────────────────────────────
router.post(
  '/forgot-password',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    // Always respond 200 to avoid email enumeration
    res.json({ message: 'If that email exists, a reset link was sent' });

    if (!email) return;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendPasswordReset(email, resetUrl).catch(console.error);
  })
);

// ─── POST /api/auth/reset-password ──────────────────────────────────────────
router.post(
  '/reset-password',
  asyncHandler(async (req, res) => {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const user = await User.findOne({ resetToken }).select('+resetToken +resetTokenExpiry');
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ error: 'Reset link is invalid or has expired' });
    }

    user.passwordHash = newPassword; // pre-save hook re-hashes
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  })
);

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user._id, email: user.email, role: user.role });
  })
);

// ─── POST /api/auth/logout ───────────────────────────────────────────────────
// JWT is stateless — logout is handled client-side by deleting the token.
// This endpoint exists so the frontend has a consistent API surface.
router.post('/logout', requireAuth, (req, res) => {
  res.json({ message: 'Logged out' });
});

module.exports = router;
