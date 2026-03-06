const path = require('path');
const fs = require('fs');

// Helper to escape HTML special characters
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function completionEmailTemplate(worklog, pilot) {
  const attachments = [];
  const subject = `Servicio terminado - Orden #${worklog.id} - Taller SKM`;

  const listLabel = worklog.type === 'ALISTAMIENTO' ? 'Trabajos adicionales' : 'Reparaciones';

  // Build service details section
  let serviceDetailsHtml = '';
  
  if (worklog.results && worklog.results.length > 0) {
    // Separate checklist items from custom items
    const checklistItems = worklog.results.filter(r => !r.isCustom);
    const customItems = worklog.results.filter(r => r.isCustom);

    // Checklist items section (for ALISTAMIENTO)
    if (checklistItems.length > 0) {
      serviceDetailsHtml += `
        <table cellpadding="0" cellspacing="0" width="100%" style="margin:20px 0 10px 0;">
          <tr>
            <td>
              <h3 style="margin:0 0 12px 0;color:#0b3d91;font-size:16px;border-bottom:2px solid #e3f2fd;padding-bottom:6px;">
                &#128295; De Alistamiento
              </h3>
            </td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:0 0 15px 0;">
      `;
      
      checklistItems.forEach((item, idx) => {
        const bgColor = idx % 2 === 0 ? '#f8fbff' : '#ffffff';
        const statusIcon = item.status === 'SI' ? '&#10003;' : item.status === 'NO' ? '&#10007;' : '&#8212;';
        const statusColor = item.status === 'SI' ? '#4caf50' : item.status === 'NO' ? '#f44336' : '#9e9e9e';
        const itemName = escapeHtml(item.name);
        const itemObs = item.obs ? escapeHtml(item.obs) : '';
        
        serviceDetailsHtml += `
          <tr style="background-color:${bgColor};">
            <td style="padding:10px 12px;color:#37474f;border-bottom:1px solid #e3f2fd;">
              <strong>${itemName}</strong>
              ${itemObs ? `<br><span style="font-size:13px;color:#607d8b;font-style:italic;">Obs: ${itemObs}</span>` : ''}
            </td>
            <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #e3f2fd;width:60px;">
              <span style="font-size:18px;color:${statusColor};font-weight:bold;">${statusIcon}</span>
            </td>
          </tr>
        `;
      });
      
      serviceDetailsHtml += `
        </table>
      `;
    }

    // Custom items section (for REPARACION or additional items)
    if (customItems.length > 0) {
      serviceDetailsHtml += `
        <table cellpadding="0" cellspacing="0" width="100%" style="margin:20px 0 10px 0;">
          <tr>
            <td>
              <h3 style="margin:0 0 12px 0;color:#0b3d91;font-size:16px;border-bottom:2px solid #e3f2fd;padding-bottom:6px;">
                &#128295; ${listLabel}
              </h3>
            </td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:0 0 15px 0;">
      `;
      
      customItems.forEach((item, idx) => {
        const bgColor = idx % 2 === 0 ? '#f8fbff' : '#ffffff';
        const statusIcon = item.status === 'SI' ? '&#10003;' : item.status === 'NO' ? '&#10007;' : '&#8212;';
        const statusColor = item.status === 'SI' ? '#4caf50' : item.status === 'NO' ? '#f44336' : '#9e9e9e';
        const itemName = escapeHtml(item.name);
        const itemObs = item.obs ? escapeHtml(item.obs) : '';
        
        serviceDetailsHtml += `
          <tr style="background-color:${bgColor};">
            <td style="padding:10px 12px;color:#37474f;border-bottom:1px solid #e3f2fd;">
              <strong>${itemName}</strong>
              ${itemObs ? `<br><span style="font-size:13px;color:#607d8b;font-style:italic;">Obs: ${itemObs}</span>` : ''}
            </td>
            <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #e3f2fd;width:60px;">
              <span style="font-size:18px;color:${statusColor};font-weight:bold;">${statusIcon}</span>
            </td>
          </tr>
        `;
      });
      
      serviceDetailsHtml += `
        </table>
      `;
    }
  }

  const pilotName = escapeHtml(pilot.name || '');
  const formattedDate = new Date(worklog.updatedAt).toLocaleString('es-CR');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Servicio Terminado</title>
</head>
<body style="margin:0;padding:0;background-color:#e8f0fb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e8f0fb;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:#1565c0;padding:18px;border-radius:8px 8px 0 0;color:#ffffff;">
              <h1 style="margin:0;font-size:20px;font-weight:600;">Taller SKM</h1>
            </td>
          </tr>
          <!-- Main Content -->
          <tr>
            <td style="background-color:#ffffff;padding:24px;border-left:1px solid #e6eef9;border-right:1px solid #e6eef9;border-bottom:1px solid #e6eef9;border-radius:0 0 8px 8px;">
              <h2 style="margin:0 0 12px 0;color:#0b3d91;font-size:18px;">Servicio terminado</h2>
              <p style="margin:0 0 16px 0;color:#29415a;line-height:1.5;">Hola ${pilotName},</p>
              <p style="margin:0 0 18px 0;color:#445e7a;">El servicio de tu moto &mdash; <strong>orden #${worklog.id}</strong> &mdash; ha sido <strong>terminado</strong> y ya puedes pasar a recogerla.</p>
              
              <!-- Service Info Table -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin:12px 0 18px 0;border-collapse:collapse;">
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
                  <td style="padding:8px 0;color:#111827;font-weight:600;">${formattedDate}</td>
                </tr>
              </table>

              ${serviceDetailsHtml}

              <p style="margin:18px 0 0 0;color:#8b9bb3;font-size:13px;">Gracias por confiar en Taller SKM. Si tienes preguntas responde este correo.</p>
              <hr style="border:none;border-top:1px solid #eef6ff;margin:18px 0;">
              <p style="margin:0;color:#9aaec7;font-size:12px;">Taller SKM &middot; Calle Ejemplo 123 &middot; San Jos&eacute;</p>
            </td>
          </tr>
          <!-- Footer -->
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
</html>`;

  return { subject, html, attachments };
}

module.exports = { completionEmailTemplate };
