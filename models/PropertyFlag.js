const mongoose = require('mongoose');

const propertyFlagSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property ID is required']
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    enum: {
      values: [
        'spam',
        'fraud',
        'inappropriate',
        'duplicate',
        'wrong_category',
        'misleading_info',
        'sold_rented',
        'other'
      ],
      message: 'Invalid flag reason'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  reviewNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Review notes cannot exceed 1000 characters']
  },
  actionTaken: {
    type: String,
    enum: ['none', 'warning', 'property_removed', 'user_suspended'],
    default: 'none'
  }
}, {
  timestamps: true
});

// Prevent duplicate flags from same user for same property
propertyFlagSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

// Index for faster queries
propertyFlagSchema.index({ propertyId: 1, status: 1 });
propertyFlagSchema.index({ status: 1, createdAt: -1 });
propertyFlagSchema.index({ reason: 1 });

// Static method to get flag statistics for a property
propertyFlagSchema.statics.getPropertyFlagStats = async function(propertyId) {
  const stats = await this.aggregate([
    { $match: { propertyId: mongoose.Types.ObjectId(propertyId) } },
    {
      $group: {
        _id: '$reason',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const totalFlags = await this.countDocuments({ propertyId });
  const pendingFlags = await this.countDocuments({ propertyId, status: 'pending' });
  
  return {
    totalFlags,
    pendingFlags,
    flagsByReason: stats
  };
};

module.exports = mongoose.model('PropertyFlag', propertyFlagSchema);
