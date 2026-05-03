const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { isValidEmail } = require('../utils/validators');

const router = express.Router();

const buildAuthResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || '',
  preferredBranch: user.preferredBranch || ''
});

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPhone = String(phone || '').trim();

    if (!cleanName || !cleanEmail || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: 'user',
      phone: cleanPhone
    });
    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: buildAuthResponse(user)
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    return res.json({
      token,
      user: buildAuthResponse(user)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
