const express = require('express');
const router = express.Router();
const gerentesController = require('../controllers/gerentes.controller');
const { authenticateToken } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/gerentes - Obtener todos los gerentes
router.get('/', gerentesController.getGerentes);

// GET /api/gerentes/:id - Obtener un gerente específico
router.get('/:id', gerentesController.getGerente);

// POST /api/gerentes - Crear un nuevo gerente
router.post('/', gerentesController.createGerente);

// PUT /api/gerentes/:id - Actualizar un gerente
router.put('/:id', gerentesController.updateGerente);

// DELETE /api/gerentes/:id - Eliminar un gerente
router.delete('/:id', gerentesController.deleteGerente);

module.exports = router; 