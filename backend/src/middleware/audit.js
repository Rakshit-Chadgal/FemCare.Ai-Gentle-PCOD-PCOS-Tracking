const fs = require('fs');
const path = require('path');

const AUDIT_LOG = path.join(__dirname, '..', '..', 'audit.log');

function auditLog(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    try {
      const entry = JSON.stringify({
        timestamp: new Date().toISOString(),
        userId: req.userId || null,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - start,
        userAgent: req.get('user-agent'),
        ip: req.ip,
      });
      fs.appendFileSync(AUDIT_LOG, entry + '\n');
    } catch {
      // non-critical: if audit logging fails, do not block the response
    }
  });
  next();
}

module.exports = auditLog;
