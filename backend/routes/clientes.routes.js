const express = require('express');
const router = express.Router();
const {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  searchClientes
} = require('../controllers/clientes.controller');

// Obtener todos los clientes
router.get('/', getClientes);

// Buscar clientes por término (opcional)
router.get('/search', searchClientes);

// Obtener cliente por ID
router.get('/:id', getClienteById);

// Crear nuevo cliente
router.post('/', createCliente);

// Actualizar cliente
router.put('/:id', updateCliente);

// Eliminar cliente
router.delete('/:id', deleteCliente);

module.exports = router;
