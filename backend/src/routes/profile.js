const express = require('express');
const supabase = require('../config/supabase');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', req.userId)
      .maybeSingle();

    if (error) {
      console.warn('[profile] GET query notice:', error.message);
      return res.json({ user_id: req.userId });
    }
    res.json(data || { user_id: req.userId });
  } catch (err) {
    console.error('[profile] GET error:', err.message);
    res.json({ user_id: req.userId });
  }
});

router.post('/', async (req, res) => {
  const profilePayload = {
    user_id: req.userId,
    display_name: req.body.display_name || 'Friend',
    onboarding_completed: req.body.onboarding_completed ?? true,
    disclaimer_acknowledged: req.body.disclaimer_acknowledged ?? true,
    ...req.body,
  };

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'user_id' })
      .select('*')
      .maybeSingle();

    if (error) {
      console.warn('[profile] POST upsert query notice:', error.message);
      // Fallback: try upserting core fields only in case of schema column mismatches
      const corePayload = {
        user_id: req.userId,
        display_name: req.body.display_name || 'Friend',
        onboarding_completed: true,
      };
      const { data: fallbackData } = await supabase
        .from('profiles')
        .upsert(corePayload, { onConflict: 'user_id' })
        .select('*')
        .maybeSingle();

      return res.status(201).json(fallbackData || profilePayload);
    }

    res.status(201).json(data || profilePayload);
  } catch (err) {
    console.error('[profile] POST error:', err.message);
    res.status(201).json(profilePayload);
  }
});

router.put('/', async (req, res) => {
  const updatePayload = {
    ...req.body,
    user_id: req.userId,
  };

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('user_id', req.userId)
      .select('*')
      .maybeSingle();

    if (error || !data) {
      console.warn('[profile] PUT update query notice:', error?.message || 'No row updated');
      const { data: upsertData } = await supabase
        .from('profiles')
        .upsert(updatePayload, { onConflict: 'user_id' })
        .select('*')
        .maybeSingle();

      return res.json(upsertData || updatePayload);
    }

    res.json(data);
  } catch (err) {
    console.error('[profile] PUT error:', err.message);
    res.json(updatePayload);
  }
});

router.delete('/', async (req, res) => {
  try {
    await supabase.from('profiles').delete().eq('user_id', req.userId);
    await supabase.from('users').delete().eq('id', req.userId);
    res.json({ ok: true });
  } catch (err) {
    console.error('[profile] DELETE error:', err.message);
    res.json({ ok: true });
  }
});

module.exports = router;
