// The browser holds the attempt counts in quoteFlow, so a caller can reset them.
// This server-side count per IP and field is the one that enforces the limit.
// In-memory like rateLimiter.js, so it resets on server restart. It isn't cleared
// when the chat closes, or a caller could ignore the close and carry on. A valid
// answer always gets through and clears it, so a real customer is never blocked.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_TRACKED_KEYS = 10000;

const failedAttempts = new Map();

export function recordFailedAttempt(ip, field) {
  const now = Date.now();
  if (failedAttempts.size >= MAX_TRACKED_KEYS) {
    for (const [key, { windowStart }] of failedAttempts) {
      if (now - windowStart > WINDOW_MS) failedAttempts.delete(key);
    }
  }

  const key = `${ip}:${field}`;
  const entry = failedAttempts.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    failedAttempts.set(key, { count: 1, windowStart: now });
    return 1;
  }

  entry.count += 1;
  return entry.count;
}

export function clearFailedAttempts(ip, field) {
  failedAttempts.delete(`${ip}:${field}`);
}
