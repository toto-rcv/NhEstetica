const express = require('express');
const router = express.Router();
const {
  crearConsulta,
  obtenerConsultas
} = require('../controllers/consulta.controller');
const { authenticateToken } = require('../middleware/auth');

// Ruta pública para crear consultas (sin autenticación)
router.post('/crear', crearConsulta);

// Rutas protegidas para administración (requieren autenticación)
router.use(authenticateToken);

// Obtener todas las consultas (solo para administradores)
router.get('/admin', obtenerConsultas);

module.exports = router; 