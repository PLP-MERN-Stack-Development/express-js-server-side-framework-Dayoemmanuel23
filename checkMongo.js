require('dotenv').config();
const mongoose = require('mongoose');

const checkDB = async () => {
    try {
        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('\nConnection Info:');
        console.log('---------------');
        console.log('Host:', conn.connection.host);
        console.log('Database:', conn.connection.name);
        console.log('Port:', conn.connection.port);

        // Get the Product model
        const Product = require('./models/Product');
        
        // Count documents
        const count = await Product.countDocuments();
        console.log('\nProduct Collection:');
        console.log('------------------');
        console.log('Total Documents:', count);

        // Get a sample document
        if (count > 0) {
            const sample = await Product.findOne();
            console.log('\nSample Document:');
            console.log('---------------');
            console.log(JSON.stringify(sample, null, 2));
        }

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nAll Collections:');
        console.log('---------------');
        collections.forEach(collection => {
            console.log(collection.name);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

checkDB();