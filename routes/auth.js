const express = require("express");
const {
  register,
  login,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  getMe,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const {
  validateRequest,
  registerSchema,
  loginSchema,
  passwordResetSchema,
  passwordResetRequestSchema,
} = require("../middleware/validation");

const router = express.Router();

router.post("/signup", validateRequest(registerSchema), register);
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.get("/me", authenticate, getMe);
router.post(
  "/forgot-password",
  validateRequest(passwordResetRequestSchema),
  requestPasswordReset,
);
router.post(
  "/request-password-reset",
  validateRequest(passwordResetRequestSchema),
  requestPasswordReset,
);
router.post(
  "/reset-password",
  validateRequest(passwordResetSchema),
  resetPassword,
);
router.post("/verify-email", verifyEmail);

module.exports = router;
