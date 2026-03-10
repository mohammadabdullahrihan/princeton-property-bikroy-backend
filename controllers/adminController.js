const User = require("../models/User");
const Property = require("../models/Property");
const BaseController = require("./BaseController");
const { asyncHandler } = require("../middleware/errorHandler");

class AdminController extends BaseController {
  constructor() {
    super(null); // Admin doesn't have a specific primary model for CRUD
  }

  /**
   * @desc    Get admin dashboard stats
   */
  getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const activeListings = await Property.countDocuments({ status: "active" });
    const pendingListings = await Property.countDocuments({
      status: "pending",
    });

    const listingsByCategory = await Property.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const recentListings = await Property.find()
      .sort("-createdAt")
      .limit(5)
      .select("title price status createdAt");

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
          recentListings,
        },
        timestamp: new Date(),
      },
    });
  });

  /**
   * @desc    Get all users
   */
  getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, role, search } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password -verificationToken -passwordResetToken")
      .skip(skip)
      .limit(limitNum)
      .sort("-createdAt");

    const total = await User.countDocuments(filter);

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
    });
  });

  /**
   * @desc    Get all listings
   */
  getAllListings = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status, category, search } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { "location.area": { $regex: search, $options: "i" } },
        { "location.district": { $regex: search, $options: "i" } },
      ];
    }

    const listings = await Property.find(filter)
      .populate("userId", "name email phone role")
      .skip(skip)
      .limit(limitNum)
      .sort("-createdAt");

    const total = await Property.countDocuments(filter);

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
    });
  });

  /**
   * @desc    Approve property
   */
  approveProperty = asyncHandler(async (req, res) => {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true },
    ).populate("userId", "name email");

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, data: property });
  });

  /**
   * @desc    Reject property
   */
  rejectProperty = asyncHandler(async (req, res) => {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true },
    ).populate("userId", "name email");

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, data: property });
  });

  /**
   * @desc    Toggle property verification status
   */
  toggleVerify = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    property.verified = !property.verified;
    await property.save();

    res.status(200).json({ success: true, data: property });
  });
}

module.exports = new AdminController();
