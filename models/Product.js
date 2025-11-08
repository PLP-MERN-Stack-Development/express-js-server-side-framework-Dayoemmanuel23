const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Add indexes for common queries
productSchema.index({ name: 'text' }); // Enables text search on name
productSchema.index({ category: 1 }); // Improves category filtering
productSchema.index({ price: 1 }); // Improves price range queries

module.exports = mongoose.model('Product', productSchema);