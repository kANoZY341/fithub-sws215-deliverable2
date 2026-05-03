const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((item) => item.message);
    return res.status(400).json({ message: messages.join(', ') || 'Validation failed' });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id format' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value already exists' });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
};

module.exports = errorMiddleware;
