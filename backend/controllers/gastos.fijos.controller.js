const { pool } = require('../config/database');

// Obtener gastos fijos de un mes
exports.getGastosFijosPorMes = async (req, res) => {
  const { mes } = req.params; // Formato: YYYY-MM

  if (!mes) {
    return res.status(400).json({ message: 'El parámetro "mes" es obligatorio' });
  }

  try {
    const query = 'SELECT alquiler, expensas FROM gastos_fijos_mensuales WHERE mes = ?';
    const [rows] = await pool.query(query, [mes]);

    if (rows.length === 0) {
      // Si no hay datos para ese mes, devolver 0 por defecto
      return res.json({ alquiler: 0, expensas: 0 });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener gastos fijos:', error);
    res.status(500).json({ message: 'Error al obtener gastos fijos', error });
  }
};

// Insertar o actualizar gastos fijos (upsert)
exports.upsertGastosFijos = async (req, res) => {
  let { mes, alquiler = 0, expensas = 0 } = req.body;

  // Aseguramos que mes esté limpio de espacios
  mes = mes?.trim();

  if (!mes) {
    return res.status(400).json({ message: 'El campo "mes" es obligatorio' });
  }

  try {
    const query = `
      INSERT INTO gastos_fijos_mensuales (mes, alquiler, expensas)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE alquiler = VALUES(alquiler), expensas = VALUES(expensas)
    `;

    await pool.query(query, [mes, alquiler, expensas]);

    res.json({ message: 'Gastos fijos guardados correctamente' });
  } catch (error) {
    console.error('Error al guardar gastos fijos:', error);
    res.status(500).json({ message: 'Error al guardar gastos fijos', error });
  }
};
