const Property = require("../models/Property")
const { sendPropertyStatusEmail } = require("../utils/emailService")

const createProperty = async (req, res, next) => {
  try {
    const { title, description, category, type, location, price, bedrooms, size } = req.body

    let images = []
    if (req.files) {
      images = req.files.map((file) => `/uploads/${file.filename}`)
    }

    const property = new Property({
      userId: req.user.id,
      title,
      description,
      category,
      type,
      location: typeof location === "string" ? JSON.parse(location) : location,
      price,
      bedrooms,
      size,
      images,
      status: "pending",
    })

    await property.save()
    res.status(201).json({ code: "PROPERTY_CREATED", message: "সম্পত্তি তৈরি সফল", property })
  } catch (err) {
    next(err)
  }
}

const getProperties = async (req, res, next) => {
  try {
    const {
      category,
      type,
      district,
      minPrice,
      maxPrice,
      bedrooms,
      search,
      sort = "-createdAt",
      page,
      limit,
    } = req.query
    const filter = { status: "active" }

    if (category) filter.category = category
    if (type) filter.type = type
    if (district) filter["location.district"] = district
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number.parseInt(minPrice)
      if (maxPrice) filter.price.$lte = Number.parseInt(maxPrice)
    }
    if (bedrooms) filter.bedrooms = Number.parseInt(bedrooms)

    if (search) {
      filter.$text = { $search: search }
    }

    const pageNum = Math.max(1, Number.parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit) || 12))
    const skip = (pageNum - 1) * limitNum

    const properties = await Property.find(filter)
      .populate("userId", "-password -verificationToken -passwordResetToken")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)

    const total = await Property.countDocuments(filter)

    res.json({
      properties,
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

const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate(
      "userId",
      "-password -verificationToken -passwordResetToken",
    )

    if (!property) {
      return res.status(404).json({ code: "NOT_FOUND", message: "সম্পত্তি পাওয়া যায়নি" })
    }
    res.json(property)
  } catch (err) {
    next(err)
  }
}

const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
    if (!property) {
      return res.status(404).json({ code: "NOT_FOUND", message: "সম্পত্তি পাওয়া যায়নি" })
    }

    if (property.userId.toString() !== req.user.id) {
      return res.status(403).json({ code: "FORBIDDEN", message: "অনুমতি নেই" })
    }

    Object.assign(property, req.body)
    property.updatedAt = Date.now()

    if (req.files) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`)
      property.images = [...(property.images || []), ...newImages]
    }

    await property.save()
    res.json({ code: "UPDATED", message: "সম্পত্তি আপডেট সফল", property })
  } catch (err) {
    next(err)
  }
}

const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
    if (!property) {
      return res.status(404).json({ code: "NOT_FOUND", message: "সম্পত্তি পাওয়া যায়নি" })
    }

    if (property.userId.toString() !== req.user.id) {
      return res.status(403).json({ code: "FORBIDDEN", message: "অনুমতি নেই" })
    }

    await Property.findByIdAndDelete(req.params.id)
    res.json({ code: "DELETED", message: "সম্পত্তি মুছে ফেলা সফল" })
  } catch (err) {
    next(err)
  }
}

const getUserProperties = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const pageNum = Math.max(1, Number.parseInt(page))
    const limitNum = Math.min(50, Math.max(1, Number.parseInt(limit)))
    const skip = (pageNum - 1) * limitNum

    const properties = await Property.find({ userId: req.user.id }).sort("-createdAt").skip(skip).limit(limitNum)

    const total = await Property.countDocuments({ userId: req.user.id })

    res.json({
      properties,
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

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getUserProperties,
}
