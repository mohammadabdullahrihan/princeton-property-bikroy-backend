const mongoose = require("mongoose")

const propertySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, "শিরোনাম প্রয়োজন"],
    text: true,
  },
  description: {
    type: String,
    required: [true, "বিবরণ প্রয়োজন"],
    text: true,
  },
  category: {
    type: String,
    enum: ["buy", "rent", "project"],
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["flat", "house", "plot", "commercial", "office", "shop", "building"],
    required: true,
    index: true,
  },
  location: {
    division: String,
    district: {
      type: String,
      index: true,
    },
    area: String,
  },
  price: {
    type: Number,
    required: [true, "মূল্য প্রয়োজন"],
    index: true,
  },
  bedrooms: Number,
  size: Number,
  images: [String],
  views: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "pending",
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

propertySchema.index({ title: "text", description: "text" })

module.exports = mongoose.model("Property", propertySchema)
