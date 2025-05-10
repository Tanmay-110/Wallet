const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/responseHandler');

const protect = async (req, res, next) => {
  let token;
  
  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json(
          errorResponse('Not authorized, user not found')
        );
      }
      
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json(
        errorResponse('Not authorized, token failed')
      );
    }
  }
  
  if (!token) {
    return res.status(401).json(
      errorResponse('Not authorized, no token provided')
    );
  }
};

module.exports = { protect }; 