const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json(
        errorResponse('User already exists')
      );
    }

    // Create user with initial balance of 1000 (for testing purposes)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      walletBalance: 1000 // Give users some initial balance to test the app
    });

    if (user) {
      const userData = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        walletBalance: user.walletBalance,
        token: generateToken(user._id)
      };

      res.status(201).json(
        successResponse('User registered successfully', userData)
      );
    } else {
      res.status(400).json(
        errorResponse('Invalid user data')
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(
      errorResponse('Server Error', [{ message: error.message }])
    );
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt with credentials:', { email, passwordLength: password ? password.length : 0 });

    // Check for user email
    const user = await User.findOne({ email });
    console.log('User found:', user ? `Yes - ${user.email}` : 'No');

    if (!user) {
      console.log('Authentication failed: User not found');
      return res.status(401).json(
        errorResponse('Invalid email or password')
      );
    }

    // Verify password matches
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');
      
    if (isMatch) {
      const userData = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        walletBalance: user.walletBalance,
        token: generateToken(user._id)
      };

      return res.json(
        successResponse('Login successful', userData)
      );
    } else {
      console.log('Authentication failed: Password mismatch');
      return res.status(401).json(
        errorResponse('Invalid email or password')
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(
      errorResponse('Server Error', [{ message: error.message }])
    );
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const userData = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        walletBalance: user.walletBalance
      };

      res.json(
        successResponse('User profile retrieved successfully', userData)
      );
    } else {
      res.status(404).json(
        errorResponse('User not found')
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(
      errorResponse('Server Error', [{ message: error.message }])
    );
  }
};

module.exports = { register, login, getProfile }; 