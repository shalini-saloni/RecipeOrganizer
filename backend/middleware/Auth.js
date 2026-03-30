const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    let decoded;
    try {
      // Try the current env secret first
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (err) {
      // Fallback to the other secret we used previously so sessions don't suddenly break
      try {
        decoded = jwt.verify(token, 'premium-recipe-app-secret-key-2024');
      } catch (innerErr) {
        // Fallback to standard if they somehow had another one
        decoded = jwt.verify(token, 'your-super-secret-jwt-key-change-this');
      }
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid authentication token' });
  }
};

module.exports = auth;