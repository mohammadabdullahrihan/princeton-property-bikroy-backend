const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    trim: true,
    minlength: [50, 'Description must be at least 50 characters'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  size: {
    type: Number,
    min: [0, 'Size cannot be negative']
  },
  sizeUnit: {
    type: String,
    enum: ['sqft', 'katha', 'bigha', 'acre'],
    default: 'sqft'
  },
  bedrooms: {
    type: Number,
    default: 0,
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    default: 0,
    min: [0, 'Bathrooms cannot be negative']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    caption: String
  }],
  location: {
    division: {
      type: String,
      required: [true, 'Division is required'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  amenities: [{
    type: String,
    trim: true
  }],
  features: {
    parking: { type: Boolean, default: false },
    elevator: { type: Boolean, default: false },
    generator: { type: Boolean, default: false },
    security: { type: Boolean, default: false },
    garden: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
    swimmingPool: { type: Boolean, default: false },
    balcony: { type: Boolean, default: false }
  },
  featured: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'sold', 'rented', 'inactive'],
    default: 'pending'
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  contactInfo: {
    name: String,
    phone: String,
    email: String,
    whatsapp: String
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  yearBuilt: {
    type: Number,
    min: [1900, 'Year built must be after 1900'],
    max: [new Date().getFullYear() + 2, 'Year built cannot be in the distant future']
  },
  floor: {
    type: String,
    trim: true
  },
  totalFloors: {
    type: Number,
    min: 0
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reviews


// Virtual for reviews (kept)
// averageRating virtual removed as it is now persisted

// Increment views
propertySchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Method to update property rating


// Text search index
propertySchema.index({ 
  title: 'text', 
  description: 'text',
  'location.area': 'text',
  'location.district': 'text'
});

// Compound indexes for faster queries
propertySchema.index({ category: 1, status: 1 });
propertySchema.index({ userId: 1, status: 1 });
propertySchema.index({ featured: -1, createdAt: -1 });
propertySchema.index({ verified: 1, status: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ 'location.division': 1, 'location.district': 1 });
propertySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Property', propertySchema);
