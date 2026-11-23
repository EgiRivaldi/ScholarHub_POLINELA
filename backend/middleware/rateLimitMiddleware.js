const { errorResponse } = require('../utils/responseHelper');

// In-memory store for rate limiting login attempts
// Maps IP address -> { count: number, resetTime: number }
const loginAttempts = new Map();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const MAX_ATTEMPTS = 5; // Max 5 failed attempts per IP within the window

const loginRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown-ip';
  const now = Date.now();

  const record = loginAttempts.get(ip);

  if (record) {
    if (now > record.resetTime) {
      // Window expired, reset counter
      loginAttempts.delete(ip);
    } else if (record.count >= MAX_ATTEMPTS) {
      const waitSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', waitSeconds);
      return errorResponse(
        res,
        `Terlalu banyak percobaan login yang gagal. Silakan coba lagi dalam ${Math.ceil(waitSeconds / 60)} menit.`,
        [],
        429
      );
    }
  }

  next();
};

const recordFailedAttempt = (ip) => {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetTime) {
    loginAttempts.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
  } else {
    record.count += 1;
  }
};

const clearFailedAttempts = (ip) => {
  loginAttempts.delete(ip);
};

module.exports = {
  loginRateLimiter,
  recordFailedAttempt,
  clearFailedAttempts,
};
