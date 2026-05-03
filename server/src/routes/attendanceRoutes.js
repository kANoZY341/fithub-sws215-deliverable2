const express = require('express');
const Attendance = require('../models/Attendance');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/checkin', authMiddleware, async (req, res, next) => {
  try {
    const attendance = await Attendance.create({
      userId: req.user._id,
      method: 'manual',
      note: req.body.note || ''
    });

    res.status(201).json(attendance);
  } catch (error) {
    next(error);
  }
});

router.get('/my', authMiddleware, async (req, res, next) => {
  try {
    const records = await Attendance.find({ userId: req.user._id }).sort({ checkedInAt: -1 });
    res.json(records);
  } catch (error) {
    next(error);
  }
});

router.get('/', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const records = await Attendance.find()
      .populate('userId', 'name email')
      .sort({ checkedInAt: -1 });
    res.json(records);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
