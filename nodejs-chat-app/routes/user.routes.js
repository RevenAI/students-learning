const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validators = require('../utils/validators');

router.get('/profile', authMiddleware.authenticate, userController.getProfile);
router.put('/profile', authMiddleware.authenticate, validators.validateRegister, userController.updateProfile);
router.put('/password', authMiddleware.authenticate, userController.changePassword);
router.get('/sessions', authMiddleware.authenticate, userController.getActiveSessions);
router.delete('/sessions/:sessionId', authMiddleware.authenticate, userController.revokeSession);

module.exports = router;