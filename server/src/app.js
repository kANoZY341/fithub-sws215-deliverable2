const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const branchRoutes = require('./routes/branchRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

const parseOrigins = (value) =>
  value ? value.split(',').map((origin) => origin.trim()).filter(Boolean) : [];

const localOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:4173'
];
const configuredOrigins = [
  ...parseOrigins(process.env.CORS_ORIGINS),
  ...parseOrigins(process.env.CLIENT_URL)
];
const allowedOrigins = [...new Set([...localOrigins, ...configuredOrigins])];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());

const healthResponse = { ok: true, service: 'FitHub API', status: 'running' };

app.get('/', (req, res) => {
  res.json(healthResponse);
});

app.get('/health', (req, res) => {
  res.json(healthResponse);
});

app.get('/api/health', (req, res) => {
  res.json(healthResponse);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorMiddleware);

module.exports = app;
