const express = require('express');
const Branch = require('../models/Branch');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const branches = await Branch.find({ active: true }).sort({ city: 1, area: 1 });
    res.json(branches);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
