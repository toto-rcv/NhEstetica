const express = require('express');
const router = express.Router();
const { validatePersonal } = require('../middleware/personalValidation');
const {
  getPersonal,
  getPersonalById,
  createPersonal,
  updatePersonal,
  deletePersonal,
  searchPersonal
} = require('../controllers/personal.controller');

// Obtener todo el personal
router.get('/', getPersonal);

// Buscar personal por término
router.get('/search', searchPersonal);

// Obtener un empleado por ID
router.get('/:id', getPersonalById);

// Crear nuevo empleado
router.post('/', validatePersonal, createPersonal);

// Actualizar empleado
router.put('/:id', validatePersonal, updatePersonal);

// Eliminar empleado
router.delete('/:id', deletePersonal);

module.exports = router; 