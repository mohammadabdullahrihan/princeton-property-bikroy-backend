const express = require('express');
const router = express.Router();
const {
  getAllDivisions,
  getDistrictsByDivision,
  getAreasByDistrict,
  searchAreas,
  getAllLocations
} = require('../controllers/locationController');

// All routes are public
router.get('/', getAllLocations);
router.get('/divisions', getAllDivisions);
router.get('/districts/:division', getDistrictsByDivision);
router.get('/areas/:division/:district', getAreasByDistrict);
router.get('/search', searchAreas);

module.exports = router;
