const { pool } = require('../config/database');
const AuditoriaService = require('../services/auditoriaService');
const EmailService = new (require('../services/emailService'))();

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
    // Verificar si la caja ya está cerrada
    const [cajaActual] = await pool.query(
      'SELECT * FROM caja_aperturas_cierres WHERE fecha = ?',
      [fecha]
    );

    if (cajaActual.length === 0) {
      return res.status(404).json({ message: 'No hay caja abierta para esa fecha' });
    }

    // Convertir a número para comparar correctamente
    const montoCierreActual = parseFloat(cajaActual[0].monto_cierre);
    
    if (montoCierreActual > 0) {
      return res.status(400).json({ message: 'La caja ya está cerrada' });
    }

    // Registrar auditoría del cambio
    const usuario = req.user || { id: null, nombre: 'Sistema' };
    await AuditoriaService.registrarCambio({
      tabla: 'caja_aperturas_cierres',
      accion: 'UPDATE',
      registro_id: cajaActual[0].id,
      datos_anteriores: cajaActual[0],
      datos_nuevos: { ...cajaActual[0], monto_cierre },
      usuario,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    const [result] = await pool.query(
      'UPDATE caja_aperturas_cierres SET monto_cierre = ? WHERE fecha = ?',
      [monto_cierre, fecha]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No hay caja abierta para esa fecha' });
    }

    // Obtener datos completos para el email
    const [cajaCompleta] = await pool.query(
      'SELECT * FROM caja_aperturas_cierres WHERE fecha = ?',
      [fecha]
    );

    // Obtener ingresos del día
    const [ingresos] = await pool.query(`
      SELECT 
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
       WHERE DATE(vp.fecha) = ?
       UNION ALL
       SELECT 
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
       WHERE DATE(vt.fecha) = ?
    `, [fecha, fecha]);

    // Obtener egresos del día
    const [egresos] = await pool.query(
      'SELECT * FROM egresos WHERE DATE(fecha) = ? ORDER BY fecha DESC',
      [fecha]
    );

    // Obtener cambios de auditoría del día
    const cambios = await AuditoriaService.obtenerCambiosPorFecha(fecha);

    // Enviar email con el reporte
    const emailEnviado = await EmailService.enviarReporteCierreCaja(
      fecha,
      cajaCompleta[0],
      ingresos,
      egresos,
      cambios
    );

    res.json({ 
      message: 'Caja cerrada exitosamente', 
      monto_cierre,
      email_enviado: emailEnviado,
      cambios_registrados: cambios.length
    });
  } catch (err) {
    console.error('Error al cerrar caja:', err);
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
