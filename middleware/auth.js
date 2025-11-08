// middleware/auth.js
const auth = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  const validKey = 'mysecretapikey'; // ✅ you can change this or move it to .env later

  if (apiKey !== validKey) {
    return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }

  next();
};

module.exports = auth;
