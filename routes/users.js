const express = require("express");
const { authenticate } = require("../middleware/auth");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/me", authenticate, authController.getMe);
router.get("/profile/:id", userController.getUserProfile);
router.put("/profile", authenticate, userController.updateProfile);
router.put("/change-password", authenticate, authController.updatePassword);

module.exports = router;
