const express = require('express');
const router = express.Router();
const {
  getConfiguracionEmail,
  updateConfiguracionEmail,
  enviarEmailPrueba,
  getAuditoriaPorFecha
} = require('../controllers/email.controller');
const { authenticateToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener configuración de email
router.get('/configuracion', getConfiguracionEmail);

// Actualizar configuración de email
router.put('/configuracion', updateConfiguracionEmail);

// Enviar email de prueba
router.post('/prueba', enviarEmailPrueba);

// Obtener auditoría por fecha
router.get('/auditoria/:fecha', getAuditoriaPorFecha);

module.exports = router; 