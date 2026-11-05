// In-memory per-IP rate limiter for /api/chat. No Redis/DB — resets on
// server restart, which is an accepted tradeoff (abuse-throttling, not
// billing-critical). See 00-ARCHITECTURE.md's "Rate limiting & abuse
// hardening" section.
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 15;
const MAX_TRACKED_IPS = 10000;

const requestCounts = new Map();

export function isRateLimited(ip) {
  const now = Date.now();
  if (requestCounts.size >= MAX_TRACKED_IPS) {
    for (const [trackedIp, { windowStart }] of requestCounts) {
      if (now - windowStart > WINDOW_MS) requestCounts.delete(trackedIp);
    }
  }

  const entry = requestCounts.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    requestCounts.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}
