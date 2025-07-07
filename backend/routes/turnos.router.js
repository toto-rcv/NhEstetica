const express = require('express');
const router = express.Router();
const turnosController = require('../controllers/turnos.controller');

// Rutas para turnos
router.get('/', turnosController.getAllTurnos);
router.get('/fecha/:fecha', turnosController.getTurnosByFecha);
router.get('/horarios-disponibles', turnosController.getHorariosDisponibles);
router.get('/configuracion-horarios', turnosController.getConfiguracionHorarios);
router.get('/:id', turnosController.getTurnoById);
router.post('/', turnosController.createTurno);
router.put('/:id', turnosController.updateTurno);
router.put('/configuracion-horarios', turnosController.updateConfiguracionHorarios);
router.delete('/:id', turnosController.deleteTurno);

module.exports = router; 