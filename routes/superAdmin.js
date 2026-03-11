const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getSuperAdminStats,
  // Users
  getAllUsers, updateUserRole, toggleUserActive, deleteUser,
  // Listings
  getAllListings, approveProperty, rejectProperty, toggleVerified, toggleFeatured, deleteProperty,
  // Locations
  getAllLocationsAdmin, addArea, addDistrict, deleteArea,
  // Services
  getAllServices, createService, updateService, deleteService
} = require('../controllers/superAdminController');

const router = express.Router();

// All routes require authentication + superadmin role
const sa = [authenticate, authorize('superadmin')];

router.get('/stats', ...sa, getSuperAdminStats);

// Users
router.get('/users', ...sa, getAllUsers);
router.put('/users/:id/role', ...sa, updateUserRole);
router.put('/users/:id/toggle-active', ...sa, toggleUserActive);
router.delete('/users/:id', ...sa, deleteUser);

// Listings / Properties
router.get('/listings', ...sa, getAllListings);
router.put('/listings/:id/approve', ...sa, approveProperty);
router.put('/listings/:id/reject', ...sa, rejectProperty);
router.put('/listings/:id/verify', ...sa, toggleVerified);
router.put('/listings/:id/featured', ...sa, toggleFeatured);
router.delete('/listings/:id', ...sa, deleteProperty);

// Locations
router.get('/locations', ...sa, getAllLocationsAdmin);
router.post('/locations/area', ...sa, addArea);
router.post('/locations/district', ...sa, addDistrict);
router.delete('/locations/area', ...sa, deleteArea);

// Services
router.get('/services', ...sa, getAllServices);
router.post('/services', ...sa, createService);
router.put('/services/:id', ...sa, updateService);
router.delete('/services/:id', ...sa, deleteService);

module.exports = router;
