const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protects private routes. Usage: router.get('/me', protect, getMe)
const protect = async (req, res, next) => {
  let token;

  // The frontend sends the token as:  Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Verify the token and find the user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // never return password

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user no longer exists' });
    }

    req.user = user; // attach user info for the controllers
    next();
  } catch (err) {
    // invalid or expired token
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

module.exports = protect;