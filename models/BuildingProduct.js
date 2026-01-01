const mongoose = require("mongoose")

const buildingProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "নাম প্রয়োজন"],
  },
  description: {
    type: String,
    required: [true, "বিবরণ প্রয়োজন"],
  },
  price: {
    type: Number,
    required: [true, "মূল্য প্রয়োজন"],
  },
  category: {
    type: String,
    enum: ["bricks", "sand", "cement", "steel", "paint", "doors", "windows", "tiles", "other"],
    required: true,
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("BuildingProduct", buildingProductSchema)
