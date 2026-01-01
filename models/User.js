const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "নাম প্রয়োজন"],
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "ইমেইল প্রয়োজন"],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "বৈধ ইমেইল প্রয়োজন"],
  },
  password: {
    type: String,
    required: [true, "পাসওয়ার্ড প্রয়োজন"],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    required: [true, "ফোন নম্বর প্রয়োজন"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "agent", "admin"],
    default: "user",
  },
  profileImage: {
    type: String,
    default: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    select: false,
  },
  verificationTokenExpires: Date,
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000 // 30 minutes
  return resetToken
}

userSchema.methods.getVerificationToken = function () {
  const verifyToken = crypto.randomBytes(32).toString("hex")
  this.verificationToken = crypto.createHash("sha256").update(verifyToken).digest("hex")
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  return verifyToken
}

module.exports = mongoose.model("User", userSchema)
