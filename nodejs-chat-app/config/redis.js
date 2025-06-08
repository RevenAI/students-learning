const { createClient } = require('redis');
const { REDIS } = require('./env');
const logger = require('../utils/logger');

let client;

const connectRedis = async () => {
  client = createClient({
    socket: {
      host: REDIS.HOST,
      port: REDIS.PORT,
    },
  });

  client.on('error', (err) => logger.error('Redis Client Error', err));
  client.on('connect', () => logger.info('Redis connected'));

  await client.connect();
  return client;
};

const getRedisClient = () => {
  if (!client) {
    throw new Error('Redis client not initialized');
  }
  return client;
};

module.exports = { connectRedis, getRedisClient };