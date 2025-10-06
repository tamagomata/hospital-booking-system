const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  reservationId: {
    type: String,
    required: true,
    unique: true
  },
  patient: {
    name: { type: String, required: true },
    kana: String,
    tel: { type: String, required: true },
    email: String,
    memo: String
  },
  department: {
    type: String,
    required: true
  },
  doctor: {
    name: { type: String, required: true },
    id: { type: String, required: true }
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 予約IDの自動生成（バックアップ用）
reservationSchema.pre('save', function(next) {
  if (!this.reservationId) {
    this.reservationId = 'RSV' + Date.now().toString().slice(-8);
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);