/**
 * Simple request logger middleware for Express
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requestLogger = (req, res, next) => {
  const start = new Date();
  
  // Log request details
  console.log(`[${start.toISOString()}] ${req.method} ${req.originalUrl}`);
  
  // Log request body for POST/PUT requests (but don't log passwords)
  if (req.method === 'POST' || req.method === 'PUT') {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '********';
    console.log('Request body:', JSON.stringify(sanitizedBody));
  }
  
  // Track response
  const originalSend = res.send;
  res.send = function(body) {
    const end = new Date();
    const duration = end - start;
    
    console.log(`[${end.toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    
    // Call the original send function
    return originalSend.apply(this, arguments);
  };
  
  next();
};

module.exports = requestLogger; 