const SavedSearch = require('../models/SavedSearch');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Get all saved searches for current user
 * @route   GET /api/saved-searches
 * @access  Private
 */
exports.getSavedSearches = asyncHandler(async (req, res) => {
  const { isActive, page = 1, limit = 20 } = req.query;
  
  const query = { userId: req.user._id };
  
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const savedSearches = await SavedSearch.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await SavedSearch.countDocuments(query);
  
  res.status(200).json({
    success: true,
    data: {
      savedSearches,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    },
    message: 'Saved searches retrieved successfully'
  });
});

/**
 * @desc    Get single saved search by ID
 * @route   GET /api/saved-searches/:id
 * @access  Private
 */
exports.getSavedSearchById = asyncHandler(async (req, res) => {
  const savedSearch = await SavedSearch.findById(req.params.id);
  
  if (!savedSearch) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Saved search not found'
    });
  }
  
  // Check ownership
  if (savedSearch.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      data: null,
      message: 'Not authorized to access this saved search'
    });
  }
  
  res.status(200).json({
    success: true,
    data: savedSearch,
    message: 'Saved search retrieved successfully'
  });
});

/**
 * @desc    Create a new saved search
 * @route   POST /api/saved-searches
 * @access  Private
 */
exports.createSavedSearch = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.userId = req.user._id;
  
  const savedSearch = await SavedSearch.create(req.body);
  
  // Get initial match count
  await savedSearch.getMatchingProperties();
  
  res.status(201).json({
    success: true,
    data: savedSearch,
    message: 'Saved search created successfully'
  });
});

/**
 * @desc    Update a saved search
 * @route   PUT /api/saved-searches/:id
 * @access  Private
 */
exports.updateSavedSearch = asyncHandler(async (req, res) => {
  let savedSearch = await SavedSearch.findById(req.params.id);
  
  if (!savedSearch) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Saved search not found'
    });
  }
  
  // Check ownership
  if (savedSearch.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      data: null,
      message: 'Not authorized to update this saved search'
    });
  }
  
  // Don't allow updating userId
  delete req.body.userId;
  
  savedSearch = await SavedSearch.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  // Update match count
  await savedSearch.getMatchingProperties();
  
  res.status(200).json({
    success: true,
    data: savedSearch,
    message: 'Saved search updated successfully'
  });
});

/**
 * @desc    Delete a saved search
 * @route   DELETE /api/saved-searches/:id
 * @access  Private
 */
exports.deleteSavedSearch = asyncHandler(async (req, res) => {
  const savedSearch = await SavedSearch.findById(req.params.id);
  
  if (!savedSearch) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Saved search not found'
    });
  }
  
  // Check ownership
  if (savedSearch.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      data: null,
      message: 'Not authorized to delete this saved search'
    });
  }
  
  await savedSearch.deleteOne();
  
  res.status(200).json({
    success: true,
    data: null,
    message: 'Saved search deleted successfully'
  });
});

/**
 * @desc    Get matching properties for a saved search
 * @route   GET /api/saved-searches/:id/matches
 * @access  Private
 */
exports.getMatchingProperties = asyncHandler(async (req, res) => {
  const savedSearch = await SavedSearch.findById(req.params.id);
  
  if (!savedSearch) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Saved search not found'
    });
  }
  
  // Check ownership
  if (savedSearch.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      data: null,
      message: 'Not authorized to access this saved search'
    });
  }
  
  const properties = await savedSearch.getMatchingProperties();
  
  res.status(200).json({
    success: true,
    data: {
      properties,
      matchCount: properties.length
    },
    message: 'Matching properties retrieved successfully'
  });
});

/**
 * @desc    Toggle saved search active status
 * @route   PUT /api/saved-searches/:id/toggle
 * @access  Private
 */
exports.toggleSavedSearch = asyncHandler(async (req, res) => {
  const savedSearch = await SavedSearch.findById(req.params.id);
  
  if (!savedSearch) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Saved search not found'
    });
  }
  
  // Check ownership
  if (savedSearch.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      data: null,
      message: 'Not authorized to update this saved search'
    });
  }
  
  savedSearch.isActive = !savedSearch.isActive;
  await savedSearch.save();
  
  res.status(200).json({
    success: true,
    data: savedSearch,
    message: `Saved search ${savedSearch.isActive ? 'activated' : 'deactivated'} successfully`
  });
});

module.exports = exports;
