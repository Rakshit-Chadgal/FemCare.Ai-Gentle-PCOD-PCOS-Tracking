require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

module.exports = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  isProduction: process.env.NODE_ENV === 'production',

  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
});
