const mongoose = require('mongoose');

const savedSearchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Search name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  searchParams: {
    category: {
      type: String,
      enum: ['buy', 'rent', 'all'],
      default: 'all'
    },
    propertyType: {
      type: String,
      enum: ['apartment', 'house', 'land', 'commercial', 'office', 'shop', 'warehouse', 'all'],
      default: 'all'
    },
    location: {
      division: String,
      district: String,
      area: String
    },
    priceRange: {
      min: {
        type: Number,
        min: 0,
        default: 0
      },
      max: {
        type: Number,
        min: 0
      }
    },
    sizeRange: {
      min: {
        type: Number,
        min: 0
      },
      max: {
        type: Number,
        min: 0
      }
    },
    bedrooms: {
      min: {
        type: Number,
        min: 0
      },
      max: {
        type: Number,
        min: 0
      }
    },
    bathrooms: {
      min: {
        type: Number,
        min: 0
      },
      max: {
        type: Number,
        min: 0
      }
    },
    features: {
      parking: Boolean,
      elevator: Boolean,
      generator: Boolean,
      security: Boolean,
      garden: Boolean,
      gym: Boolean,
      swimmingPool: Boolean,
      balcony: Boolean
    },
    verified: Boolean,
    featured: Boolean
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  notificationFrequency: {
    type: String,
    enum: ['instant', 'daily', 'weekly'],
    default: 'daily'
  },
  lastNotified: {
    type: Date,
    default: null
  },
  matchCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
savedSearchSchema.index({ userId: 1, isActive: 1 });
savedSearchSchema.index({ userId: 1, createdAt: -1 });

// Method to get matching properties
savedSearchSchema.methods.getMatchingProperties = async function() {
  const Property = mongoose.model('Property');
  const query = { status: 'active' };
  
  // Category filter
  if (this.searchParams.category && this.searchParams.category !== 'all') {
    query.category = this.searchParams.category;
  }
  
  // Property type filter
  if (this.searchParams.propertyType && this.searchParams.propertyType !== 'all') {
    query.propertyType = this.searchParams.propertyType;
  }
  
  // Location filters
  if (this.searchParams.location) {
    if (this.searchParams.location.division) {
      query['location.division'] = this.searchParams.location.division;
    }
    if (this.searchParams.location.district) {
      query['location.district'] = this.searchParams.location.district;
    }
    if (this.searchParams.location.area) {
      query['location.area'] = new RegExp(this.searchParams.location.area, 'i');
    }
  }
  
  // Price range filter
  if (this.searchParams.priceRange) {
    if (this.searchParams.priceRange.min !== undefined) {
      query.price = { ...query.price, $gte: this.searchParams.priceRange.min };
    }
    if (this.searchParams.priceRange.max !== undefined) {
      query.price = { ...query.price, $lte: this.searchParams.priceRange.max };
    }
  }
  
  // Size range filter
  if (this.searchParams.sizeRange) {
    if (this.searchParams.sizeRange.min !== undefined) {
      query.size = { ...query.size, $gte: this.searchParams.sizeRange.min };
    }
    if (this.searchParams.sizeRange.max !== undefined) {
      query.size = { ...query.size, $lte: this.searchParams.sizeRange.max };
    }
  }
  
  // Bedrooms filter
  if (this.searchParams.bedrooms) {
    if (this.searchParams.bedrooms.min !== undefined) {
      query.bedrooms = { ...query.bedrooms, $gte: this.searchParams.bedrooms.min };
    }
    if (this.searchParams.bedrooms.max !== undefined) {
      query.bedrooms = { ...query.bedrooms, $lte: this.searchParams.bedrooms.max };
    }
  }
  
  // Bathrooms filter
  if (this.searchParams.bathrooms) {
    if (this.searchParams.bathrooms.min !== undefined) {
      query.bathrooms = { ...query.bathrooms, $gte: this.searchParams.bathrooms.min };
    }
    if (this.searchParams.bathrooms.max !== undefined) {
      query.bathrooms = { ...query.bathrooms, $lte: this.searchParams.bathrooms.max };
    }
  }
  
  // Features filter
  if (this.searchParams.features) {
    Object.keys(this.searchParams.features).forEach(feature => {
      if (this.searchParams.features[feature] === true) {
        query[`features.${feature}`] = true;
      }
    });
  }
  
  // Verified filter
  if (this.searchParams.verified !== undefined) {
    query.verified = this.searchParams.verified;
  }
  
  // Featured filter
  if (this.searchParams.featured !== undefined) {
    query.featured = this.searchParams.featured;
  }
  
  const properties = await Property.find(query).sort({ createdAt: -1 });
  
  // Update match count
  this.matchCount = properties.length;
  await this.save();
  
  return properties;
};

module.exports = mongoose.model('SavedSearch', savedSearchSchema);
