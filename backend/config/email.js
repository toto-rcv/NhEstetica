// Configuración de Email para NH Estética con Brevo
// Para usar Brevo, necesitas:
// 1. Crear una cuenta en Brevo (https://www.brevo.com/)
// 2. Generar una API Key desde el panel de control
// 3. Usar esa API Key aquí

const emailConfig = {
  // Configuración de Brevo
  provider: 'brevo',
  apiKey: process.env.BREVO_API_KEY || '',
  
  // Configuración por defecto
  defaultFrom: process.env.EMAIL_FROM || 'blackflameroma@gmail.com',
  defaultTo: 'tomas.rcv@gmail.com',
  
  // Configuración de templates
  templates: {
    cierreCaja: {
      subject: '📊 Reporte de Cierre de Caja - {fecha}',
      subjectPrefix: '📊 Reporte de Cierre de Caja'
    },
    prueba: {
      subject: '🧪 Prueba de Configuración de Email - NH Estética'
    }
  }
};

module.exports = emailConfig; 