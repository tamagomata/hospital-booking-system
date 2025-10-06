const nodemailer = require('nodemailer');

// Gmailトランスポーターの設定
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // 僕のGmailアドレス
    pass: process.env.EMAIL_PASS   // 僕のGmailアプリパスワード
  }
});

// 予約確認メール送信関数
const sendReservationConfirmation = async (userEmail, reservationData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // 送信元（僕のGmail）
    to: userEmail,                 // 宛先（ユーザーが入力したメールアドレス）
    subject: '【病院予約】予約が確定しました',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5aa0;">予約確定のお知らせ</h2>
        <p>この度はご予約いただき、誠にありがとうございます。</p>
        <p>以下の内容で予約が確定しました。</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c5aa0; margin-top: 0;">予約詳細</h3>
          <p><strong>予約番号：</strong> ${reservationData.reservationId}</p>
          <p><strong>診療科：</strong> ${reservationData.department}</p>
          <p><strong>担当医師：</strong> ${reservationData.doctor.name} 医師</p>
          <p><strong>診療日時：</strong> ${reservationData.date} ${reservationData.time}</p>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c5aa0; margin-top: 0;">患者情報</h3>
          <p><strong>お名前：</strong> ${reservationData.patient.name}</p>
          <p><strong>電話番号：</strong> ${reservationData.patient.tel}</p>
          ${reservationData.patient.email ? `<p><strong>メールアドレス：</strong> ${reservationData.patient.email}</p>` : ''}
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
          <h4 style="color: #856404; margin-top: 0;">ご来院時の注意点</h4>
          <ul style="color: #856404;">
            <li>予約時間の10分前までにご来院ください</li>
            <li>保険証をお持ちください</li>
            <li>初診の方は問診票にご記入いただきます</li>
          </ul>
        </div>
        
        <p style="color: #666; font-size: 14px; text-align: center;">
          ご質問やキャンセルの場合は、お電話にてご連絡ください。<br>
          TEL: 03-1234-5678
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ 確認メールを送信しました:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ メール送信エラー:', error);
    return false;
  }
};

module.exports = { sendReservationConfirmation };