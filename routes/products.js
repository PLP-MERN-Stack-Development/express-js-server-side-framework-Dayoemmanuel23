// routes/products.js
const express = require("express");
const router = express.Router();
const Product = require('../models/Product');
const { NotFoundError, ValidationError } = require('../utils/errors');

// Sample data moved to MongoDB - see initDB.js for seeding script

// ------------------------------------------------------
// ✅ GET /api/products/stats
// Returns count of products grouped by category
// ------------------------------------------------------
router.get("/stats", (req, res, next) => {
  try {
    // Counts per category
    const stats = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    // Overall totals and averages
    const totalProducts = products.length;
    const totalPrice = products.reduce((sum, p) => sum + (p.price || 0), 0);
    const averagePrice = totalProducts ? totalPrice / totalProducts : 0;

    // In-stock / out-of-stock counts
    const inStockCount = products.filter((p) => p.inStock).length;
    const outOfStockCount = totalProducts - inStockCount;

    // Average price per category
    const priceByCategory = products.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = { sum: 0, count: 0 };
      acc[p.category].sum += p.price || 0;
      acc[p.category].count += 1;
      return acc;
    }, {});

    const averagePriceByCategory = Object.keys(priceByCategory).reduce((acc, cat) => {
      const { sum, count } = priceByCategory[cat];
      acc[cat] = count ? sum / count : 0;
      return acc;
    }, {});

    res.json({
      totalProducts,
      stats,
      averagePrice,
      inStockCount,
      outOfStockCount,
      averagePriceByCategory,
    });
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------
// ✅ GET /api/products/search?name=term
// Search products by name (case-insensitive)
// ------------------------------------------------------
router.get("/search", (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) throw new ValidationError("Please provide ?name= to search");

    const results = products.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );

    if (results.length === 0) {
      throw new NotFoundError("No products match your search query");
    }

    res.json({ count: results.length, results });
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------
// ✅ GET /api/products
// Supports: ?category=Electronics&page=1&limit=10
// ------------------------------------------------------
router.get("/", (req, res, next) => {
  try {
    let { category, page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let filtered = products;

    if (category) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    res.json({
      total,
      page,
      limit,
      data,
    });
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------
// ✅ GET /api/products/:id
// Fetch a single product by ID
// ------------------------------------------------------
router.get("/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new ValidationError("Invalid ID");

    const product = products.find((p) => p.id === id);
    if (!product) throw new NotFoundError("Product not found");

    res.json(product);
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------
// ✅ POST /api/products
// Create a new product
// ------------------------------------------------------
router.post("/", (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;

    if (!name || !description || price === undefined || !category) {
      throw new ValidationError(
        "Please provide name, description, price, and category"
      );
    }

    if (typeof price !== "number") {
      throw new ValidationError("Price must be a number");
    }

    const newProduct = {
      id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      name,
      description,
      price,
      category,
      inStock: inStock ?? true,
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------
// ✅ PUT /api/products/:id
// Update an existing product
// ------------------------------------------------------
router.put("/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new ValidationError("Invalid ID");

    const product = products.find((p) => p.id === id);
    if (!product) throw new NotFoundError("Product not found");

    const { name, description, price, category, inStock } = req.body;

    if (price !== undefined && typeof price !== "number") {
      throw new ValidationError("Price must be a number");
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (inStock !== undefined) product.inStock = inStock;

    res.json(product);
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------
// ✅ DELETE /api/products/:id
// Delete a product
// ------------------------------------------------------
router.delete("/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new ValidationError("Invalid ID");

    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundError("Product not found");

    const [deleted] = products.splice(index, 1);
    res.json({ message: "Product deleted successfully", deleted });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
