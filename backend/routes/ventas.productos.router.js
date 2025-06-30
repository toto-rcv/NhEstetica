const express = require('express');
const router = express.Router();
const {
  getVentas,
  getVentaById,
  getVentaByIdCliente,
  createVenta,
  updateVenta,
  deleteVenta
} = require('../controllers/ventas.productos.controller');


// Todas las ventas
router.get('/', getVentas);

// Venta por ID
router.get('/:id', getVentaById);

// Ventas de un cliente
router.get('/cliente/:id', getVentaByIdCliente);

// Crear nueva venta
router.post('/', createVenta);

// Editar venta
router.put('/:id', updateVenta);

// Eliminar venta
router.delete('/:id', deleteVenta);

module.exports = router;
