const express = require("express")
const { register, login, requestPasswordReset, resetPassword, verifyEmail } = require("../controllers/authController")
const {
  validateRequest,
  registerSchema,
  loginSchema,
  passwordResetSchema,
  passwordResetRequestSchema,
} = require("../middleware/validation")

const router = express.Router()

router.post("/register", validateRequest(registerSchema), register)
router.post("/login", validateRequest(loginSchema), login)
router.post("/request-password-reset", validateRequest(passwordResetRequestSchema), requestPasswordReset)
router.post("/reset-password", validateRequest(passwordResetSchema), resetPassword)
router.post("/verify-email", verifyEmail)

module.exports = router
