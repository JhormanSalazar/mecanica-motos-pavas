const PDFDocument = require('pdfkit');

/**
 * Genera un PDF profesional con la información del WorkLog
 * @param {Object} worklog - WorkLog completo con pilot y results
 * @returns {PDFDocument} - Documento PDF stream
 */
function generateWorklogPDF(worklog) {
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
  });

  // Colores corporativos
  const primaryColor = '#2c3e50';
  const accentColor = '#3498db';
  const lightGray = '#ecf0f1';
  const darkGray = '#7f8c8d';

  // Header con logo/título
  doc
    .fillColor(primaryColor)
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('INFORME DE SERVICIO', { align: 'center' });

  doc
    .moveDown(0.3)
    .fontSize(10)
    .fillColor(darkGray)
    .font('Helvetica')
    .text('TALLER SKM', { align: 'center' });

  // Línea separadora
  doc
    .moveDown(1)
    .strokeColor(accentColor)
    .lineWidth(2)
    .moveTo(50, doc.y)
    .lineTo(562, doc.y)
    .stroke();

  doc.moveDown(1.5);

  // Información del servicio
  doc
    .fontSize(12)
    .fillColor(primaryColor)
    .font('Helvetica-Bold')
    .text('INFORMACIÓN DEL SERVICIO', { underline: true });

  doc.moveDown(0.5);

  const infoLeft = 50;
  const infoRight = 320;
  const labelWidth = 100;
  let currentY = doc.y;

  // Columna izquierda
  doc.fontSize(10).font('Helvetica-Bold').fillColor(darkGray);
  doc.text('Piloto:', infoLeft, currentY, { width: labelWidth, continued: false });
  doc.font('Helvetica').fillColor(primaryColor);
  doc.text(worklog.pilot?.name || 'Sin Asignar', infoLeft + labelWidth, currentY, { continued: false });

  currentY += 20;
  doc.font('Helvetica-Bold').fillColor(darkGray);
  doc.text('Tipo de Moto:', infoLeft, currentY, { width: labelWidth, continued: false });
  doc.font('Helvetica').fillColor(primaryColor);
  doc.text(worklog.pilot?.bikeType || 'N/A', infoLeft + labelWidth, currentY, { continued: false });

  currentY += 20;
  doc.font('Helvetica-Bold').fillColor(darkGray);
  doc.text('Tipo de Servicio:', infoLeft, currentY, { width: labelWidth, continued: false });
  doc.font('Helvetica').fillColor(primaryColor);
  doc.text(worklog.type, infoLeft + labelWidth, currentY, { continued: false });

  // Columna derecha
  currentY = doc.y - 60; // Volver arriba para la columna derecha
  doc.font('Helvetica-Bold').fillColor(darkGray);
  doc.text('Horas:', infoRight, currentY, { width: labelWidth, continued: false });
  doc.font('Helvetica').fillColor(primaryColor);
  doc.text(`${worklog.hours} hrs`, infoRight + labelWidth, currentY, { continued: false });

  currentY += 20;
  doc.font('Helvetica-Bold').fillColor(darkGray);
  doc.text('Fecha:', infoRight, currentY, { width: labelWidth, continued: false });
  doc.font('Helvetica').fillColor(primaryColor);
  const fecha = new Date(worklog.createdAt).toLocaleDateString('es-CR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(fecha, infoRight + labelWidth, currentY, { continued: false });

  currentY += 20;
  doc.font('Helvetica-Bold').fillColor(darkGray);
  doc.text('ID Servicio:', infoRight, currentY, { width: labelWidth, continued: false });
  doc.font('Helvetica').fillColor(primaryColor);
  doc.text(`#${worklog.id}`, infoRight + labelWidth, currentY, { continued: false });

  doc.y = currentY + 30;

  // Separar items en dos categorías
  const checklistItems = worklog.results.filter((r) => !r.isCustom);
  const customItems = worklog.results.filter((r) => r.isCustom);

  // Sección: Trabajos Realizados (Checklist)
  if (checklistItems.length > 0) {
    doc
      .moveDown(1)
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text('TRABAJOS REALIZADOS', 50, doc.y, { underline: true, continued: false });

    doc.moveDown(0.5);

    checklistItems.forEach((item, index) => {
      // Fondo alternado para mejor legibilidad
      if (index % 2 === 0) {
        doc
          .rect(50, doc.y - 5, 512, 20)
          .fillColor(lightGray)
          .fillAndStroke(lightGray, lightGray);
      }

      doc.fontSize(10).font('Helvetica').fillColor(primaryColor);
      const itemY = doc.y;

      // Nombre del item (450px de ancho)
      doc.text(`• ${item.name}`, 60, itemY, { width: 400, continued: false });

      // Estado a la derecha
      const statusText = item.status || 'N/A';
      const statusColor = item.status === 'SI' ? '#27ae60' : item.status === 'NO' ? '#e74c3c' : darkGray;
      doc.fillColor(statusColor).text(statusText, 480, itemY, { width: 70, align: 'right', continued: false });

      doc.fillColor(primaryColor);

      // Observaciones si hay (en nueva línea, separadas)
      if (item.obs) {
        doc.moveDown(0.5);
        doc
          .fontSize(9)
          .font('Helvetica-Oblique')
          .fillColor(darkGray)
          .text(`   Obs: ${item.obs}`, 60, doc.y, { width: 490, continued: false });
        doc.font('Helvetica');
      }

      doc.moveDown(0.5);
    });
  }

  // Sección: Trabajos Adicionales / Reparaciones (Items Custom)
  if (customItems.length > 0) {
    doc.moveDown(1);

    // Título según el tipo de worklog
    const customTitle = worklog.type === 'ALISTAMIENTO' ? 'TRABAJOS ADICIONALES' : 'REPARACIONES';

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text(customTitle, 50, doc.y, { underline: true, continued: false });

    doc.moveDown(0.5);

    customItems.forEach((item, index) => {
      // Fondo alternado
      if (index % 2 === 0) {
        doc
          .rect(50, doc.y - 5, 512, 20)
          .fillColor(lightGray)
          .fillAndStroke(lightGray, lightGray);
      }

      doc.fontSize(10).font('Helvetica').fillColor(primaryColor);
      const itemY = doc.y;

      // Nombre del item (450px de ancho)
      doc.text(`• ${item.name}`, 60, itemY, { width: 400, continued: false });

      // Estado a la derecha
      const statusText = item.status || 'N/A';
      const statusColor = item.status === 'SI' ? '#27ae60' : item.status === 'NO' ? '#e74c3c' : darkGray;
      doc.fillColor(statusColor).text(statusText, 480, itemY, { width: 70, align: 'right', continued: false });

      doc.fillColor(primaryColor);

      // Observaciones si hay (en nueva línea, separadas)
      if (item.obs) {
        doc.moveDown(0.5);
        doc
          .fontSize(9)
          .font('Helvetica-Oblique')
          .fillColor(darkGray)
          .text(`   Obs: ${item.obs}`, 60, doc.y, { width: 490, continued: false });
        doc.font('Helvetica');
      }

      doc.moveDown(0.5);
    });
  }

  // Footer
  const bottomY = 700;
  doc
    .fontSize(8)
    .fillColor(darkGray)
    .text(
      `Generado el ${new Date().toLocaleDateString('es-CR')} a las ${new Date().toLocaleTimeString('es-CR')}`,
      50,
      bottomY,
      { align: 'center' }
    );

  doc
    .fontSize(7)
    .text('Este documento es un informe generado automáticamente', 50, bottomY + 15, {
      align: 'center',
    });

  return doc;
}

module.exports = { generateWorklogPDF };
