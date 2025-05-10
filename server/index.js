const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorResponse } = require('./utils/responseHandler');
const requestLogger = require('./middlewares/logger');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({
  verify: (req, res, buf, encoding) => {
    if (buf.length === 0) {
      return; // Skip validation for empty bodies
    }
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json(
        errorResponse('Invalid JSON payload', [{ message: 'Body must be valid JSON' }])
      );
      throw new Error('Invalid JSON');
    }
  }
}));

// Add URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Request body logging middleware
app.use((req, res, next) => {
  if (req.path.includes('/api/users/login')) {
    console.log('Request body:', req.body);
  }
  next();
});

// Connect to database asynchronously
(async () => {
  const dbError = await connectDB();
  
  if (dbError) {
    console.error('Warning: Server starting without database connection');
    
    // Add a middleware to check database connection status
    app.use((req, res, next) => {
      // Skip this middleware for the root route
      if (req.path === '/') {
        return next();
      }
      
      // If trying to access API routes but DB is not connected
      if (req.path.startsWith('/api') && mongoose.connection.readyState !== 1) {
        return res.status(503).json(
          errorResponse('Database service unavailable. Please try again later.')
        );
      }
      next();
    });
  }

  // Basic route for testing
  app.get('/', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.send(`Digital Wallet API is running... Database: ${dbStatus}`);
  });
  
  // Routes
  app.use('/api/users', require('./routes/authRoutes'));
  app.use('/api/transactions', require('./routes/transactionRoutes'));
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(`Server Error: ${err.message}`);
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(
      errorResponse(
        'Server Error', 
        process.env.NODE_ENV === 'production' ? null : [{ message: err.message }]
      )
    );
  });
  
  // Handle 404 errors
  app.use((req, res) => {
    res.status(404).json(
      errorResponse(`Route ${req.originalUrl} not found`)
    );
  });
  
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
})(); 