const path = require('path');
const fs = require('fs');
function completionEmailTemplate(worklog, pilot) {
  const attachments = [];
  const subject = `Servicio terminado - Orden #${worklog.id} - Taller SKM`;

  // No image or attachments — simple card only (image-related logic removed)
  const logoImgHtml = '';

  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#e8f0fb;font-family:Arial,Helvetica,sans-serif;">
      <span style="display:none;max-height:0;overflow:hidden;">Tu servicio está listo para recogida.</span>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:24px 12px;">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;">
              <tr>
                <td style="background:linear-gradient(90deg,#1565c0,#1976d2);padding:18px;border-radius:8px 8px 0 0;color:#ffffff;">
                  <div style="display:flex;align-items:center;gap:12px;">
                    ${logoImgHtml}
                    <h1 style="margin:0;font-size:20px;font-weight:600;">Taller SKM</h1>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:#ffffff;padding:24px;border:1px solid #e6eef9;border-top:none;border-radius:0 0 8px 8px;box-shadow:0 4px 18px rgba(21,101,192,0.08);">
                  <h2 style="margin:0 0 12px 0;color:#0b3d91;font-size:18px;">Servicio terminado</h2>
                  <p style="margin:0 0 16px 0;color:#29415a;line-height:1.5;">Hola ${pilot.name || ''},</p>
                  <p style="margin:0 0 18px 0;color:#445e7a;">El servicio de tu moto — <strong>orden #${worklog.id}</strong> — ha sido <strong>terminado</strong> y ya puedes pasar a recogerla.</p>

                  <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;margin:12px 0 18px 0;border-collapse:collapse;">
                    <tr>
                      <td style="padding:8px 0;color:#61798d;">Tipo</td>
                      <td style="padding:8px 0;color:#111827;font-weight:600;">${worklog.type}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#61798d;">Horas</td>
                      <td style="padding:8px 0;color:#111827;font-weight:600;">${worklog.hours}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#61798d;">Fecha</td>
                      <td style="padding:8px 0;color:#111827;font-weight:600;">${new Date(worklog.updatedAt).toLocaleString('es-CR')}</td>
                    </tr>
                  </table>

                  <p style="margin:0;color:#8b9bb3;font-size:13px;">Gracias por confiar en Taller SKM. Si tienes preguntas responde este correo.</p>
                  <hr style="border:none;border-top:1px solid #eef6ff;margin:18px 0;">
                  <p style="margin:0;color:#9aaec7;font-size:12px;">Taller SKM · Calle Ejemplo 123 · San José</p>
                </td>
              </tr>
              <tr>
                <td style="text-align:center;padding-top:12px;color:#98b6df;font-size:12px;">
                  <small>Si no solicitaste este servicio, por favor contacta al taller.</small>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  return { subject, html, attachments };
}

module.exports = { completionEmailTemplate };
