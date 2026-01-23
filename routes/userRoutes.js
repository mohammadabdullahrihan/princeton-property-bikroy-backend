const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  getDashboard,
  getMyProperties,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const {
  validateUserUpdate,
  validateMongoId,
  validatePagination
} = require('../middleware/validator');

// Protected routes (authenticated users)
router.get('/profile/:id', validateMongoId('id'), getUserProfile);
router.put('/profile', authenticate, validateUserUpdate, updateProfile);
router.get('/dashboard', authenticate, getDashboard);
router.get('/my-properties', authenticate, validatePagination, getMyProperties);

// Admin only routes
router.get('/', authenticate, authorize('admin'), validatePagination, getAllUsers);
router.put('/:id', authenticate, authorize('admin'), validateMongoId('id'), updateUser);
router.delete('/:id', authenticate, authorize('admin'), validateMongoId('id'), deleteUser);

module.exports = router;
