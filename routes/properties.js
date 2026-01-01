const express = require("express")
const upload = require("../config/multer")
const { authMiddleware } = require("../middleware/auth")
const { validateProperty } = require("../middleware/validation")
const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getUserProperties,
} = require("../controllers/propertyController")

const router = express.Router()

router.get("/", getProperties)
router.get("/my-properties", authMiddleware, getUserProperties)
router.post("/", authMiddleware, upload.array("images", 10), validateProperty, createProperty)
router.get("/:id", getPropertyById)
router.put("/:id", authMiddleware, upload.array("images", 10), updateProperty)
router.delete("/:id", authMiddleware, deleteProperty)

module.exports = router
