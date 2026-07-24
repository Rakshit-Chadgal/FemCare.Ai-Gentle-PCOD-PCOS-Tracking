/**
 * cache.js — Redis-backed cache with transparent no-op fallback.
 *
 * If REDIS_URL is not set the app behaves exactly as before — every method
 * returns null / resolves immediately. This keeps local dev zero-config.
 *
 * Key schema (all prefixed with "fc:"):
 *   fc:profile:{userId}            — UserProfile document (TTL 300s)
 *   fc:logs:list:{userId}:{limit}  — SymptomLog list (TTL 120s)
 *   fc:logs:date:{userId}:{date}   — Single SymptomLog by date (TTL 120s)
 *   fc:insights:{userId}           — Latest insights list (TTL 300s)
 *   fc:templates:{userId}          — LogTemplate list (TTL 300s)
 */

'use strict';

const Redis = require('ioredis');

// ── TTLs (seconds) ────────────────────────────────────────────────────────────
const TTL = {
  PROFILE:   300,   // profile changes rarely
  LOGS:      120,   // user logs daily; keep short so new entries appear quickly
  INSIGHTS:  300,   // generated infrequently
  TEMPLATES: 300,   // templates change rarely
};

// ── Key builders ──────────────────────────────────────────────────────────────
const KEY = {
  profile:   (uid)         => `fc:profile:${uid}`,
  logsList:  (uid, limit)  => `fc:logs:list:${uid}:${limit}`,
  logsDate:  (uid, date)   => `fc:logs:date:${uid}:${date}`,
  insights:  (uid)         => `fc:insights:${uid}`,
  templates: (uid)         => `fc:templates:${uid}`,
};

// ── Client setup ──────────────────────────────────────────────────────────────
let client = null;

if (process.env.REDIS_URL) {
  client = new Redis(process.env.REDIS_URL, {
    // Reconnect with capped exponential backoff — never give up, but don't
    // hammer a restarting Redis instance.
    retryStrategy(times) {
      return Math.min(times * 100, 3000); // max 3s between retries
    },
    // If Redis is unreachable, commands fail fast rather than queuing forever.
    enableOfflineQueue: false,
    lazyConnect: false,
    maxRetriesPerRequest: 1,
  });

  client.on('connect',           () => console.log('[cache] Redis connected'));
  client.on('reconnecting',      () => console.log('[cache] Redis reconnecting...'));
  client.on('error', (err)       => console.error('[cache] Redis error:', err.message));
}

// ── Core helpers ──────────────────────────────────────────────────────────────

let hits = 0;
let misses = 0;

/**
 * get — returns parsed JSON value or null on miss / Redis unavailable.
 */
async function get(key) {
  if (!client) { misses++; return null; }
  try {
    const raw = await client.get(key);
    if (raw) { hits++; return JSON.parse(raw); }
    misses++;
    return null;
  } catch {
    misses++;
    return null; // treat any Redis error as a cache miss
  }
}

function getStats() {
  const total = hits + misses;
  return {
    hits,
    misses,
    hitRate: total > 0 ? Number((hits / total).toFixed(4)) : 0,
  };
}

/**
 * set — serialises value as JSON with the given TTL in seconds.
 * Silently swallows errors so a Redis failure never breaks a request.
 */
async function set(key, value, ttl) {
  if (!client) return;
  try {
    await client.set(key, JSON.stringify(value), 'EX', ttl);
  } catch {
    // intentionally silent
  }
}

/**
 * del — deletes one or more exact keys.
 */
async function del(...keys) {
  if (!client || keys.length === 0) return;
  try {
    await client.del(...keys);
  } catch {
    // intentionally silent
  }
}

/**
 * delPattern — deletes all keys matching a glob pattern using SCAN
 * (non-blocking, safe for production).
 *
 * Example: delPattern('fc:logs:*:abc123:*')
 */
async function delPattern(pattern) {
  if (!client) return;
  try {
    const stream = client.scanStream({ match: pattern, count: 100 });
    const pipeline = client.pipeline();
    let queued = 0;

    await new Promise((resolve, reject) => {
      stream.on('data', (keys) => {
        keys.forEach((k) => { pipeline.del(k); queued++; });
      });
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    if (queued > 0) await pipeline.exec();
  } catch {
    // intentionally silent
  }
}

/**
 * disconnect — called during graceful shutdown to close the Redis connection
 * cleanly before the process exits.
 */
async function disconnect() {
  if (!client) return;
  try {
    await client.quit();
    console.log('[cache] Redis connection closed');
  } catch {
    client.disconnect();
  }
}

module.exports = { get, set, del, delPattern, disconnect, getStats, KEY, TTL, client };
