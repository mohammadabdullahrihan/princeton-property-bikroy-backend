const express = require("express")
const { authenticate, authorize } = require("../middleware/auth")
const {
  getDashboardStats,
  getAllUsers,
  getAllListings,
  approveProperty,
  rejectProperty,
  toggleVerify,
} = require("../controllers/adminController")

const router = express.Router()

router.get("/stats", authenticate, authorize('admin'), getDashboardStats)
router.get("/users", authenticate, authorize('admin'), getAllUsers)
router.get("/listings", authenticate, authorize('admin'), getAllListings)
router.put("/listings/:id/approve", authenticate, authorize('admin'), approveProperty)
router.put("/listings/:id/reject", authenticate, authorize('admin'), rejectProperty)
router.put("/listings/:id/verify", authenticate, authorize('admin'), toggleVerify)

module.exports = router
