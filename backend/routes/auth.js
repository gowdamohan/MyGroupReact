const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', authController.register);

// Extended registration (two-step)
router.get('/unique-mobile', authController.uniqueMobile);
router.get('/unique-email', authController.uniqueEmail);
router.get('/register-metadata', authController.registerMetadata);
router.post('/register-step1', authController.registerStep1);
router.post('/register-step2', authController.registerStep2);

// Login user
router.post('/login', authController.login);

// Get current user
router.get('/me', authMiddleware, authController.getMe);

// Logout user
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;