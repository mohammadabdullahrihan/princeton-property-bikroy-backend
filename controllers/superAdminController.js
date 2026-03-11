const User = require('../models/User');
const Property = require('../models/Property');
const Location = require('../models/Location');
const ServiceType = require('../models/ServiceType');
const { asyncHandler } = require('../middleware/errorHandler');

// ─────────────────────────────────────────
//  DASHBOARD STATS
// ─────────────────────────────────────────
exports.getSuperAdminStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProperties,
    activeListings,
    pendingListings,
    totalLocations,
    totalServices
  ] = await Promise.all([
    User.countDocuments(),
    Property.countDocuments(),
    Property.countDocuments({ status: 'active' }),
    Property.countDocuments({ status: 'pending' }),
    Location.countDocuments(),
    ServiceType.countDocuments({ isActive: true })
  ]);

  const recentListings = await Property.find()
    .sort('-createdAt')
    .limit(5)
    .select('title price status createdAt location')
    .populate('userId', 'name email');

  const usersByRole = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers, totalProperties, activeListings, pendingListings,
      totalLocations, totalServices,
      recentListings, usersByRole,
      timestamp: new Date()
    }
  });
});

// ─────────────────────────────────────────
//  USER MANAGEMENT
// ─────────────────────────────────────────
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
  const filter = {};
  if (role) filter.role = role;
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } }
  ];

  const [users, total] = await Promise.all([
    User.find(filter).select('-password -verificationToken -resetPasswordToken')
      .skip(skip).limit(parseInt(limit)).sort('-createdAt'),
    User.countDocuments(filter)
  ]);

  res.status(200).json({ success: true, data: { users, total } });
});

exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['superadmin', 'admin', 'viewer'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }
  // Protect: cannot downgrade another superadmin
  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ success: false, message: 'User not found' });
  if (target.role === 'superadmin' && req.user._id.toString() !== target._id.toString()) {
    return res.status(403).json({ success: false, message: 'Cannot change another superadmin\'s role' });
  }

  target.role = role;
  await target.save();
  res.status(200).json({ success: true, data: target });
});

exports.toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  user.isActive = !user.isActive;
  await user.save();
  res.status(200).json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user.role === 'superadmin') {
    return res.status(403).json({ success: false, message: 'Cannot delete a superadmin account' });
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: 'User deleted'
  });
});

// ─────────────────────────────────────────
//  PROPERTY MODERATION
// ─────────────────────────────────────────
exports.getAllListings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { 'location.area': { $regex: search, $options: 'i' } }
  ];

  const [listings, total] = await Promise.all([
    Property.find(filter).populate('userId', 'name email phone')
      .skip(skip).limit(parseInt(limit)).sort('-createdAt'),
    Property.countDocuments(filter)
  ]);

  res.status(200).json({ success: true, data: { listings, total } });
});

exports.approveProperty = asyncHandler(async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true })
    .populate('userId', 'name email');
  if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
  res.status(200).json({ success: true, data: property });
});

exports.rejectProperty = asyncHandler(async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true })
    .populate('userId', 'name email');
  if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
  res.status(200).json({ success: true, data: property });
});

exports.toggleVerified = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
  property.verified = !property.verified;
  await property.save();
  res.status(200).json({
    success: true,
    message: `Property ${property.verified ? 'verified' : 'unverified'}`
  });
});

exports.toggleFeatured = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
  property.featured = !property.featured;
  await property.save();
  res.status(200).json({
    success: true,
    message: `Property ${property.featured ? 'featured' : 'unfeatured'}`
  });
});

exports.deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
  await property.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Property deleted'
  });
});

// ─────────────────────────────────────────
//  LOCATION MANAGEMENT
// ─────────────────────────────────────────
exports.getAllLocationsAdmin = asyncHandler(async (req, res) => {
  const locations = await Location.find().sort('division');
  res.status(200).json({
    success: true,
    data: locations
  });
});

exports.addArea = asyncHandler(async (req, res) => {
  const { division, district, name_en, name_bn } = req.body;
  if (!division || !district || !name_en || !name_bn) {
    return res.status(400).json({ success: false, message: 'division, district, name_en and name_bn are required' });
  }

  let loc = await Location.findOne({ division });
  if (!loc) {
    loc = new Location({ division, districts: [] });
  }

  let dist = loc.districts.find(d => d.name === district);
  if (!dist) {
    loc.districts.push({ name: district, name_bn: name_bn, areas: [] });
    dist = loc.districts[loc.districts.length - 1];
  }

  // Check duplicate
  if (dist.areas.find(a => a.name.toLowerCase() === name_en.toLowerCase())) {
    return res.status(400).json({ success: false, message: 'Area already exists' });
  }

  dist.areas.push({ name: name_en, name_bn });
  await loc.save();
  res.status(201).json({ success: true, data: loc, message: 'Area added successfully' });
});

exports.addDistrict = asyncHandler(async (req, res) => {
  const { division, division_bn, name_en, name_bn } = req.body;
  if (!division || !name_en || !name_bn) {
    return res.status(400).json({ success: false, message: 'division, name_en and name_bn are required' });
  }

  let loc = await Location.findOne({ division });
  if (!loc) {
    loc = new Location({ division, division_bn: division_bn || division, districts: [] });
  }

  if (loc.districts.find(d => d.name.toLowerCase() === name_en.toLowerCase())) {
    return res.status(400).json({ success: false, message: 'District already exists' });
  }

  loc.districts.push({ name: name_en, name_bn, areas: [] });
  await loc.save();
  res.status(201).json({ success: true, data: loc, message: 'District added successfully' });
});

exports.deleteArea = asyncHandler(async (req, res) => {
  const { division, district, areaName } = req.body;
  const loc = await Location.findOne({ division });
  if (!loc) return res.status(404).json({ success: false, message: 'Division not found' });

  const dist = loc.districts.find(d => d.name === district);
  if (!dist) return res.status(404).json({ success: false, message: 'District not found' });

  dist.areas = dist.areas.filter(a => a.name !== areaName);
  await loc.save();
  res.status(200).json({
    success: true,
    message: 'Area deleted'
  });
});

// ─────────────────────────────────────────
//  SERVICE TYPE MANAGEMENT
// ─────────────────────────────────────────
exports.getAllServices = asyncHandler(async (req, res) => {
  const services = await ServiceType.find().sort('order');
  res.status(200).json({ success: true, data: services });
});

exports.createService = asyncHandler(async (req, res) => {
  const { key, label_en, label_bn, order } = req.body;
  if (!key || !label_en || !label_bn) {
    return res.status(400).json({ success: false, message: 'key, label_en and label_bn are required' });
  }

  const service = await ServiceType.create({ key, label_en, label_bn, order: order || 0 });
  res.status(201).json({ success: true, data: service });
});

exports.updateService = asyncHandler(async (req, res) => {
  const service = await ServiceType.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.status(200).json({ success: true, data: service });
});

exports.deleteService = asyncHandler(async (req, res) => {
  const service = await ServiceType.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.status(200).json({
    success: true,
    message: 'Service deleted'
  });
});
