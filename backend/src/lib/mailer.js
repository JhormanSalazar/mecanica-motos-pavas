const nodemailer = require('nodemailer');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
} = process.env;

let transporter = null;

if (SMTP_HOST && SMTP_PORT) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
}

async function sendMail({ to, subject, html, text, attachments }) {
  if (!to) throw new Error('Missing recipient');

  // If no transporter configured, fallback to logging
  if (!transporter) {
    console.log('No SMTP configured. Mail preview:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML:', html);
    if (attachments) console.log('Attachments:', attachments.map(a => a.filename || a.path));
    return { mocked: true };
  }

  const from = FROM_EMAIL || SMTP_USER;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text: text || undefined,
    html: html || undefined,
    attachments: attachments || undefined,
  });

  return info;
}

module.exports = { sendMail };
