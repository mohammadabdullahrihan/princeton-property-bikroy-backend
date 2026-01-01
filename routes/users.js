const express = require("express")
const { authMiddleware } = require("../middleware/auth")
const User = require("../models/User")

const router = express.Router()

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    res.json(user)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ message: "আপডেট সফল", user })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
