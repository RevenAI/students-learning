const User = require('../models/user.model');
const Session = require('../models/session.model');
const logger = require('../utils/logger');
const { sanitizeUser } = require('../utils/helpers');

const userController = {
  getProfile: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(sanitizeUser(user));
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const { username, email } = req.body;
      const userId = req.user.userId;

      // Check if username or email already exists
      if (username) {
        const existingUser = await User.findByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ error: 'Username already in use' });
        }
      }

      if (email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ error: 'Email already in use' });
        }
      }

      // Update user
      const queryParts = [];
      const queryValues = [];
      let counter = 1;

      if (username) {
        queryParts.push(`username = $${counter}`);
        queryValues.push(username);
        counter++;
      }

      if (email) {
        queryParts.push(`email = $${counter}`);
        queryValues.push(email);
        counter++;
      }

      if (queryParts.length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      queryValues.push(userId);
      const query = `
        UPDATE users 
        SET ${queryParts.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${counter}
        RETURNING id, username, email, is_verified, created_at
      `;

      const result = await pool.query(query, queryValues);
      const updatedUser = result.rows[0];

      res.json({
        message: 'Profile updated successfully',
        user: sanitizeUser(updatedUser),
      });
    } catch (err) {
      next(err);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      // Get user
      const user = await User.findByIdWithPassword(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isMatch = await User.comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await pool.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [hashedPassword, userId]
      );

      // Invalidate all sessions
      await Session.deleteAllForUser(userId);

      res.json({ message: 'Password changed successfully. Please login again.' });
    } catch (err) {
      next(err);
    }
  },

  getActiveSessions: async (req, res, next) => {
    try {
      const sessions = await Session.findByUserId(req.user.userId);
      res.json(sessions.map(session => ({
        id: session.id,
        ip_address: session.ip_address,
        user_agent: session.user_agent,
        created_at: session.created_at,
        expires_at: session.expires_at,
      })));
    } catch (err) {
      next(err);
    }
  },

  revokeSession: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const session = await Session.findById(sessionId);

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      if (session.user_id !== req.user.userId) {
        return res.status(403).json({ error: 'Not authorized to revoke this session' });
      }

      await Session.delete(session.token);
      res.json({ message: 'Session revoked successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;