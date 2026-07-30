const supabase = require('./supabase');

async function connectDB() {
  const { error } = await supabase.from('profiles').select('id').limit(1);
  if (error) {
    console.warn('[db] Supabase warning:', error.message);
    console.warn('[db] Make sure you have:');
    console.warn('[db]   1. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
    console.warn('[db]   2. Run backend/schema.sql in the Supabase SQL Editor');
    console.warn('[db] Server will continue — API calls will fail until DB is ready.');
    return;
  }
  console.log('[db] Connected to Supabase');
}

module.exports = connectDB;
