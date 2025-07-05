const { pool } = require('../config/database');

// Obtener todas las aperturas/cierres
const getCajas = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM caja_aperturas_cierres ORDER BY fecha DESC');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener una caja por ID
const getCajaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query('SELECT * FROM caja_aperturas_cierres WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Caja no encontrada' });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener una caja por fecha (formato: YYYY-MM-DD)
const getCajaByFecha = async (req, res) => {
  const { fecha } = req.params;

  // Validación opcional del formato de fecha
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ message: 'Formato de fecha inválido' });
  }

  try {
    const [results] = await pool.query('SELECT * FROM caja_aperturas_cierres WHERE fecha = ?', [fecha]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No hay caja registrada en esa fecha' });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nueva apertura/cierre
const createCaja = async (req, res) => {
  const { fecha, monto_apertura, monto_cierre } = req.body;

  if (!fecha || monto_apertura == null || monto_cierre == null) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ message: 'Formato de fecha inválido' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO caja_aperturas_cierres (fecha, monto_apertura, monto_cierre) VALUES (?, ?, ?)',
      [fecha, monto_apertura, monto_cierre]
    );

    res.status(201).json({ message: 'Caja registrada', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe una caja registrada para esa fecha' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Actualizar caja
const updateCaja = async (req, res) => {
  const { id } = req.params;
  const { fecha, monto_apertura, monto_cierre } = req.body;

  if (!fecha || monto_apertura == null || monto_cierre == null) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ message: 'Formato de fecha inválido' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE caja_aperturas_cierres SET fecha = ?, monto_apertura = ?, monto_cierre = ? WHERE id = ?',
      [fecha, monto_apertura, monto_cierre, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Caja no encontrada' });
    }

    res.json({ message: 'Caja actualizada' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe una caja registrada para esa fecha' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Cerrar caja (actualizar solo el monto de cierre)
const cerrarCaja = async (req, res) => {
  const { fecha } = req.params;
  const { monto_cierre } = req.body;

  if (monto_cierre == null) {
    return res.status(400).json({ message: 'El monto de cierre es obligatorio' });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ message: 'Formato de fecha inválido' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE caja_aperturas_cierres SET monto_cierre = ? WHERE fecha = ?',
      [monto_cierre, fecha]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No hay caja abierta para esa fecha' });
    }

    res.json({ message: 'Caja cerrada exitosamente', monto_cierre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar caja
const deleteCaja = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM caja_aperturas_cierres WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Caja no encontrada' });
    }
    res.json({ message: 'Caja eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCajas,
  getCajaById,
  getCajaByFecha,
  createCaja,
  updateCaja,
  deleteCaja,
  cerrarCaja
};
