const db = require('../config/database');

// Obtener todos los productos
exports.getAllProductos = async (req, res) => {
  try {
    const { query } = req.query;
    let sql = 'SELECT * FROM productos';
    let params = [];

    if (query) {
      sql += ' WHERE nombre LIKE ? OR marca LIKE ? OR subtitle LIKE ?';
      params = [`%${query}%`, `%${query}%`, `%${query}%`];
    }

    const [results] = await db.pool.query(sql, params);
    
    // Convertir benefits de JSON string a array si existe
    const productos = results.map(producto => ({
      ...producto,
      benefits: producto.benefits ? JSON.parse(producto.benefits) : []
    }));
    
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos', error: err });
  }
};

// Obtener producto por ID
exports.getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    
    const producto = results[0];
    // Convertir benefits de JSON string a array si existe
    producto.benefits = producto.benefits ? JSON.parse(producto.benefits) : [];
    
    res.json(producto);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener producto', error: err });
  }
};

// Crear producto
exports.createProducto = async (req, res) => {
  const { 
    nombre, 
    precio, 
    descripcion, 
    imagen, 
    categoria, 
    marca, 
    subtitle, 
    isNatural, 
    isVegan, 
    benefits 
  } = req.body;
  
  if (!nombre || !precio) {
    return res.status(400).json({ message: 'Nombre y precio son obligatorios' });
  }
  
  try {
    // Convertir benefits de array a JSON string si existe
    const benefitsJson = benefits && Array.isArray(benefits) ? JSON.stringify(benefits) : null;
    
    const [result] = await db.pool.query(
      `INSERT INTO productos (
        nombre, precio, descripcion, imagen, categoria, marca, 
        subtitle, isNatural, isVegan, benefits
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre, precio, descripcion, imagen, categoria, marca,
        subtitle, isNatural || false, isVegan || false, benefitsJson
      ]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      nombre, precio, descripcion, imagen, categoria, marca,
      subtitle, isNatural: isNatural || false, isVegan: isVegan || false, benefits
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear producto', error: err });
  }
};

// Actualizar producto
exports.updateProducto = async (req, res) => {
  const { id } = req.params;
  const { 
    nombre, 
    precio, 
    descripcion, 
    imagen, 
    categoria, 
    marca, 
    subtitle, 
    isNatural, 
    isVegan, 
    benefits 
  } = req.body;
  
  try {
    // Convertir benefits de array a JSON string si existe
    const benefitsJson = benefits && Array.isArray(benefits) ? JSON.stringify(benefits) : null;
    
    await db.pool.query(
      `UPDATE productos SET 
        nombre=?, precio=?, descripcion=?, imagen=?, categoria=?, marca=?,
        subtitle=?, isNatural=?, isVegan=?, benefits=?
       WHERE id=?`,
      [
        nombre, precio, descripcion, imagen, categoria, marca,
        subtitle, isNatural || false, isVegan || false, benefitsJson, id
      ]
    );
    
    res.json({ 
      id, nombre, precio, descripcion, imagen, categoria, marca,
      subtitle, isNatural: isNatural || false, isVegan: isVegan || false, benefits
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar producto', error: err });
  }
};

// Obtener producto por nombre exacto
exports.getProductoByNombre = async (req, res) => {
  const { nombre } = req.params;
  try {
    const [results] = await db.pool.query('SELECT * FROM productos WHERE nombre = ?', [nombre]);
    if (results.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    
    const producto = results[0];
    // Convertir benefits de JSON string a array si existe
    producto.benefits = producto.benefits ? JSON.parse(producto.benefits) : [];
    
    res.json(producto);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener producto', error: err });
  }
};

// Eliminar producto
exports.deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    await db.pool.query('DELETE FROM productos WHERE id = ?', [id]);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar producto', error: err });
  }
}; 