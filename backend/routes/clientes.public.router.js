const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.controller');

// Rutas públicas para clientes (sin autenticación)
router.get('/by-email/:email', clientesController.getClienteByEmail);

module.exports = router; 