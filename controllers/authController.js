const User = require("../models/User")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/emailService")

const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET not configured")
  return jwt.sign({ id: userId, role }, secret, { expiresIn: "30d" })
}

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.validated

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ code: "USER_EXISTS", message: "ইমেইল ইতিমধ্যে ব্যবহৃত" })
    }

    const user = new User({ name, email, password, phone, role })
    const verificationToken = user.getVerificationToken()
    await user.save()

    const token = generateToken(user._id, user.role)

    if (process.env.NODE_ENV === "production") {
      await sendVerificationEmail(user.email, verificationToken)
    }

    res.status(201).json({
      code: "REGISTER_SUCCESS",
      message: "নিবন্ধন সফল",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
      verificationToken: process.env.NODE_ENV === "development" ? verificationToken : undefined,
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "অবৈধ শংসাপত্র" })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "অবৈধ শংসাপত্র" })
    }

    const token = generateToken(user._id, user.role)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    res.json({
      code: "LOGIN_SUCCESS",
      message: "লগইন সফল",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
    })
  } catch (err) {
    next(err)
  }
}

const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.validated

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ code: "USER_NOT_FOUND", message: "ব্যবহারকারী পাওয়া যায়নি" })
    }

    const resetToken = user.getPasswordResetToken()
    await user.save()

    if (process.env.NODE_ENV === "production") {
      await sendPasswordResetEmail(user.email, resetToken)
    }

    res.json({
      code: "RESET_EMAIL_SENT",
      message: "পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে",
      resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined,
    })
  } catch (err) {
    next(err)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.validated

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ code: "INVALID_TOKEN", message: "অবৈধ অথবা মেয়াদোত্তীর্ণ টোকেন" })
    }

    user.password = newPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    res.json({
      code: "PASSWORD_RESET_SUCCESS",
      message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে",
    })
  } catch (err) {
    next(err)
  }
}

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.body

    const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex")
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ code: "INVALID_TOKEN", message: "অবৈধ অথবা মেয়াদোত্তীর্ণ টোকেন" })
    }

    user.verified = true
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined
    await user.save()

    res.json({
      code: "EMAIL_VERIFIED",
      message: "ইমেইল সফলভাবে যাচাই করা হয়েছে",
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, requestPasswordReset, resetPassword, verifyEmail }
