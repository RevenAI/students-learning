const { pool } = require('../config/db');
const logger = require('../utils/logger');

class Message {
  static async create({ userId, content }) {
    const query = `
      INSERT INTO messages (user_id, content)
      VALUES ($1, $2)
      RETURNING *
    `;
    try {
      const result = await pool.query(query, [userId, content]);
      return result.rows[0];
    } catch (err) {
      logger.error('Error creating message:', err);
      throw err;
    }
  }

  static async getRecentMessages(limit = 50) {
    const query = `
      SELECT m.id, m.content, m.created_at, u.id as user_id, u.username
      FROM messages m
      JOIN users u ON m.user_id = u.id
      ORDER BY m.created_at DESC
      LIMIT $1
    `;
    try {
      const result = await pool.query(query, [limit]);
      return result.rows.reverse(); // Return oldest first
    } catch (err) {
      logger.error('Error getting messages:', err);
      throw err;
    }
  }

  static async getMessagesAfterId(messageId, limit = 20) {
    const query = `
      SELECT m.id, m.content, m.created_at, u.id as user_id, u.username
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.id > $1
      ORDER BY m.created_at ASC
      LIMIT $2
    `;
    try {
      const result = await pool.query(query, [messageId, limit]);
      return result.rows;
    } catch (err) {
      logger.error('Error getting messages after ID:', err);
      throw err;
    }
  }
}

module.exports = Message;