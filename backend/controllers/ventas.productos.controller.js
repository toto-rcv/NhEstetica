const { pool } = require('../config/database');

// Obtener todas las ventas (con datos de cliente y producto)
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

// Obtener todas las ventas de un cliente específico
exports.getVentaByIdCliente = async (req, res) => {
  const { id } = req.params;

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
      WHERE v.cliente_id = ?
      ORDER BY v.fecha DESC
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron ventas para este cliente' });
    }

    res.json(rows);
  } catch (err) {
    console.error('Error al obtener ventas por cliente:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear nueva venta
exports.createVenta = async (req, res) => {
  const {
    producto_id,
    costo,
    precio,
    cantidad,
    cliente_id,
    fecha,
    forma_de_pago,
    cuotas,
    observacion
  } = req.body;

  if (!producto_id || !cliente_id) {
    return res.status(400).json({ message: 'producto_id y cliente_id son obligatorios' });
  }

  try {
    const [clienteRows] = await pool.execute('SELECT id FROM clientes WHERE id = ?', [cliente_id]);
    if (clienteRows.length === 0) {
      return res.status(400).json({ message: `Cliente con ID ${cliente_id} no existe` });
    }

    const [productoRows] = await pool.execute('SELECT id, marca FROM productos WHERE id = ?', [producto_id]);
    if (productoRows.length === 0) {
      return res.status(400).json({ message: `Producto con ID ${producto_id} no existe` });
    }

    const marca = productoRows[0].marca;

    const [result] = await pool.execute(
      `INSERT INTO ventas_productos 
       (producto_id, cliente_id, costo, precio, cantidad, fecha, forma_de_pago, cuotas, observacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        producto_id,
        cliente_id,
        costo || 0,
        precio || 0,
        cantidad || 1,
        fecha || null,
        forma_de_pago || '',
        cuotas || null,
        observacion || ''
      ]
    );

    res.status(201).json({
      message: 'Venta registrada correctamente',
      id: result.insertId
    });
  } catch (err) {
    console.error('Error al registrar venta:', err);
    res.status(500).json({ message: 'Error al registrar venta' });
  }
};

exports.updateVenta = async (req, res) => {
  const { id } = req.params;
  const {
    producto_id,
    costo,
    precio,
    cantidad,
    cliente_id,
    forma_de_pago,
    cuotas,
    observacion
  } = req.body;

  try {
    if (producto_id) {
      const [productoRows] = await pool.execute('SELECT id FROM productos WHERE id = ?', [producto_id]);
      if (productoRows.length === 0) {
        return res.status(400).json({ message: `Producto con ID ${producto_id} no existe` });
      }
    }

    let updates = [];
    let params = [];

    if (producto_id !== undefined) {
      updates.push('producto_id = ?');
      params.push(producto_id);
    }
    if (costo !== undefined && costo !== '') {
      updates.push('costo = ?');
      params.push(Number(costo));
    }
    if (precio !== undefined && precio !== '') {
      updates.push('precio = ?');
      params.push(Number(precio));
    }
    if (cantidad !== undefined && cantidad !== '') {
      updates.push('cantidad = ?');
      params.push(Number(cantidad));
    }
    if (cliente_id !== undefined) {
      updates.push('cliente_id = ?');
      params.push(cliente_id);
    }
    if (forma_de_pago !== undefined) {
      updates.push('forma_de_pago = ?');
      params.push(forma_de_pago);
    }
    if (cuotas !== undefined && cuotas !== '') {
      updates.push('cuotas = ?');
      params.push(Number(cuotas));
    }
    if (observacion !== undefined) {
      updates.push('observacion = ?');
      params.push(observacion);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    const query = `UPDATE ventas_productos SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id);

    await pool.execute(query, params);

    res.json({ message: 'Venta actualizada correctamente' });
  } catch (err) {
    console.error('Error al actualizar venta:', err);
    res.status(500).json({ message: 'Error al actualizar venta' });
  }
};

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
