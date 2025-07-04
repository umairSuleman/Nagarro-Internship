const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);
router.get('/verify', authenticateToken, AuthController.verifyToken);

module.exports = router;