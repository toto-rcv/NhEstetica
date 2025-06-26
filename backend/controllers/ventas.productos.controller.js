const { pool } = require('../config/database');

// Obtener todas las ventas de productos (con nombre de cliente y producto)
// controllers/ventasProductos.controller.js
exports.getVentas = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT v.*, 
             c.nombre AS cliente_nombre, 
             c.apellido AS cliente_apellido,
             p.nombre AS nombre_producto,
             p.marca AS marca_producto
      FROM ventas_productos v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      LEFT JOIN productos p ON v.producto_id = p.id
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener ventas:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener una venta por ID
exports.getVentaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM ventas_productos WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear nueva venta de producto
exports.createVenta = async (req, res) => {
  const { producto_id, costo, precio, cliente_id } = req.body;

  // Validación básica
  if (!producto_id || !cliente_id) {
    return res.status(400).json({ message: 'producto_id y cliente_id son obligatorios' });
  }

  try {
    // Verificar si el cliente existe
    const [clienteRows] = await pool.execute(
      'SELECT id FROM clientes WHERE id = ?',
      [cliente_id]
    );
    if (clienteRows.length === 0) {
      return res.status(400).json({ message: `Cliente con ID ${cliente_id} no existe` });
    }

    // Verificar si el producto existe y obtener su marca
    const [productoRows] = await pool.execute(
      'SELECT id, marca FROM productos WHERE id = ?',
      [producto_id]
    );
    if (productoRows.length === 0) {
      return res.status(400).json({ message: `Producto con ID ${producto_id} no existe` });
    }

    const marca = productoRows[0].marca;

    // Insertar la venta
    const [result] = await pool.execute(
      `INSERT INTO ventas_productos (producto_id, marca, costo, precio, cliente_id, fecha)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [producto_id, marca, costo || 0, precio || 0, cliente_id]
    );

    // Retornar el ID insertado
    console.log('Venta creada con ID:', result.insertId);
    res.status(201).json({
      message: 'Venta registrada correctamente',
      id: result.insertId
    });

  } catch (err) {
    console.error('Error al registrar venta:', err);
    res.status(500).json({
      message: 'Error al registrar venta',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        sqlMessage: err.sqlMessage
      })
    });
  }
};

// Actualizar venta
exports.updateVenta = async (req, res) => {
  const { id } = req.params;
  const { producto_id, costo, precio, cliente_id } = req.body;

  try {
    // Si se está cambiando el producto, obtener la nueva marca
    let marca = null;
    if (producto_id) {
      const [productoRows] = await pool.execute(
        'SELECT marca FROM productos WHERE id = ?',
        [producto_id]
      );
      if (productoRows.length === 0) {
        return res.status(400).json({ message: `Producto con ID ${producto_id} no existe` });
      }
      marca = productoRows[0].marca;
    }

    // Construir la consulta de actualización
    let query = 'UPDATE ventas_productos SET ';
    let params = [];
    let updates = [];

    if (producto_id) {
      updates.push('producto_id = ?');
      params.push(producto_id);
    }
    if (marca) {
      updates.push('marca = ?');
      params.push(marca);
    }
    if (costo !== undefined) {
      updates.push('costo = ?');
      params.push(costo || 0);
    }
    if (precio !== undefined) {
      updates.push('precio = ?');
      params.push(precio || 0);
    }
    if (cliente_id) {
      updates.push('cliente_id = ?');
      params.push(cliente_id);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    query += updates.join(', ') + ' WHERE id = ?';
    params.push(id);

    await pool.execute(query, params);

    res.json({ message: 'Venta actualizada correctamente' });
  } catch (err) {
    console.error('Error al actualizar venta:', err);
    res.status(500).json({ message: 'Error al actualizar venta' });
  }
};

// Eliminar venta
exports.deleteVenta = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM ventas_productos WHERE id = ?', [id]);
    res.json({ message: 'Venta eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar venta:', err);
    res.status(500).json({ message: 'Error al eliminar venta' });
  }
};
