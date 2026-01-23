const Location = require('../models/Location');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Get all divisions
 * @route   GET /api/locations/divisions
 * @access  Public
 */
exports.getAllDivisions = asyncHandler(async (req, res) => {
  const divisions = await Location.getAllDivisions();
  
  res.status(200).json({
    success: true,
    data: divisions,
    message: 'Divisions retrieved successfully'
  });
});

/**
 * @desc    Get districts by division
 * @route   GET /api/locations/districts/:division
 * @access  Public
 */
exports.getDistrictsByDivision = asyncHandler(async (req, res) => {
  const { division } = req.params;
  
  const districts = await Location.getDistrictsByDivision(division);
  
  res.status(200).json({
    success: true,
    data: districts,
    message: 'Districts retrieved successfully'
  });
});

/**
 * @desc    Get areas by district
 * @route   GET /api/locations/areas/:division/:district
 * @access  Public
 */
exports.getAreasByDistrict = asyncHandler(async (req, res) => {
  const { division, district } = req.params;
  
  const areas = await Location.getAreasByDistrict(division, district);
  
  res.status(200).json({
    success: true,
    data: areas,
    message: 'Areas retrieved successfully'
  });
});

/**
 * @desc    Search areas by keyword
 * @route   GET /api/locations/search
 * @access  Public
 */
exports.searchAreas = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Search term must be at least 2 characters'
    });
  }
  
  const results = await Location.searchAreas(q);
  
  res.status(200).json({
    success: true,
    data: results,
    message: 'Search results retrieved successfully'
  });
});

/**
 * @desc    Get all locations (complete hierarchy)
 * @route   GET /api/locations
 * @access  Public
 */
exports.getAllLocations = asyncHandler(async (req, res) => {
  const locations = await Location.find().sort({ division: 1 });
  
  res.status(200).json({
    success: true,
    data: locations,
    message: 'All locations retrieved successfully'
  });
});

module.exports = exports;
