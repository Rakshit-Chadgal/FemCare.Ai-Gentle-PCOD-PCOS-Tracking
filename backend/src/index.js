require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRouter = require('./routes/auth');
const profilesRouter = require('./routes/profiles');
const symptomsRouter = require('./routes/symptoms');
const insightsRouter = require('./routes/insights');
const logTemplatesRouter = require('./routes/logTemplates');
const usersRouter = require('./routes/users');
const aiRouter = require('./routes/ai');
const privacyRouter = require('./routes/privacy');
const errorHandler = require('./middleware/errorHandler');
const cleanupExpiredAuthTokens = require('./utils/cleanupExpiredAuthTokens');
const cache = require('./services/cache');
const auditLog = require('./middleware/audit');
const performanceMiddleware = require('./middleware/performance');

const app = express();

// ─── Security middleware ──────────────────────────────────────────────────────
app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ─── Rate limiting ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Too many AI requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));

// ─── Performance & response time ──────────────────────────────────────────────
app.use(performanceMiddleware);

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    res.setHeader('X-Response-Time', `${Date.now() - start}ms`);
  });
  next();
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  const cacheStats = cache.getStats ? cache.getStats() : { hits: 0, misses: 0, hitRate: 0 };
  res.json({
    ok: true,
    env: process.env.NODE_ENV,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    cache: process.env.REDIS_URL
      ? (cache.client?.status === 'ready' ? 'connected' : 'unavailable')
      : 'disabled',
    cacheStats,
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, auditLog, authRouter);
app.use('/api/profiles', apiLimiter, auditLog, profilesRouter);
app.use('/api/symptom-logs', apiLimiter, auditLog, symptomsRouter);
app.use('/api/insights', apiLimiter, auditLog, insightsRouter);
app.use('/api/log-templates', apiLimiter, auditLog, logTemplatesRouter);
app.use('/api/users', apiLimiter, auditLog, usersRouter);
app.use('/api/ai', apiLimiter, aiLimiter, auditLog, aiRouter);
app.use('/api/privacy', privacyRouter);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Database + server start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_URI, {
    maxPoolSize: parseInt(process.env.MONGO_MAX_POOL_SIZE) || 20,
    minPoolSize: parseInt(process.env.MONGO_MIN_POOL_SIZE) || 5,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('MongoDB connected');

    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true);
    }

    cleanupExpiredAuthTokens().catch(console.error);
    setInterval(() => cleanupExpiredAuthTokens().catch(console.error), 15 * 60 * 1000);

    const server = app.listen(PORT, () => {
      console.log(`FemCare backend running on http://localhost:${PORT}`);
    });

    // ── Graceful shutdown ───────────────────────────────────────────────────
    function shutdown(signal) {
      console.log(`${signal} received — shutting down gracefully`);
      server.close(() => {
        Promise.all([
          mongoose.connection.close(false),
          cache.disconnect(),
        ]).then(() => {
          console.log('MongoDB and Redis connections closed');
          process.exit(0);
        });
      });
      setTimeout(() => {
        console.error('Graceful shutdown timed out — forcing exit');
        process.exit(1);
      }, 25000);
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
