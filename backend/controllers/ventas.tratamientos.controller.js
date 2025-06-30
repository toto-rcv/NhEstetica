const { pool } = require('../config/database');

// Obtener todas las ventas de tratamientos (con datos de cliente y tratamiento)
exports.getVentas = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT v.*, 
             c.nombre AS cliente_nombre, 
             c.apellido AS cliente_apellido,
             t.nombre AS tratamiento_nombre
      FROM ventas_tratamientos v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      LEFT JOIN tratamientos t ON v.tratamiento_id = t.id
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
    const [rows] = await pool.execute('SELECT * FROM ventas_tratamientos WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener todas las ventas de un cliente específico
exports.getVentasByClienteId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(`
      SELECT v.*, 
             c.nombre AS cliente_nombre, 
             c.apellido AS cliente_apellido,
             t.nombre AS tratamiento_nombre
      FROM ventas_tratamientos v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      LEFT JOIN tratamientos t ON v.tratamiento_id = t.id
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

// Crear nueva venta de tratamiento
exports.createVenta = async (req, res) => {
  const {
    tratamiento_id,
    sesiones,
    precio,
    forma_de_pago,
    vencimiento,
    cuotas,
    observacion,
    cliente_id,
    fecha
  } = req.body;

  if (!tratamiento_id || !cliente_id || !sesiones || !precio) {
    return res.status(400).json({ message: 'tratamiento_id, cliente_id, sesiones y precio son obligatorios' });
  }

  try {
    // Validar cliente
    const [clienteRows] = await pool.execute('SELECT id FROM clientes WHERE id = ?', [cliente_id]);
    if (clienteRows.length === 0) {
      return res.status(400).json({ message: `Cliente con ID ${cliente_id} no existe` });
    }

    // Validar tratamiento
    const [tratamientoRows] = await pool.execute('SELECT id FROM tratamientos WHERE id = ?', [tratamiento_id]);
    if (tratamientoRows.length === 0) {
      return res.status(400).json({ message: `Tratamiento con ID ${tratamiento_id} no existe` });
    }

    const [result] = await pool.execute(
      `INSERT INTO ventas_tratamientos 
       (tratamiento_id, sesiones, precio, forma_de_pago, vencimiento, cuotas, observacion, cliente_id, fecha)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tratamiento_id,
        sesiones,
        precio,
        forma_de_pago || null,
        vencimiento || null,
        cuotas || 0,
        observacion || '',
        cliente_id,
        fecha || null
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

// Actualizar venta de tratamiento
exports.updateVenta = async (req, res) => {
  const { id } = req.params;
  const {
    tratamiento_id,
    sesiones,
    precio,
    forma_de_pago,
    vencimiento,
    cuotas,
    observacion,
    cliente_id,
    fecha
  } = req.body;

  try {
    // Validar tratamiento si se envía
    if (tratamiento_id) {
      const [tratamientoRows] = await pool.execute('SELECT id FROM tratamientos WHERE id = ?', [tratamiento_id]);
      if (tratamientoRows.length === 0) {
        return res.status(400).json({ message: `Tratamiento con ID ${tratamiento_id} no existe` });
      }
    }

    // Validar cliente si se envía
    if (cliente_id) {
      const [clienteRows] = await pool.execute('SELECT id FROM clientes WHERE id = ?', [cliente_id]);
      if (clienteRows.length === 0) {
        return res.status(400).json({ message: `Cliente con ID ${cliente_id} no existe` });
      }
    }

    let updates = [];
    let params = [];

    if (tratamiento_id !== undefined) {
      updates.push('tratamiento_id = ?');
      params.push(tratamiento_id);
    }
    if (sesiones !== undefined && sesiones !== '') {
      updates.push('sesiones = ?');
      params.push(Number(sesiones));
    }
    if (precio !== undefined && precio !== '') {
      updates.push('precio = ?');
      params.push(Number(precio));
    }
    if (forma_de_pago !== undefined) {
      updates.push('forma_de_pago = ?');
      params.push(forma_de_pago);
    }
    if (vencimiento !== undefined) {
      updates.push('vencimiento = ?');
      params.push(vencimiento || null);
    }
    if (cuotas !== undefined && cuotas !== '') {
      updates.push('cuotas = ?');
      params.push(Number(cuotas));
    }
    if (observacion !== undefined) {
      updates.push('observacion = ?');
      params.push(observacion);
    }
    if (cliente_id !== undefined) {
      updates.push('cliente_id = ?');
      params.push(cliente_id);
    }
    if (fecha !== undefined) {
      updates.push('fecha = ?');
      params.push(fecha || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    const query = `UPDATE ventas_tratamientos SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id);

    await pool.execute(query, params);

    res.json({ message: 'Venta actualizada correctamente' });
  } catch (err) {
    console.error('Error al actualizar venta:', err);
    res.status(500).json({ message: 'Error al actualizar venta' });
  }
};

// Eliminar venta de tratamiento
exports.deleteVenta = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM ventas_tratamientos WHERE id = ?', [id]);
    res.json({ message: 'Venta eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar venta:', err);
    res.status(500).json({ message: 'Error al eliminar venta' });
  }
};
