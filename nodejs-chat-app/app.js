const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { NODE_ENV, RATE_LIMIT } = require('./config/env');
const logger = require('./utils/logger');
const { initializeDB, pool } = require('./config/db');
const { connectRedis } = require('./config/redis');

const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const userRoutes = require('./routes/user.routes');

const errorMiddleware = require('./middleware/error.middleware');
const { apiLimiter, authLimiter } = require('./middleware/rateLimit.middleware');

const app = express();

// Initialize database and Redis
(async () => {
  try {
    await initializeDB();
    await connectRedis();
    logger.info('Server dependencies initialized');
  } catch (err) {
    logger.error('Failed to initialize server dependencies:', err);
    process.exit(1);
  }
})();

// Rate limiting
const limiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX,
  message: 'Too many requests from this IP, please try again later',
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/user', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

module.exports = app;