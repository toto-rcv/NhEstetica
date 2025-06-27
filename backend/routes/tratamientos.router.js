const express = require('express');
const router = express.Router();
const productosController = require('../controllers/tratamientos.controller');

// CRUD Productos
router.get('/', productosController.getAllProductos);
router.get('/nombre/:nombre', productosController.getProductoByNombre);
router.get('/:id', productosController.getProductoById);
router.post('/', productosController.createProducto);
router.put('/:id', productosController.updateProducto);
router.delete('/:id', productosController.deleteProducto);

module.exports = router; 