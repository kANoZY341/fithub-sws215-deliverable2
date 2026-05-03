const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Trainer = require('../models/Trainer');
const Membership = require('../models/Membership');
const Booking = require('../models/Booking');
const Attendance = require('../models/Attendance');
const { getDubaiDayRange } = require('../utils/dateUtils');

const router = express.Router();

router.get('/dashboard', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const now = new Date();
    const { startUtc, endUtc } = getDubaiDayRange(now);
    await Membership.updateMany({ endDate: { $lt: now } }, { status: 'expired' });

    const [totalUsers, activeMemberships, pendingBookings, confirmedBookings, checkInsToday, recentBookings, recentAttendance] =
      await Promise.all([
        User.countDocuments(),
        Membership.countDocuments({ status: 'active', endDate: { $gte: now } }),
        Booking.countDocuments({ status: 'pending' }),
        Booking.countDocuments({ status: 'confirmed' }),
        Attendance.countDocuments({ checkedInAt: { $gte: startUtc, $lt: endUtc } }),
        Booking.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .populate('userId', 'name')
          .populate('trainerId', 'name branchName'),
        Attendance.find()
          .sort({ checkedInAt: -1 })
          .limit(10)
          .populate('userId', 'name')
      ]);

    const recentActivity = [
      ...recentBookings.map((booking) => ({
        type: 'booking',
        createdAt: booking.createdAt,
        text: `${booking.userId?.name || 'User'} booked ${booking.trainerId?.name || 'trainer'} at ${booking.branchName || booking.trainerId?.branchName || 'branch'} (${booking.slot}) - ${booking.status}`
      })),
      ...recentAttendance.map((attendance) => ({
        type: 'attendance',
        createdAt: attendance.checkedInAt,
        text: `${attendance.userId?.name || 'User'} checked in`
      }))
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.json({
      metrics: {
        totalUsers,
        activeMemberships,
        pendingBookings,
        confirmedBookings,
        checkInsToday
      },
      recentActivity
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/reports', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const now = new Date();
    await Membership.updateMany({ endDate: { $lt: now } }, { status: 'expired' });

    const [
      users,
      admins,
      plans,
      trainers,
      bookings,
      memberships,
      attendance,
      activeMemberships,
      pendingBookings,
      confirmedBookings,
      cancelledBookings
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      Plan.countDocuments({ active: true }),
      Trainer.countDocuments(),
      Booking.countDocuments(),
      Membership.countDocuments(),
      Attendance.countDocuments(),
      Membership.countDocuments({ status: 'active', endDate: { $gte: now } }),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'cancelled' })
    ]);

    res.json({
      users,
      admins,
      regularUsers: users - admins,
      plans,
      trainers,
      bookings,
      memberships,
      attendance,
      activeMemberships,
      pendingBookings,
      confirmedBookings,
      cancelledBookings
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
