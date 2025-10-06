const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  specialty: String,
  description: String,
  schedule: {
    monday: [String],
    tuesday: [String],
    wednesday: [String],
    thursday: [String],
    friday: [String],
    saturday: [String]
  },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Doctor', doctorSchema);