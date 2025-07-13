const { pool } = require('../config/database');
const EmailService = new (require('../services/emailService'))();

// Función para verificar si el email ya envió una consulta en los últimos 10 minutos
const verificarLimiteConsulta = async (email) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM consultas WHERE email = ? AND fecha_envio > DATE_SUB(NOW(), INTERVAL 10 MINUTE)',
      [email]
    );
    return rows.length > 0;
  } catch (error) {
    console.error('Error al verificar límite de consulta:', error);
    return false;
  }
};

// Crear nueva consulta
const crearConsulta = async (req, res) => {
  const { nombre, apellido, email, mensaje } = req.body;

  // Validaciones
  if (!nombre || !apellido || !email || !mensaje) {
    return res.status(400).json({ 
      success: false, 
      message: 'Todos los campos son obligatorios' 
    });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Formato de email inválido' 
    });
  }

  try {
    // Verificar límite de tiempo
    const yaEnvioConsulta = await verificarLimiteConsulta(email);
    if (yaEnvioConsulta) {
      return res.status(429).json({ 
        success: false, 
        message: 'Ya has enviado una consulta recientemente. Por favor espera 10 minutos antes de enviar otra.' 
      });
    }

    // Guardar consulta en base de datos
    const [result] = await pool.execute(
      'INSERT INTO consultas (nombre, apellido, email, mensaje, fecha_envio) VALUES (?, ?, ?, ?, NOW())',
      [nombre, apellido, email, mensaje]
    );

    // Enviar email usando Brevo
    const emailEnviado = await EmailService.enviarConsulta({
      nombre,
      apellido,
      email,
      mensaje,
      fecha: new Date().toLocaleString('es-AR')
    });

    if (emailEnviado) {
      res.status(201).json({ 
        success: true, 
        message: 'Consulta enviada correctamente',
        consulta_id: result.insertId
      });
    } else {
      // Si falla el email, aún guardamos la consulta pero informamos el error
      res.status(201).json({ 
        success: true, 
        message: 'Consulta guardada correctamente, pero hubo un problema al enviar el email',
        consulta_id: result.insertId
      });
    }

  } catch (error) {
    console.error('Error al crear consulta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
};

// Obtener todas las consultas (para administración)
const obtenerConsultas = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM consultas ORDER BY fecha_envio DESC'
    );
    res.json({ success: true, consultas: rows });
  } catch (error) {
    console.error('Error al obtener consultas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
};

module.exports = {
  crearConsulta,
  obtenerConsultas
}; 