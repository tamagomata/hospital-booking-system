const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { sendReservationConfirmation } = require('../utils/emailService');

// 予約一覧取得
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: reservations
    });
  } catch (error) {
    console.error('予約取得エラー:', error);
    res.status(500).json({ 
      success: false,
      error: '予約データの取得に失敗しました' 
    });
  }
});

// 新規予約作成
router.post('/', async (req, res) => {
  try {
    console.log('📨 受信データ:', req.body);

    // 必須フィールドのチェック
    if (!req.body.reservationId) {
      return res.status(400).json({
        success: false,
        error: 'reservationIdは必須です'
      });
    }

    if (!req.body.doctor || !req.body.doctor.name || !req.body.doctor.id) {
      return res.status(400).json({
        success: false,
        error: 'doctorオブジェクトにnameとidが必要です'
      });
    }

    if (!req.body.patient || !req.body.patient.name || !req.body.patient.tel) {
      return res.status(400).json({
        success: false,
        error: '患者情報（名前と電話番号）は必須です'
      });
    }

    // シンプルにデータを作成
    const reservation = new Reservation({
      reservationId: req.body.reservationId,
      patient: {
        name: req.body.patient.name,
        kana: req.body.patient.kana || '',
        tel: req.body.patient.tel,
        email: req.body.patient.email || '',
        memo: req.body.patient.memo || ''
      },
      department: req.body.department,
      doctor: {
        name: req.body.doctor.name,
        id: req.body.doctor.id
      },
      date: req.body.date,
      time: req.body.time,
      status: 'confirmed'
    });

    await reservation.save();

    console.log('✅ 保存成功:', reservation.reservationId);

    // メール送信機能
    let emailSent = false;
    if (req.body.patient.email) {
      try {
        emailSent = await sendReservationConfirmation(req.body.patient.email, reservation);
        console.log('📧 メール送信結果:', emailSent ? '成功' : '失敗');
      } catch (emailError) {
        console.error('📧 メール送信エラー（予約は成功）:', emailError);
        // メール送信エラーでも予約は成功とする
      }
    }

    res.status(201).json({
      success: true,
      message: '予約が完了しました',
      reservationId: reservation.reservationId,
      emailSent: emailSent,  // ←emailのレスポンス
      data: reservation
    });

  } catch (error) {
    console.error('❌ 保存エラー:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: `バリデーションエラー: ${errors.join(', ')}`
      });
    }

    res.status(400).json({ 
      success: false,
      error: '予約の作成に失敗しました: ' + error.message 
    });
  }
});

// 予約詳細取得
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ reservationId: req.params.id });
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: '予約が見つかりません'
      });
    }
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('予約取得エラー:', error);
    res.status(500).json({
      success: false,
      error: '予約の取得に失敗しました'
    });
  }
});

// 予約キャンセル
router.put('/:id/cancel', async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ reservationId: req.params.id });
    if (!reservation) {
      return res.status(404).json({ 
        success: false,
        error: '予約が見つかりません' 
      });
    }

    reservation.status = 'cancelled';
    reservation.updatedAt = new Date();
    await reservation.save();

    res.json({ 
      success: true,
      message: '予約をキャンセルしました', 
      data: reservation 
    });
  } catch (error) {
    console.error('キャンセルエラー:', error);
    res.status(500).json({ 
      success: false,
      error: 'キャンセルに失敗しました' 
    });
  }
});

// 日付別予約取得
router.get('/date/:date', async (req, res) => {
  try {
    const reservations = await Reservation.find({ 
      date: req.params.date,
      status: 'confirmed'
    });
    res.json({
      success: true,
      data: reservations
    });
  } catch (error) {
    console.error('日付別取得エラー:', error);
    res.status(500).json({ 
      success: false,
      error: 'データ取得に失敗しました' 
    });
  }
});

module.exports = router;