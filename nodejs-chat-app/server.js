const http = require('http');
const socketio = require('socket.io');
const { PORT, SOCKET } = require('./config/env');
const app = require('./app');
const SocketService = require('./services/socket.service');
const authMiddleware = require('./middleware/auth.middleware');
const logger = require('./utils/logger');

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.io
const io = socketio(server, {
  cors: {
    origin: SOCKET.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

// Initialize Socket Service
const socketService = new SocketService(io);
app.set('socketService', socketService);

// Socket.io authentication
io.use(authMiddleware.socketAuthenticate);

// Start server
server.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});