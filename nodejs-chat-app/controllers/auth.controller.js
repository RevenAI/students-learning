const User = require('../models/user.model');
const Session = require('../models/session.model');
const TokenService = require('../services/token.service');
const EmailService = require('../services/email.service');
const { generateRandomToken } = require('../utils/helpers');
const logger = require('../utils/logger');

const authController = {
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }

      // Create user
      const user = await User.create({ username, email, password });

      // Generate verification token
      const verificationToken = generateRandomToken();
      await CacheService.set(`verify:${verificationToken}`, user.id, 60 * 60 * 24); // 24 hours

      // Send verification email
      await EmailService.sendVerificationEmail(email, verificationToken);

      res.status(201).json({
        message: 'Registration successful. Please check your email to verify your account.',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get('User-Agent');

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if email is verified
      if (!user.is_verified) {
        return res.status(403).json({ error: 'Please verify your email first' });
      }

      // Generate tokens
      const tokens = TokenService.generateTokens({
        userId: user.id,
        username: user.username,
      });

      // Store refresh token
      await TokenService.storeRefreshToken(user.id, tokens.refreshToken);

      // Create session
      await Session.create({
        userId: user.id,
        token: tokens.accessToken,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        tokens,
      });
    } catch (err) {
      next(err);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
      }

      // Verify refresh token
      const decoded = TokenService.verifyToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Check if refresh token exists in Redis
      const isValid = await TokenService.verifyRefreshToken(decoded.userId, refreshToken);
      if (!isValid) {
        return res.status(401).json({ error: 'Refresh token expired or invalid' });
      }

      // Generate new tokens
      const tokens = TokenService.generateTokens({
        userId: decoded.userId,
        username: decoded.username,
      });

      // Update refresh token in Redis
      await TokenService.storeRefreshToken(decoded.userId, tokens.refreshToken);

      res.json({
        message: 'Token refreshed successfully',
        tokens,
      });
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { userId } = req.user;
      const token = req.token;

      // Delete refresh token
      await TokenService.removeRefreshToken(userId);

      // Delete session
      await Session.delete(token);

      res.json({ message: 'Logout successful' });
    } catch (err) {
      next(err);
    }
  },

  verifyEmail: async (req, res, next) => {
    try {
      const { token } = req.params;

      // Get user ID from cache
      const userId = await CacheService.get(`verify:${token}`);
      if (!userId) {
        return res.status(400).json({ error: 'Invalid or expired verification token' });
      }

      // Verify email
      const user = await User.verifyEmail(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete verification token from cache
      await CacheService.del(`verify:${token}`);

      res.json({ message: 'Email verified successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;