const express = require("express")
const { authMiddleware, adminMiddleware } = require("../middleware/auth")
const {
  getDashboardStats,
  getAllUsers,
  getAllListings,
  approveProperty,
  rejectProperty,
} = require("../controllers/adminController")

const router = express.Router()

router.get("/stats", authMiddleware, adminMiddleware, getDashboardStats)
router.get("/users", authMiddleware, adminMiddleware, getAllUsers)
router.get("/listings", authMiddleware, adminMiddleware, getAllListings)
router.put("/listings/:id/approve", authMiddleware, adminMiddleware, approveProperty)
router.put("/listings/:id/reject", authMiddleware, adminMiddleware, rejectProperty)

module.exports = router
