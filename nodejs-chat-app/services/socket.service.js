const logger = require('../utils/logger');
const Message = require('../models/message.model');

class SocketService {
  constructor(io) {
    this.io = io;
    this.initialize();
  }

  initialize() {
    this.io.on('connection', (socket) => {
      logger.info(`New socket connection: ${socket.id}`);

      // Join room for private messaging
      socket.on('join-room', (room) => {
        socket.join(room);
        logger.info(`Socket ${socket.id} joined room ${room}`);
      });

      // Leave room
      socket.on('leave-room', (room) => {
        socket.leave(room);
        logger.info(`Socket ${socket.id} left room ${room}`);
      });

      // Handle new messages
      socket.on('send-message', async (data) => {
        try {
          const message = await Message.create({
            userId: data.userId,
            content: data.content,
          });

          const fullMessage = {
            id: message.id,
            content: message.content,
            created_at: message.created_at,
            user_id: data.userId,
            username: data.username,
          };

          if (data.room) {
            this.io.to(data.room).emit('receive-message', fullMessage);
          } else {
            this.io.emit('receive-message', fullMessage);
          }
        } catch (err) {
          logger.error('Error handling send-message:', err);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  emitToRoom(room, event, data) {
    this.io.to(room).emit(event, data);
  }

  emitToAll(event, data) {
    this.io.emit(event, data);
  }
}

module.exports = SocketService;