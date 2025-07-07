const db = require('../config/database');

// Obtener todos los productos con paginación
exports.getAllProductos = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    // Convertir a números y validar
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Máximo 100 elementos por página
    const offset = (pageNum - 1) * limitNum;

    // Construir la consulta base para filtros
    let whereClause = '';
    let params = [];
    
    if (query) {
      whereClause = ' WHERE nombre LIKE ? OR marca LIKE ? OR subtitulo LIKE ?';
      params = [`%${query}%`, `%${query}%`, `%${query}%`];
    }

    // Consulta para obtener el total de registros
    const countSql = `SELECT COUNT(*) as total FROM productos${whereClause}`;
    const [countResults] = await db.pool.query(countSql, params);
    const totalItems = countResults[0].total;
    const totalPages = Math.ceil(totalItems / limitNum);

    // Consulta para obtener los productos paginados
    const sql = `SELECT * FROM productos${whereClause} ORDER BY id DESC LIMIT ?, ?`;
    const queryParams = [...params, offset, limitNum];
    
    // Debug log
    console.log('Pagination query:', sql);
    console.log('Query params:', queryParams);
    console.log('pageNum:', pageNum, 'limitNum:', limitNum, 'offset:', offset);
    
    const [results] = await db.pool.query(sql, queryParams);
    
    // Mapear campos de la base de datos a los nombres esperados por el frontend
    const productos = results.map(producto => ({
      id: producto.id,
      nombre: producto.nombre,
      costo: producto.costo, 
      precio: producto.precio,
      subtitle: producto.subtitulo,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      categoria: producto.categoria,
      marca: producto.marca,
      isNatural: Boolean(producto.natural) && producto.natural !== '0' && producto.natural !== 0,
      isVegan: Boolean(producto.vegano) && producto.vegano !== '0' && producto.vegano !== 0,
      benefits: producto.beneficios ? JSON.parse(producto.beneficios) : [],
      modoUso: producto.modo_uso ? JSON.parse(producto.modo_uso) : []
    }));
    
    // Respuesta con datos de paginación
    res.json({
      data: productos,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalItems: totalItems,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
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
      costo: producto.costo,
      precio: producto.precio,
      subtitle: producto.subtitulo,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      categoria: producto.categoria,
      marca: producto.marca,
      isNatural: Boolean(producto.natural) && producto.natural !== '0' && producto.natural !== 0,
      isVegan: Boolean(producto.vegano) && producto.vegano !== '0' && producto.vegano !== 0,
      benefits: producto.beneficios ? JSON.parse(producto.beneficios) : [],
      modoUso: producto.modo_uso ? JSON.parse(producto.modo_uso) : []
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
    costo,
    precio, 
    descripcion, 
    imagen, 
    categoria, 
    marca, 
    subtitle, 
    isNatural, 
    isVegan, 
    benefits,
    modoUso
  } = req.body;
  
  console.log('Datos recibidos en createProducto:', { nombre, costo, precio, categoria, marca });
  
  if (!nombre || !precio || costo === undefined || costo === null) {
    return res.status(400).json({ message: 'Nombre, costo y precio son obligatorios' });
  }

  
  try {
    // Convertir benefits de array a JSON string si existe
    const benefitsJson = benefits && Array.isArray(benefits) ? JSON.stringify(benefits) : null;
    
    // Convertir modoUso de array a JSON string si existe
    const modoUsoJson = modoUso && Array.isArray(modoUso) ? JSON.stringify(modoUso) : null;
    
    const [result] = await db.pool.query(
      `INSERT INTO productos (
        nombre, costo, precio, descripcion, imagen, categoria, marca,
        subtitulo, \`natural\`, vegano, beneficios, modo_uso
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre, costo, precio, descripcion, imagen, categoria, marca,
        subtitle, isNatural || false, isVegan || false, benefitsJson, modoUsoJson
      ]
    );

    
    res.status(201).json({ 
      id: result.insertId, 
      nombre, costo, precio, descripcion, imagen, categoria, marca,
      subtitle, isNatural: isNatural || false, isVegan: isVegan || false, benefits, modoUso
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
    costo,
    precio, 
    descripcion, 
    imagen, 
    categoria, 
    marca, 
    subtitle, 
    isNatural, 
    isVegan, 
    benefits,
    modoUso
  } = req.body;
  
  try {
    // Convertir benefits de array a JSON string si existe
    const benefitsJson = benefits && Array.isArray(benefits) ? JSON.stringify(benefits) : null;
    
    // Convertir modoUso de array a JSON string si existe
    const modoUsoJson = modoUso && Array.isArray(modoUso) ? JSON.stringify(modoUso) : null;
    
    await db.pool.query(
      `UPDATE productos SET 
        nombre=?, costo=?, precio=?, descripcion=?, imagen=?, categoria=?, marca=?,
        subtitulo=?, \`natural\`=?, vegano=?, beneficios=?, modo_uso=?
       WHERE id=?`,
      [
        nombre, costo, precio, descripcion, imagen, categoria, marca,
        subtitle, isNatural || false, isVegan || false, benefitsJson, modoUsoJson, id
      ]
    );
    
    res.json({ 
      id, nombre, costo, precio, descripcion, imagen, categoria, marca,
      subtitle, isNatural: isNatural || false, isVegan: isVegan || false, benefits, modoUso
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
      costo: producto.costo,
      precio: producto.precio,
      subtitle: producto.subtitulo,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      categoria: producto.categoria,
      marca: producto.marca,
      isNatural: Boolean(producto.natural) && producto.natural !== '0' && producto.natural !== 0,
      isVegan: Boolean(producto.vegano) && producto.vegano !== '0' && producto.vegano !== 0,
      benefits: producto.beneficios ? JSON.parse(producto.beneficios) : [],
      modoUso: producto.modo_uso ? JSON.parse(producto.modo_uso) : []
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
    // Primero verificar si el producto existe
    const [productoExiste] = await db.pool.query('SELECT id, nombre FROM productos WHERE id = ?', [id]);
    
    if (productoExiste.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar si el producto está siendo usado en ventas (solo para información)
    const [ventasProducto] = await db.pool.query(
      'SELECT COUNT(*) as count FROM ventas_productos WHERE producto_id = ?', 
      [id]
    );

    // Proceder con la eliminación directamente
    const [result] = await db.pool.query('DELETE FROM productos WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Mensaje informativo sobre las ventas asociadas
    let message = `Producto "${productoExiste[0].nombre}" eliminado correctamente`;
    if (ventasProducto[0].count > 0) {
      message += `. Nota: ${ventasProducto[0].count} venta(s) histórica(s) asociada(s) se mantienen intactas.`;
    }

    res.json({ 
      message: message,
      deletedId: id,
      ventasAsociadas: ventasProducto[0].count
    });
    
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    
    // Manejar errores específicos de MySQL
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ 
        message: 'No se puede eliminar el producto porque está siendo usado en otras partes del sistema. Primero debe eliminar las referencias asociadas.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Error interno del servidor al eliminar producto', 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
  }
}; 