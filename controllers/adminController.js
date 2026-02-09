const User = require("../models/User")
const Property = require("../models/Property")
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments()
  const totalProperties = await Property.countDocuments()
  const activeListings = await Property.countDocuments({ status: "active" })
  const pendingListings = await Property.countDocuments({ status: "pending" })

  // Extended Analytics
  const listingsByCategory = await Property.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ])

  const usersByRole = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } }
  ])

  const recentListings = await Property.find()
    .sort("-createdAt")
    .limit(5)
    .select("title price status createdAt")

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalProperties,
      activeListings,
      pendingListings,
      analytics: {
        listingsByCategory,
        usersByRole,
        recentListings
      },
      timestamp: new Date(),
    },
    message: 'Stats retrieved successfully'
  });
});

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, role } = req.query
  const pageNum = Math.max(1, Number.parseInt(page) || 1)
  const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit) || 20))
  const skip = (pageNum - 1) * limitNum

  const filter = {}
  if (role) filter.role = role

  const users = await User.find(filter)
    .select("-password -verificationToken -passwordResetToken")
    .skip(skip)
    .limit(limitNum)
    .sort("-createdAt")

  const total = await User.countDocuments(filter)

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    },
    message: 'Users retrieved successfully'
  });
});

/**
 * @desc    Get all listings
 * @route   GET /api/admin/listings
 * @access  Private/Admin
 */
exports.getAllListings = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query
  const pageNum = Math.max(1, Number.parseInt(page) || 1)
  const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit) || 20))
  const skip = (pageNum - 1) * limitNum

  const filter = {}
  if (status) filter.status = status

  const listings = await Property.find(filter)
    .populate("userId", "-password -verificationToken -passwordResetToken")
    .skip(skip)
    .limit(limitNum)
    .sort("-createdAt")

  const total = await Property.countDocuments(filter)

  res.status(200).json({
    success: true,
    data: {
      listings,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    },
    message: 'Listings retrieved successfully'
  });
});

/**
 * @desc    Approve property
 * @route   PUT /api/admin/listings/:id/approve
 * @access  Private/Admin
 */
exports.approveProperty = asyncHandler(async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true }).populate(
    "userId",
    "-password -verificationToken -passwordResetToken",
  )

  if (!property) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "সম্পত্তি পাওয়া যায়নি"
    })
  }

  res.status(200).json({
    success: true,
    data: property,
    message: "অনুমোদিত"
  });
});

/**
 * @desc    Reject property
 * @route   PUT /api/admin/listings/:id/reject
 * @access  Private/Admin
 */
exports.rejectProperty = asyncHandler(async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true }).populate(
    "userId",
    "-password -verificationToken -passwordResetToken",
  )

  if (!property) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "সম্পত্তি পাওয়া যায়নি"
    })
  }

  res.status(200).json({
    success: true,
    data: property,
    message: "প্রত্যাখ্যাত"
  });
});

/**
 * @desc    Toggle property verification status
 * @route   PUT /api/admin/listings/:id/verify
 * @access  Private/Admin
 */
exports.toggleVerify = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "সম্পত্তি পাওয়া যায়নি"
    });
  }

  property.verified = !property.verified;
  await property.save();

  res.status(200).json({
    success: true,
    data: property,
    message: property.verified ? "Verified successfully" : "Unverified successfully"
  });
});

module.exports = exports;

