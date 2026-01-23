const User = require('../models/User');
const Property = require('../models/Property');

const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile/:id
 * @access  Public
 */
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'User not found'
    });
  }
  
  // Get user's properties count
  const propertiesCount = await Property.countDocuments({ 
    userId: user._id,
    status: { $in: ['active', 'pending'] }
  });
  
  res.status(200).json({
    success: true,
    data: {
      ...user.toObject(),
      propertiesCount
    },
    message: 'User profile retrieved successfully'
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  
  const updateData = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (avatar) updateData.avatar = avatar;
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');
  
  res.status(200).json({
    success: true,
    data: user,
    message: 'Profile updated successfully'
  });
});

/**
 * @desc    Get user dashboard analytics
 * @route   GET /api/users/dashboard
 * @access  Private
 */
exports.getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  // Get properties statistics
  const totalProperties = await Property.countDocuments({ userId });
  const activeProperties = await Property.countDocuments({ userId, status: 'active' });
  const pendingProperties = await Property.countDocuments({ userId, status: 'pending' });
  const soldRentedProperties = await Property.countDocuments({ 
    userId, 
    status: { $in: ['sold', 'rented'] }
  });
  
  // Get total views
  const properties = await Property.find({ userId });
  const totalViews = properties.reduce((sum, prop) => sum + prop.views, 0);
  
  // Get recent properties
  const recentProperties = await Property.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title price category status views createdAt images');
  

  
  res.status(200).json({
    success: true,
    data: {
      statistics: {
        totalProperties,
        activeProperties,
        pendingProperties,
        soldRentedProperties,
        totalViews,

      },
      recentProperties,

    },
    message: 'Dashboard data retrieved successfully'
  });
});

/**
 * @desc    Get user's properties
 * @route   GET /api/users/my-properties
 * @access  Private
 */
exports.getMyProperties = asyncHandler(async (req, res) => {
  const { status, category, page = 1, limit = 10 } = req.query;
  
  const query = { userId: req.user._id };
  
  if (status) {
    query.status = status;
  }
  
  if (category) {
    query.category = category;
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const properties = await Property.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Property.countDocuments(query);
  
  res.status(200).json({
    success: true,
    data: {
      properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    },
    message: 'Properties retrieved successfully'
  });
});

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { role, verified, page = 1, limit = 20, search } = req.query;
  
  const query = {};
  
  if (role) {
    query.role = role;
  }
  
  if (verified !== undefined) {
    query.verified = verified === 'true';
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await User.countDocuments(query);
  
  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    },
    message: 'Users retrieved successfully'
  });
});

/**
 * @desc    Update user (Admin only)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res) => {
  const { role, verified, isActive } = req.body;
  
  const updateData = {};
  if (role) updateData.role = role;
  if (verified !== undefined) updateData.verified = verified;
  if (isActive !== undefined) updateData.isActive = isActive;
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'User not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: user,
    message: 'User updated successfully'
  });
});

/**
 * @desc    Delete user (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'User not found'
    });
  }
  
  // Delete user's properties
  await Property.deleteMany({ userId: user._id });
  

  
  // Delete user
  await user.deleteOne();
  
  res.status(200).json({
    success: true,
    data: null,
    message: 'User and associated data deleted successfully'
  });
});

module.exports = exports;
