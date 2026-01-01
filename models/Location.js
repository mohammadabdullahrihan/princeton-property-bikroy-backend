const mongoose = require("mongoose")

const locationSchema = new mongoose.Schema({
  division: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: Number,
    lng: Number,
  },
})

module.exports = mongoose.model("Location", locationSchema)
