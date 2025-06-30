const express = require('express');
const router = express.Router();
const tratamientosController = require('../controllers/tratamientos.controller');

// CRUD Tratamientos
router.get('/', tratamientosController.getAllTratamientos);
router.get('/nombre/:nombre', tratamientosController.getTratamientoByNombre);
router.get('/:id', tratamientosController.getTratamientoById);
router.post('/', tratamientosController.createTratamiento);
router.put('/:id', tratamientosController.updateTratamiento);
router.delete('/:id', tratamientosController.deleteTratamiento);

module.exports = router; 