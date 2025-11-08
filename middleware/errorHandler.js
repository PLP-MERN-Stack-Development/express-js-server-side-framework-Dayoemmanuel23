// middleware/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      name: err.name || "ServerError",
      message: err.message || "Something went wrong",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
}

module.exports = errorHandler;
