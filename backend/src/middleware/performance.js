const PERFORMANCE_THRESHOLD_MS = 100;

function performanceMiddleware(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > PERFORMANCE_THRESHOLD_MS) {
      console.log(`[perf] SLOW ${req.method} ${req.originalUrl} ${duration}ms`);
    }
  });
  next();
}

module.exports = performanceMiddleware;
