const express = require("express")
const { authenticate } = require("../middleware/auth")
const SavedListing = require("../models/SavedListing")

const router = express.Router()

router.post("/", authenticate, async (req, res) => {
  try {
    const { propertyId } = req.body
    const saved = new SavedListing({
      userId: req.user.id,
      propertyId,
    })
    await saved.save()
    res.status(201).json({
      success: true,
      data: saved,
      message: "সংরক্ষিত"
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    })
  }
})

router.get("/", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query
    const pageNum = Math.max(1, Number.parseInt(page))
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit)))
    const skip = (pageNum - 1) * limitNum

    const saved = await SavedListing.find({ userId: req.user.id })
      .populate("propertyId")
      .sort("-createdAt")
      .skip(skip)
      .limit(limitNum)

    const total = await SavedListing.countDocuments({ userId: req.user.id })

    res.status(200).json({
      success: true,
      data: {
        saved,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
      message: 'Saved listings retrieved'
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    })
  }
})

router.delete("/:id", authenticate, async (req, res) => {
  try {
    await SavedListing.findByIdAndDelete(req.params.id)
    res.status(200).json({
      success: true,
      message: "মুছে ফেলা হয়েছে"
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    })
  }
})

module.exports = router
