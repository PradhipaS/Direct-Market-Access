const mongoose = require('mongoose');

const testMongoConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    
    // Try local MongoDB first
    await mongoose.connect('mongodb://localhost:27017/agroculture_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    
    console.log('✅ Local MongoDB connection successful');
    mongoose.disconnect();
    return 'local';
  } catch (error) {
    console.log('❌ Local MongoDB not available:', error.message);
    
    try {
      // Try using in-memory database for testing
      const MongoMemoryServer = require('mongodb-memory-server');
      console.log('Trying MongoDB Memory Server...');
      return 'memory';
    } catch (memError) {
      console.log('❌ MongoDB Memory Server not available:', memError.message);
      return 'none';
    }
  }
};

testMongoConnection()
  .then(result => {
    console.log('Database test result:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Database test failed:', error);
    process.exit(1);
  });
