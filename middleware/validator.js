const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));
    
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

/**
 * User validation rules
 */
const validateUserSignup = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  body('role')
    .optional()
    .isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller'),
  
  body('phone')
    .optional()
    .matches(/^(\+8801|01)[3-9]\d{8}$/).withMessage('Please provide a valid Bangladesh phone number'),
  
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  handleValidationErrors
];

const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('phone')
    .optional()
    .matches(/^(\+8801|01)[3-9]\d{8}$/).withMessage('Please provide a valid Bangladesh phone number'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  handleValidationErrors
];

/**
 * Property validation rules
 */
const validatePropertyCreate = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 10, max: 200 }).withMessage('Title must be between 10 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 50, max: 5000 }).withMessage('Description must be between 50 and 5000 characters'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['buy', 'rent']).withMessage('Category must be either buy or rent'),
  
  body('propertyType')
    .notEmpty().withMessage('Property type is required')
    .isIn(['apartment', 'house', 'land', 'commercial', 'office', 'shop', 'warehouse'])
    .withMessage('Invalid property type'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('size')
    .notEmpty().withMessage('Size is required')
    .isFloat({ min: 1 }).withMessage('Size must be at least 1'),
  
  body('bedrooms')
    .optional()
    .isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative integer'),
  
  body('bathrooms')
    .optional()
    .isInt({ min: 0 }).withMessage('Bathrooms must be a non-negative integer'),
  
  body('location.division')
    .notEmpty().withMessage('Division is required'),
  
  body('location.district')
    .notEmpty().withMessage('District is required'),
  
  body('location.area')
    .notEmpty().withMessage('Area is required'),
  
  handleValidationErrors
];

const validatePropertyUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 }).withMessage('Title must be between 10 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 50, max: 5000 }).withMessage('Description must be between 50 and 5000 characters'),
  
  body('category')
    .optional()
    .isIn(['buy', 'rent']).withMessage('Category must be either buy or rent'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('size')
    .optional()
    .isFloat({ min: 1 }).withMessage('Size must be at least 1'),
  
  handleValidationErrors
];

/**
 * Review validation rules
 */
const validateReviewCreate = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  
  handleValidationErrors
];

/**
 * Saved Search validation rules
 */
const validateSavedSearchCreate = [
  body('name')
    .trim()
    .notEmpty().withMessage('Search name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  
  body('searchParams.category')
    .optional()
    .isIn(['buy', 'rent', 'all']).withMessage('Invalid category'),
  
  body('searchParams.priceRange.min')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum price must be non-negative'),
  
  body('searchParams.priceRange.max')
    .optional()
    .isFloat({ min: 0 }).withMessage('Maximum price must be non-negative'),
  
  handleValidationErrors
];

/**
 * Property Flag validation rules
 */
const validatePropertyFlag = [
  body('reason')
    .notEmpty().withMessage('Reason is required')
    .isIn(['spam', 'fraud', 'inappropriate', 'duplicate', 'wrong_category', 'misleading_info', 'sold_rented', 'other'])
    .withMessage('Invalid flag reason'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  handleValidationErrors
];

/**
 * ID parameter validation
 */
const validateMongoId = (paramName = 'id') => [
  param(paramName)
    .isMongoId().withMessage('Invalid ID format'),
  
  handleValidationErrors
];

/**
 * Pagination validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserSignup,
  validateUserLogin,
  validateUserUpdate,
  validatePropertyCreate,
  validatePropertyUpdate,
  validateReviewCreate,
  validateSavedSearchCreate,
  validatePropertyFlag,
  validateMongoId,
  validatePagination
};
