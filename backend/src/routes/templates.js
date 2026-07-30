const express = require('express');
const supabase = require('../config/supabase');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('log_templates')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('[templates] list error:', err.message);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('log_templates')
      .insert({ ...req.body, user_id: req.userId })
      .select('*')
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('[templates] create error:', err.message);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('log_templates')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);
    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    console.error('[templates] delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

module.exports = router;
