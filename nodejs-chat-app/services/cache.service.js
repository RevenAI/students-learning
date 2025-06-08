const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');

class CacheService {
  static async set(key, value, ttl = 3600) {
    const client = getRedisClient();
    try {
      await client.set(key, JSON.stringify(value), {
        EX: ttl,
      });
    } catch (err) {
      logger.error('Cache set error:', err);
    }
  }

  static async get(key) {
    const client = getRedisClient();
    try {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      logger.error('Cache get error:', err);
      return null;
    }
  }

  static async del(key) {
    const client = getRedisClient();
    try {
      await client.del(key);
    } catch (err) {
      logger.error('Cache del error:', err);
    }
  }

  static async getMessages() {
    return this.get('recent_messages');
  }

  static async cacheMessages(messages) {
    await this.set('recent_messages', messages, 60 * 5); // 5 minutes
  }
}

module.exports = CacheService;