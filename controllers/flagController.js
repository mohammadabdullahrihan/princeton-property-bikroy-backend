const PropertyFlag = require('../models/PropertyFlag');
const Property = require('../models/Property');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Flag a property
 * @route   POST /api/flags/property/:propertyId
 * @access  Private
 */
exports.flagProperty = asyncHandler(async (req, res) => {
  const { reason, description } = req.body;
  const { propertyId } = req.params;
  
  // Check if property exists
  const property = await Property.findById(propertyId);
  
  if (!property) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Property not found'
    });
  }
  
  // Check if user already flagged this property
  const existingFlag = await PropertyFlag.findOne({
    userId: req.user._id,
    propertyId
  });
  
  if (existingFlag) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'You have already flagged this property'
    });
  }
  
  // Create flag
  const flag = await PropertyFlag.create({
    userId: req.user._id,
    propertyId,
    reason,
    description
  });
  
  res.status(201).json({
    success: true,
    data: flag,
    message: 'Property flagged successfully. Our team will review it.'
  });
});

/**
 * @desc    Get all flags (Admin only)
 * @route   GET /api/flags
 * @access  Private/Admin
 */
exports.getAllFlags = asyncHandler(async (req, res) => {
  const { status, reason, page = 1, limit = 20 } = req.query;
  
  const query = {};
  
  if (status) {
    query.status = status;
  }
  
  if (reason) {
    query.reason = reason;
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const flags = await PropertyFlag.find(query)
    .populate('userId', 'name email')
    .populate('propertyId', 'title category price status')
    .populate('reviewedBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await PropertyFlag.countDocuments(query);
  
  // Get statistics
  const stats = {
    total: await PropertyFlag.countDocuments(),
    pending: await PropertyFlag.countDocuments({ status: 'pending' }),
    reviewed: await PropertyFlag.countDocuments({ status: 'reviewed' }),
    resolved: await PropertyFlag.countDocuments({ status: 'resolved' }),
    dismissed: await PropertyFlag.countDocuments({ status: 'dismissed' })
  };
  
  res.status(200).json({
    success: true,
    data: {
      flags,
      statistics: stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    },
    message: 'Flags retrieved successfully'
  });
});

/**
 * @desc    Get flags for a specific property
 * @route   GET /api/flags/property/:propertyId
 * @access  Private/Admin
 */
exports.getPropertyFlags = asyncHandler(async (req, res) => {
  const flags = await PropertyFlag.find({ propertyId: req.params.propertyId })
    .populate('userId', 'name email')
    .populate('reviewedBy', 'name')
    .sort({ createdAt: -1 });
  
  const stats = await PropertyFlag.getPropertyFlagStats(req.params.propertyId);
  
  res.status(200).json({
    success: true,
    data: {
      flags,
      statistics: stats
    },
    message: 'Property flags retrieved successfully'
  });
});

/**
 * @desc    Get user's flags
 * @route   GET /api/flags/my-flags
 * @access  Private
 */
exports.getMyFlags = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const flags = await PropertyFlag.find({ userId: req.user._id })
    .populate('propertyId', 'title category price status images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await PropertyFlag.countDocuments({ userId: req.user._id });
  
  res.status(200).json({
    success: true,
    data: {
      flags,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    },
    message: 'Your flags retrieved successfully'
  });
});

/**
 * @desc    Review a flag (Admin only)
 * @route   PUT /api/flags/:id/review
 * @access  Private/Admin
 */
exports.reviewFlag = asyncHandler(async (req, res) => {
  const { status, reviewNotes, actionTaken } = req.body;
  
  if (!['reviewed', 'resolved', 'dismissed'].includes(status)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Invalid status value'
    });
  }
  
  const flag = await PropertyFlag.findById(req.params.id);
  
  if (!flag) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Flag not found'
    });
  }
  
  flag.status = status;
  flag.reviewedBy = req.user._id;
  flag.reviewedAt = Date.now();
  
  if (reviewNotes) {
    flag.reviewNotes = reviewNotes;
  }
  
  if (actionTaken) {
    flag.actionTaken = actionTaken;
    
    // Take action on property if needed
    if (actionTaken === 'property_removed') {
      await Property.findByIdAndUpdate(flag.propertyId, { status: 'inactive' });
    }
  }
  
  await flag.save();
  
  res.status(200).json({
    success: true,
    data: flag,
    message: 'Flag reviewed successfully'
  });
});

/**
 * @desc    Delete a flag
 * @route   DELETE /api/flags/:id
 * @access  Private (Owner/Admin)
 */
exports.deleteFlag = asyncHandler(async (req, res) => {
  const flag = await PropertyFlag.findById(req.params.id);
  
  if (!flag) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Flag not found'
    });
  }
  
  // Check ownership (unless admin)
  if (flag.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      data: null,
      message: 'Not authorized to delete this flag'
    });
  }
  
  await flag.deleteOne();
  
  res.status(200).json({
    success: true,
    data: null,
    message: 'Flag deleted successfully'
  });
});

module.exports = exports;
