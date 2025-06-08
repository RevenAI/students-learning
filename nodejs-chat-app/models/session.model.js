const { pool } = require('../config/db');
const logger = require('../utils/logger');

class Session {
  static async create({ userId, token, ipAddress, userAgent, expiresAt }) {
    const query = `
      INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    try {
      const result = await pool.query(query, [
        userId, token, ipAddress, userAgent, expiresAt
      ]);
      return result.rows[0];
    } catch (err) {
      logger.error('Error creating session:', err);
      throw err;
    }
  }

  static async findByToken(token) {
    const query = 'SELECT * FROM sessions WHERE token = $1';
    try {
      const result = await pool.query(query, [token]);
      return result.rows[0];
    } catch (err) {
      logger.error('Error finding session by token:', err);
      throw err;
    }
  }

  static async delete(token) {
    const query = 'DELETE FROM sessions WHERE token = $1 RETURNING *';
    try {
      const result = await pool.query(query, [token]);
      return result.rows[0];
    } catch (err) {
      logger.error('Error deleting session:', err);
      throw err;
    }
  }

  static async deleteExpired() {
    const query = 'DELETE FROM sessions WHERE expires_at < NOW() RETURNING *';
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (err) {
      logger.error('Error deleting expired sessions:', err);
      throw err;
    }
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM sessions WHERE user_id = $1 AND expires_at > NOW() ORDER BY created_at DESC';
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (err) {
      logger.error('Error finding sessions by user id:', err);
      throw err;
    }
  }
  
  static async deleteAllForUser(userId) {
    const query = 'DELETE FROM sessions WHERE user_id = $1 RETURNING *';
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (err) {
      logger.error('Error deleting sessions for user:', err);
      throw err;
    }
  }
  
  static async findById(id) {
    const query = 'SELECT * FROM sessions WHERE id = $1';
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (err) {
      logger.error('Error finding session by id:', err);
      throw err;
    }
  }
}

module.exports = Session;