const db = require('../config/database');

// Obtener todos los productos
exports.getAllProductos = async (req, res) => {
  try {
    const { query } = req.query;
    let sql = 'SELECT * FROM productos';
    let params = [];

    if (query) {
      sql += ' WHERE nombre LIKE ? OR marca LIKE ? OR subtitulo LIKE ?';
      params = [`%${query}%`, `%${query}%`, `%${query}%`];
    }

    const [results] = await db.pool.query(sql, params);
    
    // Mapear campos de la base de datos a los nombres esperados por el frontend
    const productos = results.map(producto => ({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      subtitle: producto.subtitulo,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      categoria: producto.categoria,
      marca: producto.marca,
      isNatural: producto.natural,
      isVegan: producto.vegano,
      benefits: producto.beneficios ? JSON.parse(producto.beneficios) : []
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
    // Mapear campos de la base de datos a los nombres esperados por el frontend
    const productoMapeado = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      subtitle: producto.subtitulo,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      categoria: producto.categoria,
      marca: producto.marca,
      isNatural: producto.natural,
      isVegan: producto.vegano,
      benefits: producto.beneficios ? JSON.parse(producto.beneficios) : []
    };
    
    res.json(productoMapeado);
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
        subtitulo, \`natural\`, vegano, beneficios
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
        subtitulo=?, \`natural\`=?, vegano=?, beneficios=?
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
    // Mapear campos de la base de datos a los nombres esperados por el frontend
    const productoMapeado = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      subtitle: producto.subtitulo,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      categoria: producto.categoria,
      marca: producto.marca,
      isNatural: producto.natural,
      isVegan: producto.vegano,
      benefits: producto.beneficios ? JSON.parse(producto.beneficios) : []
    };
    
    res.json(productoMapeado);
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