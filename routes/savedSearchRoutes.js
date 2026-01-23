const express = require('express');
const router = express.Router();
const {
  getSavedSearches,
  getSavedSearchById,
  createSavedSearch,
  updateSavedSearch,
  deleteSavedSearch,
  getMatchingProperties,
  toggleSavedSearch
} = require('../controllers/savedSearchController');
const { authenticate } = require('../middleware/auth');
const {
  validateSavedSearchCreate,
  validateMongoId,
  validatePagination
} = require('../middleware/validator');

// All routes are protected
router.use(authenticate);

router.get('/', validatePagination, getSavedSearches);
router.get('/:id', validateMongoId('id'), getSavedSearchById);
router.post('/', validateSavedSearchCreate, createSavedSearch);
router.put('/:id', validateMongoId('id'), updateSavedSearch);
router.delete('/:id', validateMongoId('id'), deleteSavedSearch);
router.get('/:id/matches', validateMongoId('id'), getMatchingProperties);
router.put('/:id/toggle', validateMongoId('id'), toggleSavedSearch);

module.exports = router;
