const jwt = require('jsonwebtoken');
const { JWT } = require('../config/env');
const Session = require('../models/session.model');
const TokenService = require('../services/token.service');
const logger = require('../utils/logger');

const authMiddleware = {
  authenticate: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication token required' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
      }

      // Verify token
      const decoded = TokenService.verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      // Check session
      const session = await Session.findByToken(token);
      if (!session) {
        return res.status(401).json({ error: 'Session expired' });
      }

      // Attach user and token to request
      req.user = decoded;
      req.token = token;

      next();
    } catch (err) {
      logger.error('Authentication error:', err);
      res.status(401).json({ error: 'Authentication failed' });
    }
  },

  checkVerified: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user.is_verified) {
        return res.status(403).json({ error: 'Please verify your email first' });
      }
      next();
    } catch (err) {
      next(err);
    }
  },

  socketAuthenticate: async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = TokenService.verifyToken(token);
      if (!decoded) {
        return next(new Error('Invalid or expired token'));
      }

      const session = await Session.findByToken(token);
      if (!session) {
        return next(new Error('Session expired'));
      }

      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  },
};

module.exports = authMiddleware;