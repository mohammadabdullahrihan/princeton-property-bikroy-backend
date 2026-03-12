const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
  sendContactMessage,
  getContactMessages,
  markAsRead,
  deleteMessage,
} = require("../controllers/contactMessageController");

const router = express.Router();

// Public route to send a message
router.post("/", sendContactMessage);

// Admin/Superadmin routes
router.get("/", authenticate, authorize("admin", "superadmin"), getContactMessages);
router.put("/:id/read", authenticate, authorize("admin", "superadmin"), markAsRead);
router.delete("//:id", authenticate, authorize("admin", "superadmin"), deleteMessage);

module.exports = router;
