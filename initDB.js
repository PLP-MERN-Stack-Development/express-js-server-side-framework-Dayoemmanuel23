require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const sampleProducts = [
    { name: "Laptop", description: "High-performance laptop", price: 1200, category: "Electronics", inStock: true },
    { name: "Headphones", description: "Noise-cancelling headphones", price: 200, category: "Audio", inStock: true },
    { name: "Smartphone", description: "Latest smartphone model", price: 900, category: "Electronics", inStock: true },
    { name: "Shoes", description: "Comfortable running shoes", price: 80, category: "Fashion", inStock: false },
    { name: "Keyboard", description: "Mechanical keyboard", price: 150, category: "Accessories", inStock: true },
];

const seedDB = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Clear existing products
        await Product.deleteMany({});
        console.log('✅ Cleared existing products');

        // Insert sample products
        await Product.insertMany(sampleProducts);
        console.log('✅ Sample products inserted successfully');

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('✅ Database seeded! Disconnecting...');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeding function
seedDB();