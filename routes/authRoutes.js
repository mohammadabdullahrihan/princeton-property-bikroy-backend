const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getMe,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const {
  validateUserSignup,
  validateUserLogin
} = require('../middleware/validator');

// Public routes
router.post('/signup', validateUserSignup, signup);
router.post('/login', validateUserLogin, login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);
router.put('/update-password', authenticate, updatePassword);

module.exports = router;
