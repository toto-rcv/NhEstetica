const express = require('express');
const router = express.Router();
const {
  getVentas,
  getVentaById,
  createVenta,
  updateVenta,
  deleteVenta
} = require('../controllers/ventas.tratamientos.controller');

// Todas las ventas
router.get('/', getVentas);

// Venta por ID
router.get('/:id', getVentaById);

// Crear nueva venta
router.post('/', createVenta);

// Editar venta
router.put('/:id', updateVenta);

// Eliminar venta
router.delete('/:id', deleteVenta);

module.exports = router;
