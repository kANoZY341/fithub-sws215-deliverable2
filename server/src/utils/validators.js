const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email) => emailRegex.test(String(email || '').trim());

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }

  return [];
};

const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) return Number.NaN;
  return Number(value);
};

const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.trim().toLowerCase() === 'true';
  return Boolean(value);
};

module.exports = {
  isValidEmail,
  isValidObjectId,
  normalizeStringArray,
  toNumber,
  toBoolean
};
