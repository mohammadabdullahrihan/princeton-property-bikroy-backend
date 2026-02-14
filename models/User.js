const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },

  role: {
    type: String,
    enum: ['admin', 'viewer'],
    default: 'viewer'
  },

  phone: {
    type: String,
    trim: true,
    match: [/^(\+8801|01)[3-9]\d{8}$/, 'Please provide a valid Bangladesh phone number']
  },

  avatar: {
    type: String,
    default: null
  },

  verified: {
    type: Boolean,
    default: false
  },

  verificationToken: String,
  verificationTokenExpire: Date,

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  isActive: {
    type: Boolean,
    default: true
  },

  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user's properties
userSchema.virtual('properties', {
  ref: 'Property',
  localField: '_id',
  foreignField: 'userId',
  justOne: false
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Index for faster queries
userSchema.index({ role: 1 });
userSchema.index({ verified: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
