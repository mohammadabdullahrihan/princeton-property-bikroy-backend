const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const BaseController = require("./BaseController");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

class AuthController extends BaseController {
  constructor() {
    super(User, ["name", "email"]);
  }

  /**
   * @desc    Register a new user (Signup)
   */
  signup = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User with this email already exists",
        });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "viewer",
      phone,
    });

    const token = generateToken(user._id);
    user.password = undefined;

    res.status(201).json({
      success: true,
      data: { user, token },
      message: "User registered successfully",
    });
  });

  // Alias for signup if needed by old routes
  register = this.signup;

  /**
   * @desc    Login user
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Your account has been deactivated.",
        });
    }

    await User.findByIdAndUpdate(user._id, { lastLogin: Date.now() });

    const token = generateToken(user._id);
    user.password = undefined;

    res.status(200).json({
      success: true,
      data: { user, token },
      message: "Login successful",
    });
  });

  /**
   * @desc    Get current logged in user
   */
  getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: user });
  });

  /**
   * @desc    Logout user
   */
  logout = asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: "Logout successful" });
  });

  /**
   * @desc    Forgot password - send reset token
   */
  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user found with this email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.mailtrap.io",
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_EMAIL || "user",
        pass: process.env.SMTP_PASSWORD || "pass",
      },
    });

    try {
      if (process.env.SMTP_HOST) {
        await transporter.sendMail({
          from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
          to: user.email,
          subject: "Password Reset Token",
          text: `Please reset your password using this link: ${resetUrl}`,
        });
      } else {
        console.log(`⚠️ Mock Email: Reset URL is ${resetUrl}`);
      }

      res.status(200).json({ success: true, message: "Email sent" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res
        .status(500)
        .json({ success: false, message: "Email could not be sent" });
    }
  });

  // Alias for old routes
  requestPasswordReset = this.forgotPassword;

  /**
   * @desc    Reset password
   */
  resetPassword = asyncHandler(async (req, res) => {
    const resetToken = req.params.resetToken || req.body.token;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  });

  /**
   * @desc    Verify email
   */
  verifyEmail = asyncHandler(async (req, res) => {
    const token = req.params.token || req.body.token;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  });

  /**
   * @desc    Update password (authenticated)
   */
  updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(currentPassword))) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);
    res
      .status(200)
      .json({ success: true, data: { token }, message: "Password updated" });
  });
}

module.exports = new AuthController();
