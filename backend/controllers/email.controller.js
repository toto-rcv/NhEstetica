const { pool } = require('../config/database');
const EmailService = require('../services/emailService');

// Obtener configuración de email
const getConfiguracionEmail = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM configuracion_email WHERE activo = 1 LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró configuración de email' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener configuración de email:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar configuración de email
const updateConfiguracionEmail = async (req, res) => {
  const { email_destino, nombre_destinatario, activo } = req.body;

  if (!email_destino || !nombre_destinatario) {
    return res.status(400).json({ message: 'Email y nombre del destinatario son obligatorios' });
  }

  try {
    // Verificar si ya existe configuración
    const [existingConfig] = await pool.execute('SELECT id FROM configuracion_email LIMIT 1');
    
    if (existingConfig.length > 0) {
      // Actualizar configuración existente
      await pool.execute(
        'UPDATE configuracion_email SET email_destino = ?, nombre_destinatario = ?, activo = ? WHERE id = ?',
        [email_destino, nombre_destinatario, activo !== false, existingConfig[0].id]
      );
    } else {
      // Crear nueva configuración
      await pool.execute(
        'INSERT INTO configuracion_email (email_destino, nombre_destinatario, activo) VALUES (?, ?, ?)',
        [email_destino, nombre_destinatario, activo !== false]
      );
    }

    res.json({ message: 'Configuración de email actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar configuración de email:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Enviar email de prueba
const enviarEmailPrueba = async (req, res) => {
  try {
    const resultado = await EmailService.enviarEmailPrueba();
    
    if (resultado) {
      res.json({ message: 'Email de prueba enviado correctamente' });
    } else {
      res.status(500).json({ error: 'Error al enviar email de prueba' });
    }
  } catch (error) {
    console.error('Error al enviar email de prueba:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener auditoría de cambios por fecha
const getAuditoriaPorFecha = async (req, res) => {
  const { fecha } = req.params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ message: 'Formato de fecha inválido' });
  }

  try {
    const AuditoriaService = require('../services/auditoriaService');
    const cambios = await AuditoriaService.obtenerCambiosPorFecha(fecha);
    const resumen = await AuditoriaService.obtenerResumenCambiosPorUsuario(fecha);
    
    res.json({
      fecha,
      cambios,
      resumen,
      total_cambios: cambios.length
    });
  } catch (error) {
    console.error('Error al obtener auditoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getConfiguracionEmail,
  updateConfiguracionEmail,
  enviarEmailPrueba,
  getAuditoriaPorFecha
}; 