const express = require('express');
const router = express.Router();
const {
  getRankingClientes,
  getEstadisticasGenerales,
  testConnection,
  getClientesBasico,
  getTratamientosVencimientoMes
} = require('../controllers/inicio.controller');

// Test de conectividad
router.get('/test', testConnection);

// Test de clientes básico
router.get('/clientes-basico', getClientesBasico);

// Obtener ranking de clientes
router.get('/ranking-clientes', getRankingClientes);

// Obtener estadísticas generales
router.get('/estadisticas', getEstadisticasGenerales);

// Obtener tratamientos que vencen este mes
router.get('/tratamientos-vencimiento-mes', getTratamientosVencimientoMes);

module.exports = router; 