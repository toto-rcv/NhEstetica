const { pool } = require('../config/database');

// Función auxiliar para verificar si la caja está cerrada
const isCajaCerrada = async (fecha) => {
  try {
    const [results] = await pool.query('SELECT monto_cierre FROM caja_aperturas_cierres WHERE fecha = ?', [fecha]);
    if (results.length === 0) {
      return false; // No hay caja registrada, no está cerrada
    }
    
    // Convertir a número para comparar correctamente
    const montoCierre = parseFloat(results[0].monto_cierre);
    return montoCierre > 0; // Si monto_cierre es mayor que 0, está cerrada
  } catch (err) {
    console.error('Error al verificar estado de caja:', err);
    return false;
  }
};

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

  // Verificar si la caja está cerrada
  const cajaCerrada = await isCajaCerrada(fecha);
  
  if (cajaCerrada) {
    return res.status(400).json({ message: 'No se pueden agregar egresos a una caja cerrada' });
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
    // Obtener la fecha del egreso para verificar si la caja está cerrada
    const [egresoResults] = await pool.query('SELECT fecha FROM egresos WHERE id = ?', [id]);
    if (egresoResults.length === 0) {
      return res.status(404).json({ message: 'Egreso no encontrado' });
    }

    const fechaEgreso = egresoResults[0].fecha;
    const cajaCerrada = await isCajaCerrada(fechaEgreso);
    if (cajaCerrada) {
      return res.status(400).json({ message: 'No se pueden modificar egresos de una caja cerrada' });
    }

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
    // Obtener la fecha del egreso para verificar si la caja está cerrada
    const [egresoResults] = await pool.query('SELECT fecha FROM egresos WHERE id = ?', [id]);
    if (egresoResults.length === 0) {
      return res.status(404).json({ message: 'Egreso no encontrado' });
    }

    const fechaEgreso = egresoResults[0].fecha;
    const cajaCerrada = await isCajaCerrada(fechaEgreso);
    if (cajaCerrada) {
      return res.status(400).json({ message: 'No se pueden eliminar egresos de una caja cerrada' });
    }

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
