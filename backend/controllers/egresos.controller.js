const { pool } = require('../config/database');

const getEgresos = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM egresos ORDER BY fecha DESC');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEgresoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query('SELECT * FROM egresos WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Egreso no encontrado' });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEgresosByFecha = async (req, res) => {
  const { fecha } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM egresos WHERE fecha = ?', [fecha]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEgreso = async (req, res) => {
  const { detalle, forma_pago, importe, fecha } = req.body;

  if (!detalle || !forma_pago || importe == null || !fecha) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ message: 'Formato de fecha inválido' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO egresos (detalle, forma_pago, importe, fecha) VALUES (?, ?, ?, ?)',
      [detalle, forma_pago, importe, fecha]
    );

    res.status(201).json({ message: 'Egreso creado', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEgreso = async (req, res) => {
  const { id } = req.params;
  const { detalle, forma_pago, importe } = req.body;

  // Validar solo los campos editables
  if (!detalle || !forma_pago || importe == null) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE egresos SET detalle = ?, forma_pago = ?, importe = ? WHERE id = ?',
      [detalle, forma_pago, importe, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Egreso no encontrado' });
    }

    res.json({ message: 'Egreso actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteEgreso = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM egresos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Egreso no encontrado' });
    }
    res.json({ message: 'Egreso eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getEgresos,
  getEgresoById,
  getEgresosByFecha,
  createEgreso,
  updateEgreso,
  deleteEgreso
};
