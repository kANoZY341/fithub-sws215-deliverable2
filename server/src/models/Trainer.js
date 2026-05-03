const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    languages: [{ type: String, trim: true }],
    availableSlots: [{ type: String, trim: true }],
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    branchName: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trainer', trainerSchema);
