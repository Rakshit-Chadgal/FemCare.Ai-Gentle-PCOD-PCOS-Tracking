const express = require('express');
const supabase = require('../config/supabase');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', req.userId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    res.json(data || null);
  } catch (err) {
    console.error('[insights] get error:', err.message);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content, insight_type, data: insightData, is_actionable } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'title and content are required' });
    }

    const { data: stored, error } = await supabase
      .from('ai_insights')
      .insert({
        user_id: req.userId,
        title,
        content,
        insight_type: insight_type || 'general',
        data: insightData || {},
        is_actionable: is_actionable || false,
      })
      .select('*')
      .single();
    if (error) throw error;
    res.status(201).json(stored);
  } catch (err) {
    console.error('[insights] create error:', err.message);
    res.status(500).json({ error: 'Failed to create insight' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { error } = await supabase
      .from('ai_insights')
      .delete()
      .eq('user_id', req.userId);
    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    console.error('[insights] deleteAll error:', err.message);
    res.status(500).json({ error: 'Failed to delete insights' });
  }
});

module.exports = router;
