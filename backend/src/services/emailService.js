const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOtp(email, code) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your FemCare verification code',
    text: `Your verification code is: ${code}\n\nIt expires in 10 minutes.`,
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2 style="color:#c2185b">FemCare.AI</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing:8px;color:#333">${code}</h1>
        <p style="color:#888;font-size:13px">Expires in 10 minutes. Do not share this code.</p>
      </div>
    `,
  });
}

async function sendPasswordReset(email, resetUrl) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your FemCare password',
    text: `Click the link to reset your password: ${resetUrl}\n\nExpires in 1 hour.`,
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2 style="color:#c2185b">FemCare.AI</h2>
        <p>Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#c2185b;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          Reset Password
        </a>
        <p style="color:#888;font-size:13px;margin-top:16px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { sendOtp, sendPasswordReset };
