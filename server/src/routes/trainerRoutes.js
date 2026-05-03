const express = require('express');
const Trainer = require('../models/Trainer');
const Branch = require('../models/Branch');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { isValidObjectId, normalizeStringArray } = require('../utils/validators');

const router = express.Router();

const buildTrainerPayload = (body, partial = false) => {
  const payload = {};

  if (!partial || body.name !== undefined) {
    payload.name = String(body.name || '').trim();
  }

  if (!partial || body.specialty !== undefined) {
    payload.specialty = String(body.specialty || '').trim();
  }

  if (!partial || body.bio !== undefined) {
    payload.bio = String(body.bio || '').trim();
  }

  if (body.languages !== undefined) {
    payload.languages = normalizeStringArray(body.languages);
  }

  if (body.availableSlots !== undefined) {
    payload.availableSlots = normalizeStringArray(body.availableSlots);
  }

  if (!partial || body.branchId !== undefined || body.branchName !== undefined) {
    payload.branchId = body.branchId ? String(body.branchId).trim() : '';
    payload.branchName = body.branchName ? String(body.branchName).trim() : '';
  }

  return payload;
};

const resolveBranchPayload = async (payload, partial = false) => {
  const hasBranchInput = payload.branchId !== undefined || payload.branchName !== undefined;
  if (partial && !hasBranchInput) return '';

  if (!payload.branchId && !payload.branchName) {
    return 'Branch is required';
  }

  let branch = null;
  if (payload.branchId) {
    if (!isValidObjectId(payload.branchId)) {
      return 'Invalid branch id';
    }
    branch = await Branch.findOne({ _id: payload.branchId, active: true });
  } else {
    branch = await Branch.findOne({ name: payload.branchName, active: true });
  }

  if (!branch) {
    return 'Branch not found';
  }

  payload.branchId = branch._id;
  payload.branchName = branch.name;
  return '';
};

const validateTrainerPayload = (payload, partial = false) => {
  if ((!partial || payload.name !== undefined) && !payload.name) {
    return 'Trainer name is required';
  }

  if ((!partial || payload.specialty !== undefined) && !payload.specialty) {
    return 'Specialty is required';
  }

  if ((!partial || payload.bio !== undefined) && !payload.bio) {
    return 'Bio is required';
  }

  return '';
};

router.get('/', async (req, res, next) => {
  try {
    const query = {};
    if (req.query.branchId) {
      if (!isValidObjectId(req.query.branchId)) {
        return res.status(400).json({ message: 'Invalid branch id' });
      }
      query.branchId = req.query.branchId;
    }
    if (req.query.branchName) {
      query.branchName = String(req.query.branchName).trim();
    }

    const trainers = await Trainer.find(query)
      .populate('branchId', 'name city area')
      .sort({ branchName: 1, name: 1 });
    res.json(trainers);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid trainer id' });
    }

    const trainer = await Trainer.findById(req.params.id).populate('branchId', 'name city area');
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.json(trainer);
  } catch (error) {
    next(error);
  }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const payload = buildTrainerPayload(req.body);
    const branchMessage = await resolveBranchPayload(payload);
    if (branchMessage) {
      return res.status(400).json({ message: branchMessage });
    }

    const validationMessage = validateTrainerPayload(payload);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const trainer = await Trainer.create(payload);
    await trainer.populate('branchId', 'name city area');

    res.status(201).json(trainer);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid trainer id' });
    }

    const payload = buildTrainerPayload(req.body, true);
    const branchMessage = await resolveBranchPayload(payload, true);
    if (branchMessage) {
      return res.status(400).json({ message: branchMessage });
    }

    const validationMessage = validateTrainerPayload(payload, true);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const updated = await Trainer.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true })
      .populate('branchId', 'name city area');
    if (!updated) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid trainer id' });
    }

    const deleted = await Trainer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.json({ message: 'Trainer deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
