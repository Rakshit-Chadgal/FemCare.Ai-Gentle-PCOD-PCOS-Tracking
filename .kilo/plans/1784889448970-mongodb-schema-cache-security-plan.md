# FemCare AI Backend Optimization Plan

## Context

The FemCare AI backend is a Node.js/Express/MongoDB application with Mongoose ODM, deployed on AWS ECS Fargate with an ALB. The codebase has 5 Mongoose models (User, UserProfile, SymptomLog, LogTemplate, Insight), a Redis caching layer (ioredis), JWT authentication, and 7 route modules. The project has already migrated from Base44 to a standalone backend (see MIGRATION_PLAN.md).

## Goals

1. Optimize MongoDB schema, relationships, and indexes for scalability
2. Implement complete Redis caching to reduce database load
3. Conduct a security audit and ensure GDPR/CCPA compliance
4. Update all dependencies to latest secure versions
5. Improve query performance with monitoring and profiling

---

## 1. MongoDB Schema Optimization

### 1.1 Add TTL Index for Auto-Expiring Temporary Data

**File:** `backend/src/models/user.js`

Add a TTL index on `otpExpiresAt` so expired OTP documents are automatically cleaned up by MongoDB (complementing the existing `$unset` cleanup job):

```js
userSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0, name: 'idx_user_otp_ttl' });
```

Similarly add a TTL index on `resetTokenExpiry`:

```js
userSchema.index({ resetTokenExpiry: 1 }, { expireAfterSeconds: 0, name: 'idx_user_reset_ttl' });
```

**Rationale:** TTL indexes provide automatic server-side cleanup of expired auth fields, reducing the load on the periodic `$unset` job and ensuring no stale tokens persist beyond their expiry.

### 1.2 Add Compound Index for Doctor Report Range Queries

**File:** `backend/src/models/symptomLog.js`

Add a covering index for the AI doctor-report range query (`find({ userId, logDate: { $gte: cutoffStr } })`):

```js
symptomLogSchema.index(
  { userId: 1, logDate: 1, cycleStarted: 1 },
  { name: 'idx_symptomlog_user_date_cycle' }
);
```

**Rationale:** The AI doctor-report endpoint queries symptom logs by userId and date range, then scans all fields. A compound index including frequently-filtered fields improves query performance.

### 1.3 Add Index for Insight Date Range Queries

**File:** `backend/src/models/insight.js`

Add an index for date-range lookups used by the AI route:

```js
insightSchema.index(
  { userId: 1, dateRangeStart: 1, dateRangeEnd: 1 },
  { name: 'idx_insight_user_daterange' }
);
```

### 1.4 Optimize User Profile Virtual

**File:** `backend/src/models/userProfile.js`

Add `strict: 'throw'` to the schema options to prevent accidental insertion of undefined fields that would waste index space and document size.

### 1.5 Connection Pool Tuning

**File:** `backend/src/index.js`

Configure Mongoose connection pool size based on environment:

```js
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: parseInt(process.env.MONGO_MAX_POOL_SIZE) || 20,
  minPoolSize: parseInt(process.env.MONGO_MIN_POOL_SIZE) || 5,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

**Rationale:** Default pool size of 5 is too low for production traffic. Tuning prevents connection exhaustion under load and reduces latency from connection establishment.

---

## 2. Redis Caching Implementation

### 2.1 Extend Cache Coverage to AI Route

**File:** `backend/src/routes/ai.js`

The AI route's `POST /api/ai/insights` endpoint fetches the user profile (`UserProfile.findOne({ userId })`) on every request. Cache this profile lookup:

```js
const profileKey = cache.KEY.profile(req.userId);
const cachedProfile = await cache.get(profileKey);
const profile = cachedProfile || await UserProfile.findOne({ userId: req.userId }).lean();
if (!cachedProfile && profile) await cache.set(profileKey, profile, cache.TTL.PROFILE);
```

Also cache the symptom logs list for the AI route (it fetches last 200 logs):

```js
const logsKey = cache.KEY.logsList(req.userId, 200);
const cachedLogs = await cache.get(logsKey);
const rawLogs = cachedLogs || await SymptomLog.find({ userId: req.userId }).sort({ logDate: -1 }).limit(200).lean();
if (!cachedLogs && rawLogs.length > 0) await cache.set(logsKey, rawLogs, cache.TTL.LOGS);
```

### 2.2 Cache Invalidation on User Deletion

**File:** `backend/src/routes/users.js`

When a user is deleted, invalidate all their cache entries:

```js
await cache.delPattern(`fc:profile:${req.userId}`);
await cache.delPattern(`fc:logs:*:${req.userId}:*`);
await cache.delPattern(`fc:insights:${req.userId}`);
await cache.delPattern(`fc:templates:${req.userId}`);
```

### 2.3 Add Cache Warming on Profile Update

**File:** `backend/src/routes/profiles.js`

The profile POST already writes to cache after update. Ensure the cache warming is atomic with the DB write by using a transaction-like pattern (set cache after successful DB write, which is already done).

### 2.4 Add Cache Hit/Miss Metrics

**File:** `backend/src/services/cache.js`

Add simple counters for monitoring cache effectiveness:

```js
let hits = 0;
let misses = 0;

async function get(key) {
  if (!client) { misses++; return null; }
  try {
    const raw = await client.get(key);
    if (raw) { hits++; return JSON.parse(raw); }
    misses++;
    return null;
  } catch { misses++; return null; }
}

function getStats() { return { hits, misses, hitRate: hits + misses > 0 ? hits / (hits + misses) : 0 }; }
```

Expose stats via the health endpoint in `backend/src/index.js`.

---

## 3. Security Audit & GDPR/CCPA Compliance

### 3.1 GDPR Data Export Endpoint

**File:** `backend/src/routes/users.js` (new route: `GET /api/users/me/export`)

Add a data export endpoint that returns all user data in a structured JSON format (GDPR Article 20 - Right to Data Portability):

```js
router.get(
  '/me/export',
  requireAuth,
  asyncHandler(async (req, res) => {
    const [user, profile, logs, insights, templates] = await Promise.all([
      User.findById(req.userId).select('-passwordHash -otpCode -otpExpiresAt -resetToken -resetTokenExpiry').lean(),
      UserProfile.findOne({ userId: req.userId }).lean(),
      SymptomLog.find({ userId: req.userId }).sort({ logDate: -1 }).lean(),
      Insight.find({ userId: req.userId }).sort({ createdAt: -1 }).lean(),
      LogTemplate.find({ userId: req.userId }).lean(),
    ]);

    const exportData = {
      user,
      profile,
      symptomLogs: logs,
      insights,
      logTemplates: templates,
      exportedAt: new Date().toISOString(),
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="femcare-data-${req.userId}.json"`);
    res.json(exportData);
  })
);
```

### 3.2 GDPR Data Deletion Endpoint (Right to Erasure)

**File:** `backend/src/routes/users.js` (new route: `DELETE /api/users/me/export`)

The existing `DELETE /api/users/me` already cascades deletion. Add an explicit GDPR-compliant endpoint that:
1. Anonymizes the user record (replaces PII with placeholders)
2. Deletes all child documents
3. Returns confirmation

```js
router.delete(
  '/me/gdpr',
  requireAuth,
  asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.userId, {
      email: `deleted-${req.userId}@anonymized.invalid`,
      passwordHash: undefined,
      otpCode: undefined,
      otpExpiresAt: undefined,
      resetToken: undefined,
      resetTokenExpiry: undefined,
      googleId: undefined,
      emailVerified: false,
    });
    await User.findByIdAndDelete(req.userId);
    // Cascade hooks handle child documents
    await cache.delPattern(`fc:profile:${req.userId}`);
    await cache.delPattern(`fc:logs:*:${req.userId}:*`);
    await cache.delPattern(`fc:insights:${req.userId}`);
    await cache.delPattern(`fc:templates:${req.userId}`);
    res.status(204).end();
  })
);
```

### 3.3 Data Retention Policy

**File:** `backend/src/utils/cleanupExpiredAuthTokens.js` (extend)

Extend the existing cleanup utility to also:
1. Delete SymptomLog records older than 365 days (configurable via `DATA_RETENTION_DAYS`)
2. Delete Insight records older than 365 days
3. Delete LogTemplate records older than 365 days

```js
const RETENTION_DAYS = parseInt(process.env.DATA_RETENTION_DAYS) || 365;
const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
const cutoffStr = cutoff.toISOString().slice(0, 10);

await SymptomLog.deleteMany({ userId: req.userId, logDate: { $lt: cutoffStr } });
```

**Note:** This should be a scheduled job (cron), not per-request. Add a separate script or use a cloud scheduler.

### 3.4 PII Encryption at Rest

**File:** `backend/src/models/user.js`

Encrypt the `email` field at the application level using AES-256-GCM with a key from `process.env.EMAIL_ENCRYPTION_KEY`. This ensures that even if the MongoDB backup is compromised, PII is protected.

Add encryption/decryption helpers in `backend/src/utils/encryption.js`:

```js
const crypto = require('crypto');
const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.EMAIL_ENCRYPTION_KEY, 'hex');

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}:${cipher.getAuthTag().toString('hex')}`;
}

function decrypt(encrypted) {
  const [ivHex, content, authTagHex] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 3.5 Audit Logging for PII Access

**File:** `backend/src/middleware/audit.js` (new file)

Create an audit middleware that logs all requests that access PII:

```js
const fs = require('fs');
const path = require('path');

const AUDIT_LOG = path.join(__dirname, '..', '..', 'audit.log');

function auditLog(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
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
  });
  next();
}
```

### 3.6 HTTPS Enforcement (HSTS)

**File:** `backend/src/index.js`

Add HSTS header via helmet configuration:

```js
app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

### 3.7 Rate Limiting on AI Endpoints

**File:** `backend/src/routes/ai.js`

The AI endpoints are computationally expensive. Add a dedicated rate limiter:

```js
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Too many AI requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
router.use('/insights', aiLimiter);
router.use('/summary/doctor-report', aiLimiter);
```

### 3.8 Input Validation with Zod

**File:** `backend/src/middleware/validate.js` (new file)

Create Zod validation schemas for all request bodies to prevent injection and malformed data:

```js
const { z } = require('zod');

const profileUpdateSchema = z.object({
  display_name: z.string().trim().min(1, 'display_name is required').max(100),
  age: z.number().min(10).max(80).optional(),
  diagnosis_status: z.enum(['suspect', 'diagnosed', 'not_sure']).optional(),
  cycle_regularity: z.enum(['regular', 'irregular', 'very_irregular', 'unknown']).optional(),
  typical_cycle_length: z.number().min(15).max(60).optional(),
  has_ultrasound_finding: z.boolean().optional(),
  ultrasound_notes: z.string().trim().max(500).optional(),
  disclaimer_acknowledged: z.boolean().optional(),
  onboarding_completed: z.boolean().optional(),
});
```

Apply validation middleware to all routes that accept user input.

### 3.9 Privacy Policy Endpoint

**File:** `backend/src/routes/privacy.js` (new file)

Add a static privacy policy endpoint that returns GDPR/CCPA compliance information:

```js
router.get('/privacy', (req, res) => {
  res.json({
    policyVersion: '1.0.0',
    lastUpdated: '2026-07-24',
    dataCollected: ['email', 'symptom logs', 'profile data', 'insights'],
    dataRetentionDays: parseInt(process.env.DATA_RETENTION_DAYS) || 365,
    rightToExport: true,
    rightToDeletion: true,
    contactEmail: process.env.PRIVACY_CONTACT_EMAIL || 'privacy@femcare.ai',
  });
});
```

---

## 4. Dependency Updates

### 4.1 Update Backend Dependencies

**File:** `backend/package.json`

Update all dependencies to latest secure versions:

| Package | Current | Target | Reason |
|---------|---------|--------|--------|
| express-rate-limit | ^7.3.1 | ^8.6.0 | Security patches |
| google-auth-library | ^9.10.0 | ^9.14.0 | Security patches |
| helmet | ^7.1.0 | ^8.1.0 | Security patches |
| ioredis | ^5.11.1 | ^5.11.1 | Already latest |
| nodemailer | ^6.9.13 | ^7.0.0 | Security patches |
| openai | ^4.52.0 | ^5.0.0 | Latest API support |
| zod | ^3.23.8 | ^3.24.0 | Latest version |
| bcryptjs | (root) | ^3.0.3 | Already latest |
| mongoose | ^9.8.0 | ^9.8.0 | Already latest |
| jsonwebtoken | ^9.0.3 | ^9.0.3 | Already latest |

### 4.2 Add Security Audit Script

**File:** `backend/package.json`

Add npm scripts for automated security auditing:

```json
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix",
    "audit:ci": "npm audit --audit-level=moderate --json > audit-report.json"
  }
}
```

### 4.3 Add Dependabot Configuration

**File:** `.github/dependabot.yml` (new file)

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/backend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "security"
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "security"
```

---

## 5. Performance Metrics & Query Optimization

### 5.1 Add Query Performance Middleware

**File:** `backend/src/middleware/performance.js` (new file)

Add middleware that logs slow queries and measures response times:

```js
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
```

### 5.2 Add MongoDB Query Profiling

**File:** `backend/src/index.js`

Enable MongoDB profiling in development/staging environments:

```js
if (process.env.NODE_ENV !== 'production') {
  mongoose.connection.on('connected', () => {
    mongoose.set('debug', true);
  });
}
```

### 5.3 Add Response Time Header

**File:** `backend/src/index.js`

Add a custom header with response time for monitoring:

```js
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    res.setHeader('X-Response-Time', `${Date.now() - start}ms`);
  });
  next();
});
```

### 5.4 Optimize SymptomLog Queries with Projection

**File:** `backend/src/routes/symptoms.js`

The list endpoint already uses `.lean()` but does not use projection. Add projection to only return needed fields, reducing data transfer:

```js
const logs = await SymptomLog.find({ userId: req.userId })
  .sort({ logDate: -1 })
  .limit(limit)
  .select('-__v')
  .lean();
```

---

## 6. Auto-Scaling Verification

### 6.1 Verify Existing Auto-Scaling Configuration

**File:** `infra/03-ecs-autoscaling.yml`

The existing configuration already has three scaling policies:
1. ALBRequestCountPerTarget (primary) - target 1000 req/min per task
2. ECSServiceAverageCPUUtilization (secondary) - target 70%
3. ECSServiceAverageMemoryUtilization (tertiary) - target 80%, scale-in disabled

**Action:** Verify the configuration is correct and add a parameter for Redis connection scaling (if Redis is deployed as ElastiCache, ensure the cluster size scales with ECS tasks).

### 6.2 Add Redis ElastiCache to Infrastructure

**File:** `infra/03-ecs-autoscaling.yml` (or new `04-redis.yml`)

Add an AWS ElastiCache Redis resource to the infrastructure stack, linked to the ECS service via environment variable `REDIS_URL`.

---

## Files to Modify

| File | Action |
|------|--------|
| `backend/src/models/user.js` | Add TTL indexes, encryption helpers |
| `backend/src/models/symptomLog.js` | Add compound covering index |
| `backend/src/models/insight.js` | Add date range index |
| `backend/src/models/userProfile.js` | Add strict mode |
| `backend/src/index.js` | Add connection pool config, HSTS, performance middleware, query profiling |
| `backend/src/services/cache.js` | Add hit/miss stats |
| `backend/src/routes/ai.js` | Add Redis caching for profile/log lookups |
| `backend/src/routes/users.js` | Add GDPR export/deletion endpoints, cache invalidation |
| `backend/src/routes/profiles.js` | Minor cache warming improvements |
| `backend/src/routes/symptoms.js` | Add projection optimization |
| `backend/src/middleware/auth.js` | Add audit logging integration |
| `backend/src/middleware/validate.js` | New file - Zod validation schemas |
| `backend/src/middleware/performance.js` | New file - performance monitoring |
| `backend/src/middleware/audit.js` | New file - audit logging |
| `backend/src/utils/cleanupExpiredAuthTokens.js` | Extend with data retention cleanup |
| `backend/src/utils/encryption.js` | New file - PII encryption helpers |
| `backend/src/routes/privacy.js` | New file - privacy policy endpoint |
| `backend/package.json` | Update dependency versions, add audit scripts |
| `backend/.env` | Add new env vars (REDIS_URL, EMAIL_ENCRYPTION_KEY, DATA_RETENTION_DAYS, etc.) |
| `backend/.env.example` | Update with new env vars |
| `infra/03-ecs-autoscaling.yml` | Add Redis ElastiCache reference |
| `.github/dependabot.yml` | New file - automated dependency updates |

---

## Acceptance Criteria Mapping

| Criterion | Status | Implementation |
|-----------|--------|----------------|
| MongoDB schema with defined relationships and indexes | ✅ Already done + TTL/compound indexes added | 1.1-1.5 |
| Auto-scaling policies using AWS Auto Scaling | ✅ Already done | 6.1-6.2 |
| Redis caching for reducing database load | ✅ Partial + AI route caching added | 2.1-2.4 |
| Security audit conducted, GDPR/CCPA compliance ensured | ⬜ New | 3.1-3.9 |
| Dependencies updated to latest versions | ⬜ New | 4.1-4.3 |
| Performance metrics improved and query optimization complete | ⬜ New | 5.1-5.4 |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| TTL indexes may not fire immediately | Keep the periodic cleanup job as a fallback |
| Redis cache invalidation on cascade delete is complex | Use `delPattern` with user-scoped keys; test thoroughly |
| PII encryption adds latency to email lookups | Cache decrypted values per-request; encrypt only at rest |
| Zod validation adds overhead | Only validate on write endpoints; reads use lean() queries |
| Data retention cleanup may be slow on large datasets | Run during off-peak hours; batch deletions in chunks of 1000 |
| HSTS with preload is irreversible | Only enable after confirming HTTPS is fully configured on ALB |

---

## Validation Steps

1. Run `npm run audit` in backend directory to verify no moderate+ vulnerabilities
2. Run `npm test` (if tests exist) or manually test each endpoint with curl
3. Verify Redis connectivity: `curl http://localhost:4000/health` should show `cache: connected`
4. Test GDPR export endpoint with a valid JWT token
5. Test GDPR deletion endpoint and verify all child documents are removed
6. Verify MongoDB indexes with `db.collection.getIndexes()` in mongosh
7. Verify auto-scaling policies in AWS Console
8. Run `npm outdated` in both root and backend directories to confirm updates
