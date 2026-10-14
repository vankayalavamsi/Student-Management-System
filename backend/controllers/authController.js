const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: create a JWT token that expires in 7 days
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Helper: safe user object (no password!)
const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // check whether the email is already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // password is hashed automatically by the User model
    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: 'Account created successfully',
      token: generateToken(user._id),
      user: safeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // same message for both cases so we don't reveal which emails exist
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: safeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// GET /api/auth/me (protected - returns the logged-in user's info)
const getMe = async (req, res) => {
  res.json(req.user); // attached by authMiddleware (password already removed)
};

module.exports = { register, login, getMe };