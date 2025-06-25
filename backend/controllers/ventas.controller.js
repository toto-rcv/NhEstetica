const { pool } = require('../config/database');

exports.getVentas = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT v.*, c.nombre, c.apellido 
      FROM ventas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener ventas:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getVentaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM ventas WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createVenta = async (req, res) => {
  const { tratamiento, sesiones, costo, precio, cliente_id } = req.body;

  if (!tratamiento || !sesiones || !cliente_id) {
    return res.status(400).json({ message: 'Tratamiento, sesiones y cliente_id son obligatorios' });
  }

  try {
    // Verificar si el cliente existe
    const [clienteRows] = await pool.execute('SELECT id FROM clientes WHERE id = ?', [cliente_id]);
    if (clienteRows.length === 0) {
      return res.status(400).json({ message: `Cliente con ID ${cliente_id} no existe` });
    }

    await pool.execute(
      `INSERT INTO ventas (tratamiento, sesiones, costo, precio, cliente_id, fecha)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [tratamiento, sesiones.toString(), costo || 0, precio || 0, cliente_id]
    );

    res.status(201).json({ message: 'Venta registrada correctamente' });
  } catch (err) {
    console.error('Error al registrar venta:', err);
    
    // Mostrar error específico en desarrollo
    if (process.env.NODE_ENV === 'development') {
      res.status(500).json({ 
        message: 'Error al registrar venta',
        error: err.message,
        sqlMessage: err.sqlMessage
      });
    } else {
      res.status(500).json({ message: 'Error al registrar venta' });
    }
  }
};

exports.updateVenta = async (req, res) => {
  const { id } = req.params;
  const { tratamiento, sesiones, costo, precio, cliente_id } = req.body;

  try {
    await pool.execute(
      `UPDATE ventas 
       SET tratamiento = ?, sesiones = ?, costo = ?, precio = ?, cliente_id = ? 
       WHERE id = ?`,
      [tratamiento, sesiones, costo || 0, precio || 0, cliente_id, id]
    );

    res.json({ message: 'Venta actualizada correctamente' });
  } catch (err) {
    console.error('Error al actualizar venta:', err);
    res.status(500).json({ message: 'Error al actualizar venta' });
  }
};

exports.deleteVenta = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM ventas WHERE id = ?', [id]);
    res.json({ message: 'Venta eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar venta:', err);
    res.status(500).json({ message: 'Error al eliminar venta' });
  }
};
