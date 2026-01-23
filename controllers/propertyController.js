const Property = require('../models/Property');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Get all properties with filters and pagination
 * @route   GET /api/properties
 * @access  Public
 */
exports.getAllProperties = asyncHandler(async (req, res) => {
  const {
    category,
    propertyType,
    division,
    district,
    area,
    minPrice,
    maxPrice,
    minSize,
    maxSize,
    bedrooms,
    bathrooms,
    featured,
    verified,
    search,
    sort = '-createdAt',
    page = 1,
    limit = 12
  } = req.query;

  // Build query
  const query = { status: 'active' };

  if (category) query.category = category;
  if (propertyType) query.propertyType = propertyType;
  if (division) query['location.division'] = division;
  if (district) query['location.district'] = district;
  if (area) query['location.area'] = { $regex: area, $options: 'i' };

  // Price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Size range
  if (minSize || maxSize) {
    query.size = {};
    if (minSize) query.size.$gte = parseFloat(minSize);
    if (maxSize) query.size.$lte = parseFloat(maxSize);
  }

  // Bedrooms and bathrooms
  if (bedrooms) query.bedrooms = { $gte: parseInt(bedrooms) };
  if (bathrooms) query.bathrooms = { $gte: parseInt(bathrooms) };

  // Featured and verified
  if (featured !== undefined) query.featured = featured === 'true';
  if (verified !== undefined) query.verified = verified === 'true';

  // Text search
  if (search) {
    query.$text = { $search: search };
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const properties = await Property.find(query)
    .populate('userId', 'name email phone rating reviewCount verified')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Property.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    },
    message: 'Properties retrieved successfully'
  });
});

/**
 * @desc    Get single property by ID
 * @route   GET /api/properties/:id
 * @access  Public
 */
exports.getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('userId', 'name email phone verified avatar');

  if (!property) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Property not found'
    });
  }

  // Increment views (only if not the owner)
  if (!req.user || req.user._id.toString() !== property.userId._id.toString()) {
    await property.incrementViews();
  }

  res.status(200).json({
    success: true,
    data: property,
    message: 'Property retrieved successfully'
  });
});

/**
 * @desc    Create new property
 * @route   POST /api/properties
 * @access  Private (Seller/Admin)
 */
exports.createProperty = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.userId = req.user._id;

  // Set contact info from user if not provided
  if (!req.body.contactInfo) {
    req.body.contactInfo = {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone
    };
  }

  const property = await Property.create(req.body);

  res.status(201).json({
    success: true,
    data: property,
    message: 'Property created successfully'
  });
});

/**
 * @desc    Update property
 * @route   PUT /api/properties/:id
 * @access  Private (Owner/Admin)
 */
exports.updateProperty = asyncHandler(async (req, res) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Property not found'
    });
  }

  // Don't allow updating userId
  delete req.body.userId;

  property = await Property.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: property,
    message: 'Property updated successfully'
  });
});

/**
 * @desc    Delete property
 * @route   DELETE /api/properties/:id
 * @access  Private (Owner/Admin)
 */
exports.deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Property not found'
    });
  }

  await property.deleteOne();

  res.status(200).json({
    success: true,
    data: null,
    message: 'Property deleted successfully'
  });
});

/**
 * @desc    Verify property (Admin only)
 * @route   PUT /api/properties/:id/verify
 * @access  Private/Admin
 */
exports.verifyProperty = asyncHandler(async (req, res) => {
  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { verified: true, status: 'active' },
    { new: true }
  );

  if (!property) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Property not found'
    });
  }

  res.status(200).json({
    success: true,
    data: property,
    message: 'Property verified successfully'
  });
});

/**
 * @desc    Feature property (Admin only)
 * @route   PUT /api/properties/:id/feature
 * @access  Private/Admin
 */
exports.featureProperty = asyncHandler(async (req, res) => {
  const { featured } = req.body;

  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { featured: featured !== undefined ? featured : true },
    { new: true }
  );

  if (!property) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Property not found'
    });
  }

  res.status(200).json({
    success: true,
    data: property,
    message: `Property ${property.featured ? 'featured' : 'unfeatured'} successfully`
  });
});

/**
 * @desc    Update property status
 * @route   PUT /api/properties/:id/status
 * @access  Private (Owner/Admin)
 */
exports.updatePropertyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['active', 'pending', 'sold', 'rented', 'inactive'].includes(status)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Invalid status value'
    });
  }

  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Property not found'
    });
  }

  property.status = status;
  await property.save();

  res.status(200).json({
    success: true,
    data: property,
    message: 'Property status updated successfully'
  });
});

/**
 * @desc    Get featured properties
 * @route   GET /api/properties/featured
 * @access  Public
 */
exports.getFeaturedProperties = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  const properties = await Property.find({ 
    featured: true, 
    status: 'active' 
  })
    .populate('userId', 'name rating reviewCount')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: properties,
    message: 'Featured properties retrieved successfully'
  });
});

/**
 * @desc    Get similar properties
 * @route   GET /api/properties/:id/similar
 * @access  Public
 */
exports.getSimilarProperties = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Property not found'
    });
  }

  const { limit = 4 } = req.query;

  // Find similar properties based on category, location, and price range
  const priceRange = property.price * 0.3; // 30% price variance

  const similarProperties = await Property.find({
    _id: { $ne: property._id },
    status: 'active',
    category: property.category,
    $or: [
      { 'location.district': property.location.district },
      { propertyType: property.propertyType }
    ],
    price: {
      $gte: property.price - priceRange,
      $lte: property.price + priceRange
    }
  })
    .populate('userId', 'name rating')
    .limit(parseInt(limit))
    .sort({ featured: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    data: similarProperties,
    message: 'Similar properties retrieved successfully'
  });
});

module.exports = exports;
