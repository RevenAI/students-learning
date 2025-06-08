const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware.authenticate, chatController.getMessages);
router.get('/new/:lastMessageId', authMiddleware.authenticate, chatController.getNewMessages);
router.post('/', authMiddleware.authenticate, chatController.sendMessage);

module.exports = router;