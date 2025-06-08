const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class User {
  static async create({ username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, is_verified, created_at
    `;
    const values = [username, email, hashedPassword];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      logger.error('Error creating user:', err);
      throw err;
    }
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (err) {
      logger.error('Error finding user by email:', err);
      throw err;
    }
  }

  static async findById(id) {
    const query = 'SELECT id, username, email, is_verified FROM users WHERE id = $1';
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (err) {
      logger.error('Error finding user by id:', err);
      throw err;
    }
  }

  static async verifyEmail(userId) {
    const query = 'UPDATE users SET is_verified = TRUE WHERE id = $1 RETURNING *';
    try {
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (err) {
      logger.error('Error verifying email:', err);
      throw err;
    }
  }

  static async findByIdWithPassword(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (err) {
      logger.error('Error finding user by id with password:', err);
      throw err;
    }
  }
  
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    try {
      const result = await pool.query(query, [username]);
      return result.rows[0];
    } catch (err) {
      logger.error('Error finding user by username:', err);
      throw err;
    }
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;