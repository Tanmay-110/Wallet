const { z } = require('zod');

// Custom validators
const emailValidator = z.string()
  .email({ message: 'Please enter a valid email address' })
  .trim()
  .toLowerCase();

const passwordValidator = z.string()
  .min(6, { message: 'Password must be at least 6 characters' })
  .max(100, { message: 'Password must not exceed 100 characters' });

// Register validation schema - More permissive for debugging
const registerSchema = z.object({
  body: z.object({
    firstName: z.string()
      .min(1, { message: 'First name is required' })
      .max(50, { message: 'First name must not exceed 50 characters' }),
    lastName: z.string()
      .min(1, { message: 'Last name is required' })
      .max(50, { message: 'Last name must not exceed 50 characters' }),
    email: emailValidator,
    password: passwordValidator
  }).catchall(z.any()), // Allow additional properties for debugging
});

// Login validation schema - More permissive for debugging
const loginSchema = z.object({
  body: z.object({
    email: emailValidator,
    password: z.string().min(1, { message: 'Password is required' })
  }).catchall(z.any()), // Allow additional properties for debugging
});

module.exports = {
  registerSchema,
  loginSchema
}; 