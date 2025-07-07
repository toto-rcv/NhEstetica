const { pool } = require('../config/database');

// Función auxiliar para verificar si la caja está cerrada
const isCajaCerrada = async (fecha) => {
  try {
    const [results] = await pool.query('SELECT monto_cierre FROM caja_aperturas_cierres WHERE fecha = ?', [fecha]);
    if (results.length === 0) {
      return false; // No hay caja registrada, no está cerrada
    }
    return results[0].monto_cierre !== 0; // Si monto_cierre es diferente de 0, está cerrada
  } catch (err) {
    console.error('Error al verificar estado de caja:', err);
    return false;
  }
};

// Obtener todas las ventas de tratamientos (con datos de cliente y tratamiento)
exports.getVentas = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT v.*, 
             c.nombre AS cliente_nombre, 
             c.apellido AS cliente_apellido,
             t.nombre AS tratamiento_nombre,
             p.nombre AS personal_nombre,
             p.apellido AS personal_apellido
      FROM ventas_tratamientos v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      LEFT JOIN tratamientos t ON v.tratamiento_id = t.id
      LEFT JOIN personal p ON v.personal_id = p.id
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

exports.getVentasByCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(`
      SELECT v.*, 
             c.nombre AS cliente_nombre, 
             c.apellido AS cliente_apellido,
             t.nombre AS tratamiento_nombre,
             p.nombre AS personal_nombre,       -- 👈
             p.apellido AS personal_apellido    -- 👈
      FROM ventas_tratamientos v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      LEFT JOIN tratamientos t ON v.tratamiento_id = t.id
      LEFT JOIN personal p ON v.personal_id = p.id     -- 👈
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
    fecha,
    personal_id // 👈 nuevo
  } = req.body;

  if (!tratamiento_id || !cliente_id || !sesiones || !precio) {
    return res.status(400).json({ message: 'tratamiento_id, cliente_id, sesiones y precio son obligatorios' });
  }

  try {
    // Verificar si la caja está cerrada para la fecha de la venta
    const fechaVenta = fecha || new Date().toISOString().split('T')[0];
    const cajaCerrada = await isCajaCerrada(fechaVenta);
    if (cajaCerrada) {
      return res.status(400).json({ message: 'No se pueden registrar ventas en una caja cerrada' });
    }

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

    // Validar personal (si se envía)
    if (personal_id) {
      const [personalRows] = await pool.execute('SELECT id FROM personal WHERE id = ?', [personal_id]);
      if (personalRows.length === 0) {
        return res.status(400).json({ message: `Personal con ID ${personal_id} no existe` });
      }
    }

    const [result] = await pool.execute(
      `INSERT INTO ventas_tratamientos 
       (tratamiento_id, sesiones, precio, forma_de_pago, vencimiento, cuotas, observacion, cliente_id, fecha, personal_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tratamiento_id,
        sesiones,
        precio,
        forma_de_pago || null,
        vencimiento || null,
        cuotas || 0,
        observacion || '',
        cliente_id,
        fecha || null,
        personal_id || null
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
    tratamiento_id,
    sesiones,
    precio,
    forma_de_pago,
    vencimiento,
    cuotas,
    observacion,
    cliente_id,
    fecha,
    personal_id // 👈 nuevo
  } = req.body;

  try {
    const [ventaRows] = await pool.execute('SELECT id FROM ventas_tratamientos WHERE id = ?', [id]);
    if (ventaRows.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    const updates = [];
    const params = [];

    if (tratamiento_id !== undefined) {
      const [tratamientoRows] = await pool.execute('SELECT id FROM tratamientos WHERE id = ?', [tratamiento_id]);
      if (tratamientoRows.length === 0) {
        return res.status(400).json({ message: `Tratamiento con ID ${tratamiento_id} no existe` });
      }
      updates.push('tratamiento_id = ?');
      params.push(tratamiento_id);
    }

    if (cliente_id !== undefined) {
      const [clienteRows] = await pool.execute('SELECT id FROM clientes WHERE id = ?', [cliente_id]);
      if (clienteRows.length === 0) {
        return res.status(400).json({ message: `Cliente con ID ${cliente_id} no existe` });
      }
      updates.push('cliente_id = ?');
      params.push(cliente_id);
    }

    if (personal_id !== undefined) {
      const [personalRows] = await pool.execute('SELECT id FROM personal WHERE id = ?', [personal_id]);
      if (personalRows.length === 0) {
        return res.status(400).json({ message: `Personal con ID ${personal_id} no existe` });
      }
      updates.push('personal_id = ?');
      params.push(personal_id);
    }

    if (typeof sesiones !== 'undefined') updates.push('sesiones = ?'), params.push(Number(sesiones) || 0);
    if (typeof precio !== 'undefined') updates.push('precio = ?'), params.push(Number(precio) || 0);
    if (typeof forma_de_pago !== 'undefined') updates.push('forma_de_pago = ?'), params.push(forma_de_pago);
    if (typeof cuotas !== 'undefined') updates.push('cuotas = ?'), params.push(Number(cuotas) || 0);
    if (typeof observacion !== 'undefined') updates.push('observacion = ?'), params.push(observacion);
    if (typeof vencimiento !== 'undefined') updates.push('vencimiento = ?'), params.push(vencimiento ? vencimiento.slice(0, 10) : null);
    if (typeof fecha !== 'undefined') updates.push('fecha = ?'), params.push(fecha ? fecha.slice(0, 10) : null);

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    const sql = `UPDATE ventas_tratamientos SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id);

    await pool.execute(sql, params);

    res.json({ message: 'Venta actualizada correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar venta:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


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
