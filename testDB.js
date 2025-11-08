require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
    try {
        // Try connecting to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        // If successful, log the connection details
        console.log('✅ MongoDB Connected Successfully!');
        console.log(`Host: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);
        console.log(`Port: ${conn.connection.port}`);
        
        // Close the connection
        await mongoose.disconnect();
        console.log('✅ Connection closed successfully');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        
        // Additional troubleshooting info
        if (error.name === 'MongoServerError') {
            console.log('\nTroubleshooting tips:');
            console.log('1. Is MongoDB running? Check if mongod process is active');
            console.log('2. Check if the MongoDB port (default 27017) is accessible');
            console.log('3. Verify your connection string in .env file');
        }
        
        process.exit(1);
    }
};

testConnection();