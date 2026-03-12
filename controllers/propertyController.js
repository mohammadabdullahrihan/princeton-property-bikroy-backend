const Property = require("../models/Property");
const BaseController = require("./BaseController");
const { asyncHandler } = require("../middleware/errorHandler");

class PropertyController extends BaseController {
  constructor() {
    super(
      Property,
      ["title", "description", "location.area", "location.district"],
      ["userId"],
    );
  }

  /**
   * @desc    Get all properties with filters and pagination
   * @route   GET /api/properties
   */
  getAllProperties = asyncHandler(async (req, res) => {
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
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: "active" };

    // Default sort if empty or null
    const sortField = sort && sort.trim() !== "" ? sort : "-createdAt";

    if (category) query.category = category;
    if (propertyType) query.propertyType = propertyType;
    if (division) query["location.division"] = division;
    if (district) query["location.district"] = district;
    if (area) query["location.area"] = { $regex: area, $options: "i" };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (minSize || maxSize) {
      query.size = {};
      if (minSize) query.size.$gte = parseFloat(minSize);
      if (maxSize) query.size.$lte = parseFloat(maxSize);
    }

    if (bedrooms) query.bedrooms = { $gte: parseInt(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: parseInt(bathrooms) };

    if (featured !== undefined) query.featured = featured === "true";
    if (verified !== undefined) query.verified = verified === "true";

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const properties = await Property.find(query)
      .populate("userId", "name email phone rating reviewCount verified")
      .sort(sortField)
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
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
      message: "Properties retrieved successfully",
    });
  });

  /**
   * @desc    Get single property by ID
   */
  getPropertyById = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id).populate(
      "userId",
      "name email phone verified avatar",
    );

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    if (
      !req.user ||
      req.user._id.toString() !== property.userId._id.toString()
    ) {
      // Assuming incrementViews exists on model instance
      if (typeof property.incrementViews === "function") {
        await property.incrementViews();
      }
    }

    res.status(200).json({ success: true, data: property });
  });

  /**
   * @desc    Create new property
   */
  createProperty = asyncHandler(async (req, res) => {
    const propertyData = { ...req.body };
    propertyData.userId = req.user._id;

    // Handle images from multer
    if (req.files && req.files.length > 0) {
      propertyData.images = req.files.map(file => ({
        url: file.path.startsWith('http') ? file.path : `/uploads/${file.filename}`,
        caption: file.originalname
      }));
    }

    // Parse JSON fields if they are strings (sent via FormData)
    if (typeof propertyData.location === 'string') {
      try { propertyData.location = JSON.parse(propertyData.location); } catch (e) {}
    }
    if (typeof propertyData.amenities === 'string') {
      try { propertyData.amenities = JSON.parse(propertyData.amenities); } catch (e) {}
    }

    if (!propertyData.contactInfo) {
      propertyData.contactInfo = {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      };
    }

    const property = await Property.create(propertyData);
    res.status(201).json({ success: true, data: property });
  });

  /**
   * @desc    Update property
   */
  updateProperty = asyncHandler(async (req, res) => {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    const updateData = { ...req.body };
    delete updateData.userId;

    // Handle new images if any
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path.startsWith('http') ? file.path : `/uploads/${file.filename}`,
        caption: file.originalname
      }));
      
      // If the frontend sends existing images, we might need to merge or replace.
      // For now, let's assume if new files are uploaded, they are added.
      // However, usually we should handle the list properly.
      // If req.body.images exists as a string (JSON), parse it first.
      let existingImages = [];
      if (updateData.images) {
         try {
           existingImages = typeof updateData.images === 'string' ? JSON.parse(updateData.images) : updateData.images;
         } catch (e) {}
      } else {
         existingImages = property.images;
      }
      updateData.images = [...existingImages, ...newImages];
    }

    // Parse JSON fields
    if (typeof updateData.location === 'string') {
      try { updateData.location = JSON.parse(updateData.location); } catch (e) {}
    }
    if (typeof updateData.amenities === 'string') {
      try { updateData.amenities = JSON.parse(updateData.amenities); } catch (e) {}
    }

    property = await Property.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: property });
  });

  /**
   * @desc    Delete property
   */
  deleteProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    await property.deleteOne();

    res.status(200).json({ success: true, data: null });
  });

  /**
   * @desc    Verify property (Admin only)
   */
  verifyProperty = asyncHandler(async (req, res) => {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { verified: true, status: "active" },
      { new: true },
    );

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, data: property });
  });

  /**
   * @desc    Feature property (Admin only)
   */
  featureProperty = asyncHandler(async (req, res) => {
    const { featured } = req.body;
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { featured: featured !== undefined ? featured : true },
      { new: true },
    );

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, data: property });
  });

  /**
   * @desc    Update property status
   */
  updatePropertyStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!["active", "pending", "sold", "rented", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, data: property });
  });

  /**
   * @desc    Get featured properties
   */
  getFeaturedProperties = asyncHandler(async (req, res) => {
    const { limit = 6 } = req.query;
    const properties = await Property.find({ featured: true, status: "active" })
      .populate("userId", "name rating reviewCount")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({ success: true, data: properties });
  });

  /**
   * @desc    Get similar properties
   */
  getSimilarProperties = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    const { limit = 4 } = req.query;
    const priceRange = property.price * 0.3;

    const similarProperties = await Property.find({
      _id: { $ne: property._id },
      status: "active",
      category: property.category,
      $or: [
        { "location.district": property.location.district },
        { propertyType: property.propertyType },
      ],
      price: {
        $gte: property.price - priceRange,
        $lte: property.price + priceRange,
      },
    })
      .populate("userId", "name rating")
      .limit(parseInt(limit))
      .sort({ featured: -1, createdAt: -1 });

    res.status(200).json({ success: true, data: similarProperties });
  });
}

module.exports = new PropertyController();
