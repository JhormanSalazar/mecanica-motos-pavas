const PDFDocument = require('pdfkit');

/**
 * Genera un PDF profesional con la información del WorkLog (Versión Modernizada)
 * @param {Object} worklog - WorkLog completo con pilot y results
 * @returns {PDFDocument} - Documento PDF stream
 */
function generateWorklogPDF(worklog) {
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 40, bottom: 40, left: 50, right: 50 },
    bufferPages: true, // Permite numeración de páginas si fuera necesario
  });

  // Paleta de colores Premium
  const colors = {
    primary: '#1a202c',    // Slate oscuro
    accent: '#3182ce',     // Azul corporativo
    success: '#2f855a',    // Verde esmeralda
    danger: '#e53e3e',     // Rojo suave
    background: '#f7fafc', // Gris casi blanco
    border: '#e2e8f0',     // Gris de borde
    textLight: '#718096'   // Gris de soporte
  };

  // --- HEADER ---
  // Fondo decorativo en el encabezado
  doc.rect(0, 0, 612, 100).fill(colors.background);

  doc
    .fillColor(colors.primary)
    .fontSize(22)
    .font('Helvetica-Bold')
    .text('INFORME DE SERVICIO', 50, 45);

  doc
    .fontSize(10)
    .font('Helvetica')
    .fillColor(colors.accent)
    .text('TALLER SKM', 50, 70, { characterSpacing: 2 });

  // Badge del ID de Servicio en el header
  const idText = `ORDEN #${worklog.id}`;
  const idWidth = doc.widthOfString(idText) + 20;
  doc
    .roundedRect(562 - idWidth, 42, idWidth, 25, 4)
    .fill(colors.primary);
  
  doc
    .fillColor('#ffffff')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text(idText, 562 - idWidth, 50, { width: idWidth, align: 'center' });

  doc.moveDown(4);

  // --- INFORMACIÓN DEL SERVICIO (GRID) ---
  const startY = 120;
  
  // Título de sección con barra lateral de acento
  doc.rect(50, startY, 3, 15).fill(colors.accent);
  doc
    .fillColor(colors.primary)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('DETALLES TÉCNICOS', 60, startY + 2);

  doc.moveDown(1.5);

  const colWidth = 250;
  const labelX = 50;
  const valueX = 140;
  const rightColLabelX = 310;
  const rightColValueX = 400;

  function drawInfoRow(label, value, xLabel, xValue, y) {
    doc.fontSize(9).font('Helvetica-Bold').fillColor(colors.textLight).text(label.toUpperCase(), xLabel, y);
    doc.fontSize(10).font('Helvetica').fillColor(colors.primary).text(value || 'N/A', xValue, y);
  }

  let infoY = doc.y;
  drawInfoRow('Piloto', worklog.pilot?.name, labelX, valueX, infoY);
  drawInfoRow('Horas', `${worklog.hours} hrs`, rightColLabelX, rightColValueX, infoY);
  
  infoY += 22;
  drawInfoRow('Motocicleta', worklog.pilot?.bikeType, labelX, valueX, infoY);
  const fecha = new Date(worklog.createdAt).toLocaleDateString('es-CR', { 
    year: 'numeric', month: 'short', day: 'numeric' 
  });
  drawInfoRow('Fecha', fecha, rightColLabelX, rightColValueX, infoY);

  infoY += 22;
  drawInfoRow('Servicio', worklog.type, labelX, valueX, infoY);

  doc.y = infoY + 40;

  // --- TABLA DE ITEMS ---
  function renderModernTable(doc, title, items) {
    if (!items || items.length === 0) return;

    // Título de la tabla
    doc.rect(50, doc.y, 3, 15).fill(colors.accent);
    doc
      .fillColor(colors.primary)
      .fontSize(11)
      .font('Helvetica-Bold')
      .text(title.toUpperCase(), 60, doc.y + 2);
    
    doc.moveDown(1);

    const tableTop = doc.y;
    const col1 = 50;  // Nombre
    const col2 = 360; // Observaciones
    const col3 = 480; // Estado
    const width = 512;

    // Header de Tabla
    doc.fillColor(colors.textLight).fontSize(8).font('Helvetica-Bold');
    doc.text('DESCRIPCIÓN DEL TRABAJO', col1 + 5, tableTop);
    doc.text('OBSERVACIONES', col2, tableTop);
    doc.text('ESTADO', col3, tableTop, { width: 82, align: 'center' });
    
    doc.moveDown(0.5);
    doc.moveTo(col1, doc.y).lineTo(col1 + width, doc.y).strokeColor(colors.border).lineWidth(1).stroke();
    doc.moveDown(0.8);

    items.forEach((item, index) => {
      const rowY = doc.y;
      const itemDesc = item.name;
      const itemObs = item.obs || '-';
      const itemStatus = item.status || 'N/A';

      // Cálculo de altura de fila basado en contenido
      const descHeight = doc.heightOfString(itemDesc, { width: 300 });
      const obsHeight = doc.heightOfString(itemObs, { width: 110 });
      const rowHeight = Math.max(descHeight, obsHeight) + 12;

      // Salto de página inteligente
      if (rowY + rowHeight > doc.page.height - 70) doc.addPage();

      // Fondo alternado sutil
      if (index % 2 === 0) {
        doc.rect(col1, doc.y - 6, width, rowHeight).fill('#fafafa');
      }

      doc.fillColor(colors.primary).fontSize(9).font('Helvetica');
      doc.text(itemDesc, col1 + 5, doc.y, { width: 300 });

      doc.fillColor(colors.textLight).fontSize(8).font('Helvetica-Oblique');
      doc.text(itemObs, col2, rowY, { width: 110 });

      // Badge de estado
      const statusColor = itemStatus === 'SI' ? colors.success : itemStatus === 'NO' ? colors.danger : colors.textLight;
      doc.font('Helvetica-Bold').fillColor(statusColor).fontSize(9);
      doc.text(itemStatus, col3, rowY, { width: 82, align: 'center' });

      doc.y = rowY + rowHeight;
      // Línea divisoria muy tenue
      doc.moveTo(col1, doc.y - 4).lineTo(col1 + width, doc.y - 4).strokeColor('#f0f0f0').stroke();
    });

    doc.moveDown(2);
  }

  const checklistItems = worklog.results.filter((r) => !r.isCustom);
  const customItems = worklog.results.filter((r) => r.isCustom);

  renderModernTable(doc, 'Trabajos Realizados', checklistItems);
  
  const customTitle = worklog.type === 'ALISTAMIENTO' ? 'Trabajos Adicionales' : 'Reparaciones';
  renderModernTable(doc, customTitle, customItems);

  // --- FOOTER Y CIERRE ---
  const footerY = doc.page.height - 130;
  
  // Caja de agradecimiento minimalista
  doc
    .roundedRect(50, footerY, 512, 60, 8)
    .fill(colors.background);
  
  doc
    .fillColor(colors.primary)
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('Gracias por su confianza', 50, footerY + 15, { align: 'center', width: 512 });
  
  doc
    .fillColor(colors.textLight)
    .fontSize(9)
    .font('Helvetica')
    .text('Este reporte técnico certifica los servicios realizados en nuestras instalaciones.', 50, footerY + 32, { align: 'center', width: 512 });

  // Metadatos finales
  const stamp = `Generado: ${new Date().toLocaleDateString('es-CR')} ${new Date().toLocaleTimeString('es-CR')}`;
  doc
    .fontSize(7)
    .fillColor(colors.textLight)
    .text(stamp, 50, footerY + 75, { align: 'left' })
    .text('TALLER SKM', 50, footerY + 75, { align: 'right' });

  return doc;
}

module.exports = { generateWorklogPDF };