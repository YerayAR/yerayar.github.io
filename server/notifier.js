const nodemailer = require('nodemailer');

let transporter;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function notify(content) {
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.NOTIFY_TO || process.env.SMTP_USER,
        subject: 'Nuevo mensaje de contacto',
        text: content
      });
    } catch (err) {
      console.error('Error sending email notification', err);
    }
  } else {
    console.log('Notification:', content);
  }
}

module.exports = { notify };
