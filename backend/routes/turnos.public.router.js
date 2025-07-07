const express = require('express');
const router = express.Router();
const turnosController = require('../controllers/turnos.controller');

// Rutas públicas para turnos (sin autenticación)
router.get('/horarios-disponibles', turnosController.getHorariosDisponibles);
router.post('/', turnosController.createTurno);

module.exports = router; 