const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const symptomRoutes = require('./routes/symptoms');
const profileRoutes = require('./routes/profile');
const templateRoutes = require('./routes/templates');
const insightRoutes = require('./routes/insights');

const app = express();

app.set('trust proxy', 1);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(morgan('dev'));
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2000,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV !== 'production',
  })
);

// API routes FIRST
app.get('/api', (req, res) => {
  res.json({ status: 'ok', env: config.nodeEnv });
});

app.use('/auth', authRoutes);
app.use('/symptoms', symptomRoutes);
app.use('/profile', profileRoutes);
app.use('/templates', templateRoutes);
app.use('/insights', insightRoutes);

async function startServer() {
  await connectDB();

  const rootDir = path.resolve(__dirname, '../../');

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: rootDir,
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(rootDir, 'dist');
    const fs = require('fs');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      app.get('/', (req, res) => {
        res.json({ message: 'FemCare API is running on Render' });
      });
    }
  }

  const PORT = config.port || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[server] Running on http://0.0.0.0:${PORT} (${config.nodeEnv})`);
  });
}

startServer().catch((err) => {
  console.error('[server] Failed to start:', err);
});
