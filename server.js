require('dotenv').config();
const express = require("express");
const connectDB = require('./config/db');
const app = express();
const productRoutes = require("./routes/products");
const healthRoutes = require('./routes/health');
const errorHandler = require("./middleware/errorHandler");

// Connect to MongoDB
connectDB();

app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
// Health check endpoint (DB + process uptime)
app.use('/health', healthRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// ✅ Global Error Middleware (should come LAST)
app.use(errorHandler);

const PORT = 3000;

// Only start the server when this file is run directly.
if (require.main === module) {
  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
}

// Export app for testing (so tests can import without starting the listener)
module.exports = app;
