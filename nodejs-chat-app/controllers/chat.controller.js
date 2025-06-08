const Message = require('../models/message.model');
const CacheService = require('../services/cache.service');
const logger = require('../utils/logger');

const chatController = {
  getMessages: async (req, res, next) => {
    try {
      // Try to get messages from cache first
      let messages = await CacheService.getMessages();
      
      if (!messages) {
        // If not in cache, get from database
        messages = await Message.getRecentMessages();
        
        // Cache the messages
        await CacheService.cacheMessages(messages);
      }

      res.json(messages);
    } catch (err) {
      next(err);
    }
  },

  getNewMessages: async (req, res, next) => {
    try {
      const { lastMessageId } = req.params;
      const messages = await Message.getMessagesAfterId(lastMessageId);
      res.json(messages);
    } catch (err) {
      next(err);
    }
  },

  sendMessage: async (req, res, next) => {
    try {
      const { content } = req.body;
      const { userId } = req.user;

      if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({ error: 'Message content is required' });
      }

      // Create message
      const message = await Message.create({
        userId,
        content: content.trim(),
      });

      // Invalidate messages cache
      await CacheService.del('recent_messages');

      // Get user details
      const user = await User.findById(userId);

      // Prepare response
      const response = {
        id: message.id,
        content: message.content,
        created_at: message.created_at,
        user_id: userId,
        username: user.username,
      };

      // Emit to WebSocket clients
      req.app.get('socketService').emitToAll('new-message', response);

      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = chatController;