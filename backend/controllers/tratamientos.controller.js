const db = require('../config/database');

exports.getAllProductos = (req, res) => {
  res.json([]);
};
exports.getProductoByNombre = (req, res) => {
  res.json({});
};
exports.getProductoById = (req, res) => {
  res.json({});
};
exports.createProducto = (req, res) => {
  res.json({ message: 'Producto creado' });
};
exports.updateProducto = (req, res) => {
  res.json({ message: 'Producto actualizado' });
};
exports.deleteProducto = (req, res) => {
  res.json({ message: 'Producto eliminado' });
};
