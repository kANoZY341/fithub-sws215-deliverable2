const express = require('express');
const Plan = require('../models/Plan');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { isValidObjectId, normalizeStringArray, toBoolean, toNumber } = require('../utils/validators');

const router = express.Router();

const buildPlanPayload = (body, partial = false) => {
  const payload = {};

  if (!partial || body.name !== undefined) {
    payload.name = String(body.name || '').trim();
  }

  if (!partial || body.price !== undefined) {
    payload.price = toNumber(body.price);
  }

  if (!partial || body.durationDays !== undefined) {
    payload.durationDays = toNumber(body.durationDays);
  }

  if (body.features !== undefined) {
    payload.features = normalizeStringArray(body.features);
  }

  if (body.active !== undefined) {
    payload.active = toBoolean(body.active);
  } else if (!partial) {
    payload.active = true;
  }

  return payload;
};

const validatePlanPayload = (payload, partial = false) => {
  if (!partial || payload.name !== undefined) {
    if (!payload.name) return 'Plan name is required';
  }

  if (!partial || payload.price !== undefined) {
    if (!Number.isFinite(payload.price) || payload.price < 0) return 'Price must be a valid number';
  }

  if (!partial || payload.durationDays !== undefined) {
    if (!Number.isInteger(payload.durationDays) || payload.durationDays < 1) {
      return 'Duration must be a whole number of days';
    }
  }

  return '';
};

router.get('/', async (req, res, next) => {
  try {
    const plans = await Plan.find({ active: true }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid plan id' });
    }

    const plan = await Plan.findOne({ _id: req.params.id, active: true });
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json(plan);
  } catch (error) {
    next(error);
  }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const payload = buildPlanPayload(req.body);
    const validationMessage = validatePlanPayload(payload);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const plan = await Plan.create(payload);

    res.status(201).json(plan);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid plan id' });
    }

    const payload = buildPlanPayload(req.body, true);
    const validationMessage = validatePlanPayload(payload, true);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const updated = await Plan.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid plan id' });
    }

    const deleted = await Plan.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json({ message: 'Plan deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
