const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validators = require('../utils/validators');

router.post('/register', validators.validateRegister, authController.register);
router.post('/login', validators.validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/verify-email/:token', authController.verifyEmail);

module.exports = router;