const nodemailer = require('nodemailer');
const https = require('https');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  FROM_NAME,
  BREVO_API_KEY,
  EMAIL_SEND_TIMEOUT_MS,
  EMAIL_RETRIES,
} = process.env;

const DEFAULT_TIMEOUT = Number(EMAIL_SEND_TIMEOUT_MS || 15000);
const RETRIES = Number(EMAIL_RETRIES || 2);

// Initialize SMTP transporter if credentials are available
let transporter = null;
if (SMTP_HOST && SMTP_PORT) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 10000),
    greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 5000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 10000),
  });
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function parseEmail(emailString) {
  // Extraer email de formato "Name <email@example.com>" o retornar el string si ya es solo email
  const match = emailString.match(/<(.+?)>/);
  return match ? match[1] : emailString;
}

async function sendViaBrevo({ from, fromName, to, subject, html, text, attachments }, timeoutMs) {
  if (!BREVO_API_KEY) throw new Error('BREVO_API_KEY not configured');

  // Parsear el email del remitente por si viene en formato "Name <email>"
  const senderEmail = parseEmail(from);

  const body = {
    sender: {
      email: senderEmail,
      name: fromName || 'Taller SKM',
    },
    to: Array.isArray(to) ? to.map(email => ({ email: parseEmail(email) })) : [{ email: parseEmail(to) }],
    subject,
  };

  if (html) body.htmlContent = html;
  if (text && !html) body.textContent = text;

  if (Array.isArray(attachments) && attachments.length > 0) {
    const brevoAttachments = [];
    for (const a of attachments) {
      if (a.content) {
        brevoAttachments.push({
          name: a.filename || a.path || 'attachment',
          content: Buffer.from(a.content).toString('base64'),
        });
      } else {
        console.warn(JSON.stringify({
          event: 'brevo_attachment_skipped',
          reason: 'no content',
          filename: a.filename || a.path,
        }));
      }
    }
    if (brevoAttachments.length > 0) {
      body.attachment = brevoAttachments;
    }
  }

  const payload = JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const req = https.request(
      'https://api.brevo.com/v3/smtp/email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const responseBody = Buffer.concat(chunks).toString();
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            let parsed = {};
            try {
              parsed = JSON.parse(responseBody);
            } catch (e) {
              parsed = { raw: responseBody };
            }
            resolve({ provider: 'brevo', statusCode: res.statusCode, result: parsed });
          } else {
            const err = new Error(`Brevo error: ${res.statusCode} ${responseBody}`);
            err.statusCode = res.statusCode;
            err.response = responseBody;
            reject(err);
          }
        });
      },
    );

    req.on('error', (err) => reject(err));

    req.setTimeout(Number(timeoutMs || DEFAULT_TIMEOUT), () => {
      req.destroy(new Error('Brevo request timeout'));
    });

    req.write(payload);
    req.end();
  });
}

async function sendViaSmtp({ from, to, subject, html, text, attachments }, timeoutMs) {
  if (!transporter) throw new Error('No SMTP transporter configured');

  const sendPromise = transporter.sendMail({
    from,
    to,
    subject,
    text: text || undefined,
    html: html || undefined,
    attachments: attachments || undefined,
  });

  const timeout = Number(timeoutMs || DEFAULT_TIMEOUT);
  const timeoutPromise = new Promise((_, reject) => {
    const id = setTimeout(() => reject(new Error('SMTP send timeout')), timeout);
    sendPromise.then(() => clearTimeout(id)).catch(() => clearTimeout(id));
  });

  const info = await Promise.race([sendPromise, timeoutPromise]);
  return { provider: 'smtp', info };
}

async function sendMail({ to, subject, html, text, attachments }) {
  if (!to) throw new Error('Missing recipient');
  const from = FROM_EMAIL || SMTP_USER || 'no-reply@example.com';
  const fromName = FROM_NAME || 'Taller SKM';
  const payload = { from, fromName, to, subject, html, text, attachments };

  const attempts = RETRIES + 1;
  let lastErr = null;

  // Prefer Brevo when available — 300 emails/day free, no domain required
  if (BREVO_API_KEY) {
    for (let i = 0; i < attempts; i++) {
      try {
        console.info(JSON.stringify({
          event: 'email_send_attempt',
          method: 'brevo',
          attempt: i + 1,
          from,
          to,
          subject,
        }));
        const result = await sendViaBrevo(payload, DEFAULT_TIMEOUT);
        console.info(JSON.stringify({
          event: 'email_sent',
          method: 'brevo',
          to,
          subject,
          messageId: result.result?.messageId || null,
        }));
        return result;
      } catch (err) {
        lastErr = err;
        console.error(JSON.stringify({
          event: 'email_send_error',
          method: 'brevo',
          attempt: i + 1,
          error: err.message,
          statusCode: err.statusCode || null,
        }));
        if (i < attempts - 1) await delay(500 * 2 ** i);
      }
    }
  }

  // Fallback to SMTP if configured
  if (transporter) {
    for (let i = 0; i < attempts; i++) {
      try {
        console.info(JSON.stringify({
          event: 'email_send_attempt',
          method: 'smtp',
          attempt: i + 1,
          to,
          subject,
        }));
        const result = await sendViaSmtp(payload, DEFAULT_TIMEOUT);
        console.info(JSON.stringify({
          event: 'email_sent',
          method: 'smtp',
          to,
          subject,
        }));
        return result;
      } catch (err) {
        lastErr = err;
        console.error(JSON.stringify({
          event: 'email_send_error',
          method: 'smtp',
          attempt: i + 1,
          error: err.message,
        }));
        if (i < attempts - 1) await delay(500 * 2 ** i);
      }
    }
  }

  // If neither provider is available, log email for development
  if (!BREVO_API_KEY && !transporter) {
    console.log('No email provider configured. Mail preview:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML:', html);
    if (attachments) console.log('Attachments:', attachments.map((a) => a.filename || a.path));
    return { mocked: true };
  }

  const err = lastErr || new Error('Unknown email send error');
  console.error(JSON.stringify({ event: 'email_send_failed', error: err.message }));
  throw err;
}

module.exports = { sendMail };
