const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Branch = require('../models/Branch');
const User = require('../models/User');

const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
  res.json(req.user);
});

router.patch('/me', authMiddleware, async (req, res, next) => {
  try {
    const { preferredBranch, phone } = req.body;

    if (preferredBranch !== undefined && preferredBranch !== '') {
      const branch = await Branch.findOne({ name: preferredBranch, active: true });
      if (!branch) {
        return res.status(400).json({ message: 'Selected branch is not valid' });
      }
    }

    const updates = {
      preferredBranch: typeof preferredBranch === 'string' ? preferredBranch : req.user.preferredBranch || ''
    };

    if (phone !== undefined) {
      const cleanPhone = String(phone).trim();
      if (cleanPhone.length > 30) {
        return res.status(400).json({ message: 'Phone number is too long' });
      }
      updates.phone = cleanPhone;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-passwordHash');

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
