const SibApiV3Sdk = require('sib-api-v3-sdk');
const { pool } = require('../config/database');
const emailConfig = require('../config/email');

class EmailService {
  constructor() {
    // Configurar la API key de Brevo
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKeyInstance = defaultClient.authentications['api-key'];
    apiKeyInstance.apiKey = emailConfig.apiKey;

    // Crear instancia del API para envío de emails
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
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
   * Enviar consulta desde el formulario de contacto
   * @param {Object} consulta - Datos de la consulta
   */
  async enviarConsulta(consulta) {
    try {
      const config = await this.obtenerConfiguracionEmail();
      if (!config) {
        console.error('No se encontró configuración de email');
        return false;
      }

      // Generar contenido HTML para la consulta
      const contenidoHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Nueva Consulta - NH Estética</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #667eea; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .consulta-info { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .mensaje { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📧 Nueva Consulta - NH Estética</h1>
            <p>Se ha recibido una nueva consulta desde el formulario de contacto</p>
          </div>
          
          <div class="content">
            <div class="consulta-info">
              <h3>👤 Información del Cliente</h3>
              <p><strong>Nombre:</strong> ${consulta.nombre} ${consulta.apellido}</p>
              <p><strong>Email:</strong> ${consulta.email}</p>
              <p><strong>Fecha de envío:</strong> ${consulta.fecha}</p>
            </div>

            <div class="mensaje">
              <h3>💬 Mensaje</h3>
              <p>${consulta.mensaje.replace(/\n/g, '<br>')}</p>
            </div>

            <div class="footer">
              <p><em>Esta consulta fue enviada automáticamente desde el formulario de contacto de NH Estética.</em></p>
              <p><strong>Responder a:</strong> ${consulta.email}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Configurar email para Brevo
      const sendSmtpEmail = {
        to: [{ email: config.email_destino, name: config.nombre_destinatario }],
        sender: { email: emailConfig.defaultFrom, name: 'NH Estética - Consultas' },
        subject: `📧 Nueva Consulta de ${consulta.nombre} ${consulta.apellido}`,
        htmlContent: contenidoHTML
      };

      // Enviar email con Brevo
      const data = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Consulta enviada con Brevo:', data.messageId);
      return true;

    } catch (error) {
      console.error('Error al enviar consulta con Brevo:', error);
      return false;
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
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Email</th>
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
      const usuarioNombre = cambio.usuario_nombre || 'Sistema';
      const usuarioEmail = cambio.usuario_email || 'N/A';
      const detalles = cambio.detalles || 'Sin detalles específicos';
      
      html += `
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 8px;">${usuarioNombre}</td>
          <td style="border: 1px solid #dee2e6; padding: 8px;">${usuarioEmail}</td>
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

      // Configurar email para Brevo
      const sendSmtpEmail = {
        to: [{ email: config.email_destino, name: config.nombre_destinatario }],
        sender: { email: emailConfig.defaultFrom, name: 'NH Estética' },
        subject: `📊 Reporte de Cierre de Caja - ${fechaFormateada}`,
        htmlContent: contenidoHTML
      };

      // Enviar email con Brevo
      const data = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email enviado con Brevo:', data.messageId);
      return true;

    } catch (error) {
      console.error('Error al enviar email con Brevo:', error);
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

      // Configurar email para Brevo
      const sendSmtpEmail = {
        to: [{ email: config.email_destino, name: config.nombre_destinatario }],
        sender: { email: emailConfig.defaultFrom, name: 'NH Estética' },
        subject: '🧪 Prueba de Configuración de Email - NH Estética',
        htmlContent: `
          <h2>✅ Configuración de Email Correcta</h2>
          <p>El sistema de email está funcionando correctamente con Brevo.</p>
          <p><strong>Destinatario:</strong> ${config.nombre_destinatario}</p>
          <p><strong>Email:</strong> ${config.email_destino}</p>
          <p><em>Fecha de prueba: ${new Date().toLocaleString('es-AR')}</em></p>
        `
      };

      // Enviar email con Brevo
      const data = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email de prueba enviado con Brevo:', data.messageId);
      return true;

    } catch (error) {
      console.error('Error al enviar email de prueba con Brevo:', error);
      return false;
    }
  }
}

module.exports = EmailService; 