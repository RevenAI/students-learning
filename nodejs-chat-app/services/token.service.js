const jwt = require('jsonwebtoken');
const { JWT } = require('../config/env');
const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');

class TokenService {
  static generateTokens(payload) {
    const accessToken = jwt.sign(payload, JWT.SECRET, {
      expiresIn: JWT.ACCESS_EXPIRY,
    });
    const refreshToken = jwt.sign(payload, JWT.SECRET, {
      expiresIn: JWT.REFRESH_EXPIRY,
    });
    return { accessToken, refreshToken };
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT.SECRET);
    } catch (err) {
      logger.error('Token verification failed:', err);
      return null;
    }
  }

  static async storeRefreshToken(userId, refreshToken) {
    const client = getRedisClient();
    await client.set(`refresh:${userId}`, refreshToken, {
      EX: 60 * 60 * 24 * 7, // 7 days
    });
  }

  static async getRefreshToken(userId) {
    const client = getRedisClient();
    return await client.get(`refresh:${userId}`);
  }

  static async removeRefreshToken(userId) {
    const client = getRedisClient();
    await client.del(`refresh:${userId}`);
  }

  static async verifyRefreshToken(userId, refreshToken) {
    const storedToken = await this.getRefreshToken(userId);
    return storedToken === refreshToken;
  }
}

module.exports = TokenService;