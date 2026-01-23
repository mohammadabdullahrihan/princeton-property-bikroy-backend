const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  verifyProperty,
  featureProperty,
  updatePropertyStatus,
  getFeaturedProperties,
  getSimilarProperties
} = require('../controllers/propertyController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const {
  validatePropertyCreate,
  validatePropertyUpdate,
  validateMongoId,
  validatePagination
} = require('../middleware/validator');

// Public routes
router.get('/', validatePagination, getAllProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:id', validateMongoId('id'), optionalAuth, getPropertyById);
router.get('/:id/similar', validateMongoId('id'), getSimilarProperties);

// Protected routes (admin only)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validatePropertyCreate,
  createProperty
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateMongoId('id'),
  validatePropertyUpdate,
  updateProperty
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateMongoId('id'),
  deleteProperty
);

router.put(
  '/:id/status',
  authenticate,
  authorize('admin'),
  validateMongoId('id'),
  updatePropertyStatus
);

// Admin only routes
router.put(
  '/:id/verify',
  authenticate,
  authorize('admin'),
  validateMongoId('id'),
  verifyProperty
);

router.put(
  '/:id/feature',
  authenticate,
  authorize('admin'),
  validateMongoId('id'),
  featureProperty
);

module.exports = router;
