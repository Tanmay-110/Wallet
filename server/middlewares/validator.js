const { errorResponse } = require('../utils/responseHandler');

const validate = (schema) => (req, res, next) => {
  try {
    // Debug logging
    console.log('Request body for validation:', req.body);
    console.log('Request content-type:', req.headers['content-type']);
    
    // Try to parse schema
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    if (result.success) {
      next();
    } else {
      console.error('Validation errors:', result.error.errors);
      
      const formattedErrors = result.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      return res.status(400).json(
        errorResponse('Validation failed', formattedErrors)
      );
    }
  } catch (error) {
    console.error('Validator middleware error:', error);
    
    return res.status(500).json(
      errorResponse('Server validation error', [{ message: error.message }])
    );
  }
};

module.exports = validate; 