const pool = require('../config/database').pool;

exports.getIngresosPorFecha = async (req, res) => {
  const { fecha } = req.params;

  try {
    const [productos] = await pool.execute(
      `SELECT 'producto' AS tipo, vp.precio AS importe
       FROM ventas_productos vp
       WHERE DATE(vp.fecha) = ?`, [fecha]
    );

    const [tratamientos] = await pool.execute(
      `SELECT 'tratamiento' AS tipo, vt.precio AS importe
       FROM ventas_tratamientos vt
       WHERE DATE(vt.fecha) = ?`, [fecha]
    );

    const ingresos = [...productos, ...tratamientos];
    res.json(ingresos);
  } catch (err) {
    console.error('Error al obtener ingresos:', err);
    res.status(500).json({ message: 'Error al obtener ingresos' });
  }
};
