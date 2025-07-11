const nodemailer = require('nodemailer');
const { pool } = require('../config/database');
const emailConfig = require('../config/email');

class EmailService {
  constructor() {
    // Configuración del transporter (Gmail)
    this.transporter = nodemailer.createTransport({
      service: emailConfig.service,
      auth: emailConfig.auth
    });
  }

  /**
   * Obtener configuración de email desde la base de datos
   */
  async obtenerConfiguracionEmail() {
    try {
      const [rows] = await pool.execute('SELECT * FROM configuracion_email WHERE activo = 1 LIMIT 1');
      return rows[0] || null;
    } catch (error) {
      console.error('Error al obtener configuración de email:', error);
      return null;
    }
  }

  /**
   * Generar tabla HTML para los datos de caja
   * @param {Array} datos - Datos de la tabla
   * @param {string} titulo - Título de la tabla
   * @returns {string} HTML de la tabla
   */
  generarTablaHTML(datos, titulo) {
    if (!datos || datos.length === 0) {
      return `<h3>${titulo}</h3><p>No hay datos disponibles</p>`;
    }

    const headers = Object.keys(datos[0]);
    let html = `
      <h3>${titulo}</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
    `;

    // Headers
    headers.forEach(header => {
      html += `<th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">${header}</th>`;
    });

    html += '</tr></thead><tbody>';

    // Datos
    datos.forEach(row => {
      html += '<tr>';
      headers.forEach(header => {
        const value = row[header] !== null && row[header] !== undefined ? row[header] : '-';
        html += `<td style="border: 1px solid #dee2e6; padding: 8px;">${value}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
  }

  /**
   * Generar tabla HTML para los cambios de auditoría
   * @param {Array} cambios - Lista de cambios
   * @returns {string} HTML de la tabla de auditoría
   */
  generarTablaAuditoriaHTML(cambios) {
    if (!cambios || cambios.length === 0) {
      return '<h3>Auditoría de Cambios</h3><p>No se registraron cambios en esta fecha</p>';
    }

    let html = `
      <h3>Auditoría de Cambios</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Usuario</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Acción</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Tabla</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Hora</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Detalles</th>
          </tr>
        </thead>
        <tbody>
    `;

    cambios.forEach(cambio => {
      const hora = new Date(cambio.fecha_cambio).toLocaleTimeString('es-AR');
      const detalles = cambio.datos_nuevos ? 'Datos modificados' : 'Sin detalles';
      
      html += `
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 8px;">${cambio.usuario_nombre || 'Sistema'}</td>
          <td style="border: 1px solid #dee2e6; padding: 8px;">${cambio.accion}</td>
          <td style="border: 1px solid #dee2e6; padding: 8px;">${cambio.tabla}</td>
          <td style="border: 1px solid #dee2e6; padding: 8px;">${hora}</td>
          <td style="border: 1px solid #dee2e6; padding: 8px;">${detalles}</td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    return html;
  }

  /**
   * Enviar reporte de cierre de caja por email
   * @param {string} fecha - Fecha del cierre
   * @param {Object} datosCaja - Datos de la caja
   * @param {Array} ingresos - Lista de ingresos
   * @param {Array} egresos - Lista de egresos
   * @param {Array} cambios - Lista de cambios de auditoría
   */
  async enviarReporteCierreCaja(fecha, datosCaja, ingresos, egresos, cambios) {
    try {
      const config = await this.obtenerConfiguracionEmail();
      if (!config) {
        console.error('No se encontró configuración de email');
        return false;
      }

      const fechaFormateada = new Date(fecha).toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Generar contenido HTML
      let contenidoHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Reporte de Cierre de Caja - ${fechaFormateada}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #667eea; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .summary { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .total { font-weight: bold; color: #28a745; }
            .warning { color: #dc3545; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Reporte de Cierre de Caja</h1>
            <h2>${fechaFormateada}</h2>
          </div>
          
          <div class="content">
            <div class="summary">
              <h3>📋 Resumen de Caja</h3>
              <p><strong>Fecha:</strong> ${fechaFormateada}</p>
              <p><strong>Monto de Apertura:</strong> $${parseFloat(datosCaja.monto_apertura || 0).toFixed(2)}</p>
              <p><strong>Monto de Cierre:</strong> $${parseFloat(datosCaja.monto_cierre || 0).toFixed(2)}</p>
              <p><strong>Diferencia:</strong> $${(parseFloat(datosCaja.monto_cierre || 0) - parseFloat(datosCaja.monto_apertura || 0)).toFixed(2)}</p>
            </div>
      `;

      // Agregar tabla de ingresos
      contenidoHTML += this.generarTablaHTML(ingresos, '💰 Ingresos del Día');

      // Agregar tabla de egresos
      contenidoHTML += this.generarTablaHTML(egresos, '💸 Egresos del Día');

      // Agregar tabla de auditoría
      contenidoHTML += this.generarTablaAuditoriaHTML(cambios);

      // Agregar resumen de cambios por usuario
      if (cambios && cambios.length > 0) {
        const usuariosUnicos = [...new Set(cambios.map(c => c.usuario_nombre).filter(Boolean))];
        if (usuariosUnicos.length > 0) {
          contenidoHTML += `
            <div class="summary">
              <h3>👥 Usuarios que realizaron cambios:</h3>
              <ul>
                ${usuariosUnicos.map(usuario => `<li>${usuario}</li>`).join('')}
              </ul>
            </div>
          `;
        }
      }

      contenidoHTML += `
            <div class="summary">
              <p><em>Este reporte fue generado automáticamente al cerrar la caja del día.</em></p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Configurar email
      const mailOptions = {
        from: process.env.EMAIL_USER || 'nhestetica@gmail.com',
        to: config.email_destino,
        subject: `📊 Reporte de Cierre de Caja - ${fechaFormateada}`,
        html: contenidoHTML
      };

      // Enviar email
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado:', info.messageId);
      return true;

    } catch (error) {
      console.error('Error al enviar email:', error);
      return false;
    }
  }

  /**
   * Enviar email de prueba
   */
  async enviarEmailPrueba() {
    try {
      const config = await this.obtenerConfiguracionEmail();
      if (!config) {
        throw new Error('No se encontró configuración de email');
      }

      const mailOptions = {
        from: process.env.EMAIL_USER || 'nhestetica@gmail.com',
        to: config.email_destino,
        subject: '🧪 Prueba de Configuración de Email - NH Estética',
        html: `
          <h2>✅ Configuración de Email Correcta</h2>
          <p>El sistema de envío de emails está funcionando correctamente.</p>
          <p><strong>Destinatario:</strong> ${config.nombre_destinatario}</p>
          <p><strong>Email:</strong> ${config.email_destino}</p>
          <p><em>Fecha de prueba: ${new Date().toLocaleString('es-AR')}</em></p>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email de prueba enviado:', info.messageId);
      return true;

    } catch (error) {
      console.error('Error al enviar email de prueba:', error);
      return false;
    }
  }
}

module.exports = new EmailService(); 