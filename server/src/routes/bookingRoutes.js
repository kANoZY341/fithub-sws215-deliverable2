const express = require('express');
const Booking = require('../models/Booking');
const Trainer = require('../models/Trainer');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { isValidObjectId } = require('../utils/validators');

const router = express.Router();

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { trainerId, slot } = req.body;
    const cleanSlot = String(slot || '').trim();

    if (!trainerId || !cleanSlot) {
      return res.status(400).json({ message: 'trainerId and slot are required' });
    }

    if (!isValidObjectId(trainerId)) {
      return res.status(400).json({ message: 'Invalid trainer id' });
    }

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    if (!trainer.availableSlots.includes(cleanSlot)) {
      return res.status(400).json({ message: 'Selected slot is not available for this trainer' });
    }

    const exists = await Booking.findOne({ trainerId, slot: cleanSlot, status: { $in: ['pending', 'confirmed'] } });
    if (exists) {
      return res.status(409).json({ message: 'This slot is already booked' });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      trainerId,
      slot: cleanSlot,
      branchId: trainer.branchId,
      branchName: trainer.branchName,
      status: 'pending'
    });

    const populated = await booking.populate([
      { path: 'userId', select: 'name email' },
      { path: 'trainerId', select: 'name specialty availableSlots branchId branchName' },
      { path: 'branchId', select: 'name city area' }
    ]);
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
});

router.get('/my', authMiddleware, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('trainerId')
      .populate('branchId', 'name city area')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid booking id' });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('trainerId', 'name specialty availableSlots branchId branchName')
      .populate('branchId', 'name city area');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isOwner = booking.userId?._id?.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Forbidden: you can only view your own booking' });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
});

router.get('/', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('trainerId', 'name specialty branchId branchName')
      .populate('branchId', 'name city area')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid booking id' });
    }

    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('userId', 'name email')
      .populate('trainerId', 'name specialty branchId branchName')
      .populate('branchId', 'name city area');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid booking id' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isOwner = booking.userId.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Forbidden: you can only delete your own booking' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
