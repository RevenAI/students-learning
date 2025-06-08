const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('../config/env');
const logger = require('../utils/logger');

const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX,
  message: 'Too many requests from this IP, please try again later',
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).json({ 
      error: options.message,
      retryAfter: `${options.windowMs / 1000} seconds`
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts, please try again later',
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).json({ 
      error: options.message,
      retryAfter: '15 minutes'
    });
  },
  skip: (req) => req.method !== 'POST',
});

const sensitiveActionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many sensitive actions, please try again later',
  handler: (req, res, next, options) => {
    logger.warn(`Sensitive action rate limit exceeded for user: ${req.user?.userId}`);
    res.status(options.statusCode).json({ 
      error: options.message,
      retryAfter: '1 hour'
    });
  },
  keyGenerator: (req) => req.user?.userId || req.ip,
  skip: (req) => !req.user,
});

module.exports = {
  apiLimiter,
  authLimiter,
  sensitiveActionLimiter,
};