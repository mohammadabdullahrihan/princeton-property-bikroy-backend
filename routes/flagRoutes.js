const express = require('express');
const router = express.Router();
const {
  flagProperty,
  getAllFlags,
  getPropertyFlags,
  getMyFlags,
  reviewFlag,
  deleteFlag
} = require('../controllers/flagController');
const { authenticate, authorize } = require('../middleware/auth');
const {
  validatePropertyFlag,
  validateMongoId,
  validatePagination
} = require('../middleware/validator');

// Protected routes (authenticated users)
router.post(
  '/property/:propertyId',
  authenticate,
  validateMongoId('propertyId'),
  validatePropertyFlag,
  flagProperty
);

router.get('/my-flags', authenticate, validatePagination, getMyFlags);

router.delete(
  '/:id',
  authenticate,
  validateMongoId('id'),
  deleteFlag
);

// Admin only routes
router.get(
  '/',
  authenticate,
  authorize('admin'),
  validatePagination,
  getAllFlags
);

router.get(
  '/property/:propertyId',
  authenticate,
  authorize('admin'),
  validateMongoId('propertyId'),
  getPropertyFlags
);

router.put(
  '/:id/review',
  authenticate,
  authorize('admin'),
  validateMongoId('id'),
  reviewFlag
);

module.exports = router;
