const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Enhanced connection options
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    };

    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test connection by running a simple query
    const count = await mongoose.connection.db.listCollections().toArray();
    console.log(`Available collections: ${count.length}`);
    console.log('Database connection confirmed working');
    
    // Set up connection error handlers
    mongoose.connection.on('error', err => {
      console.error(`MongoDB connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });
    
    // Gracefully close MongoDB connection when Node process ends
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
    return null; // Return null to indicate no error
  } catch (error) {
    console.error(`Error connecting to MongoDB:`);
    console.error(error);
    // Return the error for handling
    return error;
  }
};

module.exports = connectDB; 