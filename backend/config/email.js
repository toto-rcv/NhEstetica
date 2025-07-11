// Configuración de Email para NH Estética
// Para usar Gmail, necesitas:
// 1. Activar la verificación en 2 pasos
// 2. Generar una contraseña de aplicación
// 3. Usar esa contraseña aquí

const emailConfig = {
  // Configuración de Gmail
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'nhestetica@gmail.com',
    pass: process.env.EMAIL_PASS || 'tu_contraseña_de_aplicacion'
  },
  
  // Configuración por defecto
  defaultFrom: process.env.EMAIL_USER || 'nhestetica@gmail.com',
  defaultTo: 'admin@nhestetica.com',
  
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