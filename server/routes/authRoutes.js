const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const { registerSchema, loginSchema } = require('../validators/authValidators');

const router = express.Router();

// Register a new user
router.post('/register', validate(registerSchema), register);

// Login a user
router.post('/login', validate(loginSchema), login);

// Get user profile (protected route)
router.get('/profile', protect, getProfile);

module.exports = router; 