// middleware/validateProduct.js
const validateProduct = (req, res, next) => {
  const { name, description, price, category } = req.body;

  if (!name || !description || price === undefined || !category) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: 'Price must be a positive number' });
  }

  next(); // pass validation
};

module.exports = validateProduct;
