const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const config = require('../config');
const supabase = require('../config/supabase');
const requireAuth = require('../middleware/auth');

const router = express.Router();
const googleClient = new OAuth2Client(config.googleClientId);

function signToken(userId) {
  return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

function toSafeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name || '',
    email_verified: !!user.email_verified,
    created_at: user.created_at || new Date().toISOString(),
  };
}

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check existing user
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = {
      email: cleanEmail,
      password_hash: passwordHash,
      name: (name || '').trim(),
      email_verified: true,
      created_at: new Date().toISOString(),
    };

    const { data: user, error } = await supabase
      .from('users')
      .insert(newUser)
      .select('id, email, name, email_verified, created_at')
      .single();

    if (error) {
      console.error('[auth] Register DB insert error:', error);
      return res.status(500).json({ error: 'Failed to create account. Please try again.' });
    }

    const token = signToken(user.id);
    return res.status(201).json({ token, user: toSafeUser(user) });
  } catch (err) {
    console.error('[auth] Register exception:', err);
    return res.status(500).json({ error: 'Registration failed due to a server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, name, email_verified, created_at')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error) {
      console.error('[auth] Login DB query error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user.id);
    return res.json({ token, user: toSafeUser(user) });
  } catch (err) {
    console.error('[auth] Login exception:', err);
    return res.status(500).json({ error: 'Login failed due to a server error' });
  }
});

// POST /auth/google
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    if (!config.googleClientId || !config.googleClientId.includes('.apps.googleusercontent.com')) {
      return res.status(400).json({ error: 'Google Sign-In is not configured on server' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: config.googleClientId,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.error('[auth] Google token verify error:', verifyErr.message);
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const { sub: googleId, email, email_verified, name } = payload;
    if (!email_verified) {
      return res.status(400).json({ error: 'Google email is not verified' });
    }

    const cleanEmail = email.toLowerCase();
    let user;

    const { data: byGoogle } = await supabase
      .from('users')
      .select('id, email, name, email_verified, created_at')
      .eq('google_id', googleId)
      .maybeSingle();

    if (byGoogle) {
      user = byGoogle;
    } else {
      const { data: byEmail } = await supabase
        .from('users')
        .select('id, email, name, email_verified, created_at')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (byEmail) {
        await supabase
          .from('users')
          .update({ google_id: googleId, email_verified: true, name: name || byEmail.name })
          .eq('id', byEmail.id);
        user = { ...byEmail, google_id: googleId, email_verified: true, name: name || byEmail.name };
      } else {
        const { data: created, error: createErr } = await supabase
          .from('users')
          .insert({
            email: cleanEmail,
            google_id: googleId,
            name: name || '',
            email_verified: true,
            created_at: new Date().toISOString(),
          })
          .select('id, email, name, email_verified, created_at')
          .single();

        if (createErr) throw createErr;
        user = created;
      }
    }

    const token = signToken(user.id);
    return res.json({ token, user: toSafeUser(user) });
  } catch (err) {
    console.error('[auth] Google auth exception:', err);
    return res.status(500).json({ error: 'Google authentication failed' });
  }
});

// GET /auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, email_verified, created_at')
      .eq('id', req.userId)
      .maybeSingle();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(toSafeUser(user));
  } catch (err) {
    console.error('[auth] GET /me exception:', err);
    return res.status(500).json({ error: 'Failed to verify user credentials' });
  }
});

// POST /auth/logout
router.post('/logout', requireAuth, (req, res) => {
  res.json({ message: 'Successfully logged out' });
});

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    res.json({ message: 'If an account exists with that email, reset instructions have been sent.' });

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    await supabase.from('users').update({
      reset_token: token,
      reset_token_expiry: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    }).eq('id', user.id);

    console.log(`[auth] Password reset link generated for ${cleanEmail}: ${config.frontendUrl}/reset-password?token=${token}`);
  } catch (err) {
    console.error('[auth] forgot-password exception:', err);
  }
});

// POST /auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const { data: user } = await supabase
      .from('users')
      .select('id, reset_token_expiry')
      .eq('reset_token', resetToken)
      .maybeSingle();

    if (!user || !user.reset_token_expiry || new Date(user.reset_token_expiry) < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired password reset link' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await supabase.from('users').update({
      password_hash: passwordHash,
      reset_token: null,
      reset_token_expiry: null,
    }).eq('id', user.id);

    return res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('[auth] reset-password exception:', err);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;
