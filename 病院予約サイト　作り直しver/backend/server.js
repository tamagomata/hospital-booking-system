const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(helmet());

// MongoDB接続
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDBに接続しました'))
.catch(err => console.error('MongoDB接続エラー:', err));

// ルート
app.get('/', (req, res) => {
  res.json({ message: '病院予約システムAPI' });
});

// 予約ルート
app.use('/api/reservations', require('./routes/reservationRoutes'));

// 認証ルート
app.use('/api/auth', require('./routes/authRoutes'));

//app.use('/api/doctors', require('./routes/doctors'));
//app.use('/api/departments', require('./routes/departments'));

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});