const express = require("express")
const { authMiddleware } = require("../middleware/auth")
const SavedListing = require("../models/SavedListing")

const router = express.Router()

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { propertyId } = req.body
    const saved = new SavedListing({
      userId: req.user.id,
      propertyId,
    })
    await saved.save()
    res.status(201).json({ message: "সংরক্ষিত", saved })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.get("/", authMiddleware, async (req, res) => {
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

    res.json({
      saved,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await SavedListing.findByIdAndDelete(req.params.id)
    res.json({ message: "মুছে ফেলা হয়েছে" })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
