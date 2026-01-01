const express = require("express")
const Location = require("../models/Location")

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const locations = await Location.find()
    res.json(locations)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
