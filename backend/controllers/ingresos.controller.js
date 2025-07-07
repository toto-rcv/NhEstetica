const pool = require('../config/database').pool;

exports.getIngresosPorFecha = async (req, res) => {
  const { fecha } = req.params;

  try {
    // Obtener ventas de productos con todos los datos relacionados
    const [productos] = await pool.execute(
      `SELECT 
        'Producto' AS tipo,
        c.nombre AS cliente_nombre,
        c.apellido AS cliente_apellido,
        '-' AS tratamiento_nombre,
        '-' AS sesiones,
        p.nombre AS producto_nombre,
        COALESCE(vp.cantidad, 1) AS cantidad,
        COALESCE(vp.forma_de_pago, '-') AS forma_de_pago,
        (vp.precio * COALESCE(vp.cantidad, 1)) AS importe,
        COALESCE(vp.observacion, '-') AS observacion,
        vp.fecha
       FROM ventas_productos vp
       JOIN clientes c ON vp.cliente_id = c.id
       JOIN productos p ON vp.producto_id = p.id
       WHERE DATE(vp.fecha) = ?`, [fecha]
    );

    // Obtener ventas de tratamientos con todos los datos relacionados
    const [tratamientos] = await pool.execute(
      `SELECT 
        'Tratamiento' AS tipo,
        c.nombre AS cliente_nombre,
        c.apellido AS cliente_apellido,
        t.nombre AS tratamiento_nombre,
        COALESCE(vt.sesiones, '-') AS sesiones,
        '-' AS producto_nombre,
        '-' AS cantidad,
        COALESCE(vt.forma_de_pago, '-') AS forma_de_pago,
        vt.precio AS importe,
        COALESCE(vt.observacion, '-') AS observacion,
        vt.fecha
       FROM ventas_tratamientos vt
       JOIN clientes c ON vt.cliente_id = c.id
       JOIN tratamientos t ON vt.tratamiento_id = t.id
       WHERE DATE(vt.fecha) = ?`, [fecha]
    );

    // Combinar ambos tipos de ingresos
    const ingresos = [...productos, ...tratamientos];

    // Ordenar por fecha (más recientes primero)
    ingresos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    res.json(ingresos);
  } catch (err) {
    console.error('Error al obtener ingresos:', err);
    res.status(500).json({ message: 'Error al obtener ingresos' });
  }
};
