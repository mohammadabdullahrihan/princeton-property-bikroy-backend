const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  label_en: {
    type: String,
    required: true,
    trim: true
  },
  label_bn: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

serviceTypeSchema.index({ key: 1 });
serviceTypeSchema.index({ isActive: 1 });

module.exports = mongoose.model('ServiceType', serviceTypeSchema);
