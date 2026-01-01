const BuildingProduct = require("../models/BuildingProduct")

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body

    const product = new BuildingProduct({
      userId: req.user.id,
      name,
      description,
      price,
      category,
      images: [],
    })

    await product.save()
    res.status(201).json({ code: "CREATED", message: "পণ্য তৈরি সফল", product })
  } catch (err) {
    next(err)
  }
}

const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, sort = "-createdAt", page = 1, limit = 12 } = req.query
    const filter = {}

    if (category) filter.category = category
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number.parseInt(minPrice)
      if (maxPrice) filter.price.$lte = Number.parseInt(maxPrice)
    }

    if (search) {
      filter.$text = { $search: search }
    }

    const pageNum = Math.max(1, Number.parseInt(page))
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit)))
    const skip = (pageNum - 1) * limitNum

    const products = await BuildingProduct.find(filter)
      .populate("userId", "-password -verificationToken -passwordResetToken")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)

    const total = await BuildingProduct.countDocuments(filter)

    res.json({
      products,
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

const getProductById = async (req, res, next) => {
  try {
    const product = await BuildingProduct.findById(req.params.id).populate(
      "userId",
      "-password -verificationToken -passwordResetToken",
    )
    if (!product) {
      return res.status(404).json({ code: "NOT_FOUND", message: "পণ্য পাওয়া যায়নি" })
    }
    res.json(product)
  } catch (err) {
    next(err)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const product = await BuildingProduct.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ code: "NOT_FOUND", message: "পণ্য পাওয়া যায়নি" })
    }

    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ code: "FORBIDDEN", message: "অনুমতি নেই" })
    }

    Object.assign(product, req.body)
    await product.save()
    res.json({ code: "UPDATED", message: "পণ্য আপডেট সফল", product })
  } catch (err) {
    next(err)
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const product = await BuildingProduct.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ code: "NOT_FOUND", message: "পণ্য পাওয়া যায়নি" })
    }

    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ code: "FORBIDDEN", message: "অনুমতি নেই" })
    }

    await BuildingProduct.findByIdAndDelete(req.params.id)
    res.json({ code: "DELETED", message: "পণ্য মুছে ফেলা সফল" })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
}
