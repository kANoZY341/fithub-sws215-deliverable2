const express = require('express');
const Membership = require('../models/Membership');
const Plan = require('../models/Plan');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { isValidObjectId } = require('../utils/validators');

const router = express.Router();

const requireSubscriptionLogin = (req, res, next) => {
  req.authMessage = 'Please log in to subscribe to a membership plan.';
  next();
};

router.post('/subscribe', requireSubscriptionLogin, authMiddleware, async (req, res, next) => {
  try {
    const { planId } = req.body;
    if (!planId) {
      return res.status(400).json({ message: 'planId is required' });
    }

    if (!isValidObjectId(planId)) {
      return res.status(400).json({ message: 'Invalid plan id' });
    }

    const plan = await Plan.findById(planId);
    if (!plan || !plan.active) {
      return res.status(404).json({ message: 'Active plan not found' });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    await Membership.updateMany(
      { userId: req.user._id, status: 'active', endDate: { $lt: startDate } },
      { status: 'expired' }
    );

    const activeMembership = await Membership.findOne({
      userId: req.user._id,
      status: 'active',
      endDate: { $gte: startDate }
    });

    if (activeMembership) {
      return res.status(409).json({ message: 'User already has an active membership plan.' });
    }

    const membership = await Membership.create({
      userId: req.user._id,
      planId,
      startDate,
      endDate,
      status: 'active'
    });

    const populated = await membership.populate('planId');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
});

router.get('/my', authMiddleware, async (req, res, next) => {
  try {
    const now = new Date();
    await Membership.updateMany({ userId: req.user._id, endDate: { $lt: now } }, { status: 'expired' });

    const memberships = await Membership.find({ userId: req.user._id })
      .populate('planId')
      .sort({ createdAt: -1 });

    res.json(memberships);
  } catch (error) {
    next(error);
  }
});

router.get('/', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const now = new Date();
    await Membership.updateMany({ endDate: { $lt: now } }, { status: 'expired' });

    const memberships = await Membership.find()
      .populate('userId', 'name email')
      .populate('planId', 'name price durationDays')
      .sort({ createdAt: -1 });

    res.json(memberships);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid membership id' });
    }

    const membership = await Membership.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('planId', 'name price durationDays');

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    const isOwner = membership.userId?._id?.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Forbidden: you can only view your own membership' });
    }

    res.json(membership);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
