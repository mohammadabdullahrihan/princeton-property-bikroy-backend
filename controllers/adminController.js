const User = require("../models/User")
const Property = require("../models/Property")

const getDashboardStats = async (req, res, next) => {
  try {
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

    res.json({
      code: "STATS_RETRIEVED",
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
    })
  } catch (err) {
    next(err)
  }
}

const getAllUsers = async (req, res, next) => {
  try {
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

    res.json({
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (err) {
    next(err)
  }
}

const getAllListings = async (req, res, next) => {
  try {
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

    res.json({
      listings,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (err) {
    next(err)
  }
}

const approveProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true }).populate(
      "userId",
      "-password -verificationToken -passwordResetToken",
    )

    if (!property) {
      return res.status(404).json({ code: "NOT_FOUND", message: "সম্পত্তি পাওয়া যায়নি" })
    }

    res.json({ code: "APPROVED", message: "অনুমোদিত", property })
  } catch (err) {
    next(err)
  }
}

const rejectProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { status: "inactive" }, { new: true }).populate(
      "userId",
      "-password -verificationToken -passwordResetToken",
    )

    if (!property) {
      return res.status(404).json({ code: "NOT_FOUND", message: "সম্পত্তি পাওয়া যায়নি" })
    }

    res.json({ code: "REJECTED", message: "প্রত্যাখ্যাত", property })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllListings,
  approveProperty,
  rejectProperty,
}
