const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT token and authenticate user
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Not authorized to access this route. Please login.'
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          data: null,
          message: 'User not found. Token invalid.'
        });
      }
      
      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          data: null,
          message: 'Your account has been deactivated. Please contact support.'
        });
      }
      
      // Attach user to request
      req.user = user;
      next();
      
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          data: null,
          message: 'Token expired. Please login again.'
        });
      }
      
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid token. Not authorized.'
      });
    }
    
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Server error during authentication'
    });
  }
};

/**
 * Middleware to authorize based on user roles
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'User not authenticated'
      });
    }
    
    if (req.user.role !== 'superadmin' && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        data: null,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    
    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 * Useful for routes that work differently for authenticated vs non-authenticated users
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token invalid, but that's ok for optional auth
        console.log('Optional auth: Invalid token');
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth
};
