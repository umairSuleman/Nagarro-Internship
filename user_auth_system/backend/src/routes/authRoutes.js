const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateToken, optionalAuth, requireGuest } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes(require guest - user should not be authenticated)
router.post('/register', optionalAuth, requireGuest, AuthController.register);
router.post('/login', optionalAuth, requireGuest, AuthController.login);

//Public logout route
router.post('/logout', AuthController.logout);

// Protected routes (requireauthentication)
router.get('/profile', authenticateToken, AuthController.getProfile);
router.get('/verify', authenticateToken, AuthController.verifyToken);
router.get('/refresh', authenticateToken, AuthController.refreshToken);

module.exports = router;