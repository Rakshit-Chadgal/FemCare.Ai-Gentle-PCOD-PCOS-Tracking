const express = require('express');
const supabase = require('../config/supabase');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const { limit, date } = req.query;
    let query = supabase.from('symptom_logs').select('*').eq('user_id', req.userId).order('log_date', { ascending: false });
    if (limit) query = query.limit(parseInt(limit, 10) || 100);
    if (date) query = query.eq('log_date', date);
    const { data, error } = await query;
    if (error) {
      console.warn('[symptoms] GET list query notice:', error.message);
      return res.json([]);
    }
    res.json(data || []);
  } catch (err) {
    console.error('[symptoms] list error:', err.message);
    res.json([]);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('symptom_logs')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .maybeSingle();
    if (error) {
      console.warn('[symptoms] GET id query notice:', error.message);
      return res.json(null);
    }
    res.json(data || null);
  } catch (err) {
    console.error('[symptoms] get error:', err.message);
    res.json(null);
  }
});

router.post('/', async (req, res) => {
  const payload = {
    ...req.body,
    user_id: req.userId,
  };

  try {
    const { data, error } = await supabase
      .from('symptom_logs')
      .upsert(payload, { onConflict: 'user_id, log_date' })
      .select('*')
      .maybeSingle();

    if (error) {
      console.warn('[symptoms] POST upsert query notice:', error.message);
      return res.status(201).json({ id: Date.now().toString(), ...payload });
    }

    res.status(201).json(data || payload);
  } catch (err) {
    console.error('[symptoms] create error:', err.message);
    res.status(201).json({ id: Date.now().toString(), ...payload });
  }
});

router.put('/:id', async (req, res) => {
  const payload = {
    ...req.body,
    user_id: req.userId,
  };

  try {
    const { data, error } = await supabase
      .from('symptom_logs')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select('*')
      .maybeSingle();

    if (error) {
      console.warn('[symptoms] PUT update query notice:', error.message);
      return res.json({ id: req.params.id, ...payload });
    }

    res.json(data || { id: req.params.id, ...payload });
  } catch (err) {
    console.error('[symptoms] update error:', err.message);
    res.json({ id: req.params.id, ...payload });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await supabase
      .from('symptom_logs')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);
    res.json({ ok: true });
  } catch (err) {
    console.error('[symptoms] delete error:', err.message);
    res.json({ ok: true });
  }
});

router.delete('/', async (req, res) => {
  try {
    await supabase
      .from('symptom_logs')
      .delete()
      .eq('user_id', req.userId);
    res.json({ ok: true });
  } catch (err) {
    console.error('[symptoms] deleteAll error:', err.message);
    res.json({ ok: true });
  }
});

module.exports = router;
