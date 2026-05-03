const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checkedInAt: { type: Date, default: Date.now },
    method: { type: String, enum: ['manual'], default: 'manual' },
    note: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
