const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const unauthorizedMessage = req.authMessage || 'Unauthorized: token is required';
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: unauthorizedMessage });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ message: req.authMessage || 'Unauthorized: user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: req.authMessage || 'Unauthorized: invalid token' });
  }
};

module.exports = authMiddleware;
