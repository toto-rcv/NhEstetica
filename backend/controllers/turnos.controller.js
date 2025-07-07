const db = require('../config/database');

// Helper function para obtener día de la semana
const getDayOfWeek = (date) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dateObj = new Date(date);
  return days[dateObj.getDay()];
};

// Obtener todos los turnos con filtros opcionales
exports.getAllTurnos = async (req, res) => {
  try {
    const { fecha, cliente, tratamiento, estado } = req.query;
    let sql = `
      SELECT t.*, 
             tr.nombre as tratamiento_nombre,
             tr.duracion as tratamiento_duracion,
             c.nombre as cliente_nombre_registrado,
             c.apellido as cliente_apellido_registrado
      FROM turnos t
      LEFT JOIN tratamientos tr ON t.tratamiento_id = tr.id
      LEFT JOIN clientes c ON t.cliente_id = c.id
      WHERE 1=1
    `;
    let params = [];

    if (fecha) {
      sql += ' AND t.fecha = ?';
      params.push(fecha);
    }

    if (cliente) {
      sql += ' AND (t.nombre_cliente LIKE ? OR t.apellido_cliente LIKE ? OR c.nombre LIKE ? OR c.apellido LIKE ?)';
      params.push(`%${cliente}%`, `%${cliente}%`, `%${cliente}%`, `%${cliente}%`);
    }

    if (tratamiento) {
      sql += ' AND tr.nombre LIKE ?';
      params.push(`%${tratamiento}%`);
    }

    if (estado) {
      sql += ' AND t.estado = ?';
      params.push(estado);
    }

    sql += ' ORDER BY t.fecha DESC, t.hora DESC';

    const [rows] = await db.pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener turnos:', err);
    res.status(500).json({ error: 'Error al obtener turnos' });
  }
};

// Obtener turnos por fecha específica
exports.getTurnosByFecha = async (req, res) => {
  try {
    const { fecha } = req.params;
    
    const sql = `
      SELECT t.*, 
             tr.nombre as tratamiento_nombre,
             tr.duracion as tratamiento_duracion
      FROM turnos t
      LEFT JOIN tratamientos tr ON t.tratamiento_id = tr.id
      WHERE t.fecha = ?
      ORDER BY t.hora ASC
    `;
    
    const [rows] = await db.pool.query(sql, [fecha]);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener turnos por fecha:', err);
    res.status(500).json({ error: 'Error al obtener turnos por fecha' });
  }
};

// Obtener horarios disponibles para una fecha específica
exports.getHorariosDisponibles = async (req, res) => {
  try {
    const { fecha, tratamiento_id } = req.query;
    
    if (!fecha) {
      return res.status(400).json({ error: 'La fecha es requerida' });
    }

    // Verificar que la fecha no sea pasada
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const selectedDate = new Date(fecha);
    
    if (selectedDate < todayMidnight) {
      return res.status(400).json({ error: 'No se pueden reservar turnos en fechas pasadas' });
    }

    // Obtener el día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)
    // Parsear la fecha correctamente para evitar problemas de zona horaria
    let dayOfWeek;
    if (typeof fecha === 'string' && fecha.includes('-')) {
      const [year, month, day] = fecha.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      dayOfWeek = localDate.getDay();
    } else {
      dayOfWeek = selectedDate.getDay();
    }
    
    // Obtener configuración de horarios para ese día
    const [horariosConfig] = await db.pool.query(
      'SELECT * FROM configuracion_horarios WHERE dia_semana = ? AND activo = TRUE ORDER BY hora_inicio',
      [dayOfWeek]
    );

    if (horariosConfig.length === 0) {
      console.log(`No hay configuración de horarios para el día ${dayOfWeek} (${getDayOfWeek(fecha)})`);
      return res.json([]);
    }

    // Obtener turnos ocupados para esa fecha
    let sqlTurnos = 'SELECT hora FROM turnos WHERE fecha = ?';
    let paramsTurnos = [fecha];
    
    if (tratamiento_id) {
      sqlTurnos += ' AND tratamiento_id = ?';
      paramsTurnos.push(tratamiento_id);
    }

    const [turnosOcupados] = await db.pool.query(sqlTurnos, paramsTurnos);
    const horasOcupadas = turnosOcupados.map(turno => turno.hora);

    // Generar horarios disponibles
    const horariosDisponibles = [];
    
    for (const config of horariosConfig) {
      const horaInicio = new Date(`2000-01-01T${config.hora_inicio}`);
      const horaFin = new Date(`2000-01-01T${config.hora_fin}`);
      const duracionMinutos = config.duracion_turno;
      
      let horaActual = new Date(horaInicio);
      
      while (horaActual < horaFin) {
        const horaString = horaActual.toTimeString().substring(0, 5);
        const horaCompleta = horaActual.toTimeString().substring(0, 8);
        
        if (!horasOcupadas.includes(horaCompleta)) {
          horariosDisponibles.push({
            hora: horaCompleta,
            hora_display: horaString,
            disponible: true
          });
        }
        
        horaActual.setMinutes(horaActual.getMinutes() + duracionMinutos);
      }
    }

    res.json(horariosDisponibles);
  } catch (err) {
    console.error('Error al obtener horarios disponibles:', err);
    res.status(500).json({ error: 'Error al obtener horarios disponibles' });
  }
};

// Crear nuevo turno
exports.createTurno = async (req, res) => {
  try {
    const {
      cliente_id,
      tratamiento_id,
      fecha,
      hora,
      dni_cliente,
      nombre_cliente,
      apellido_cliente,
      email_cliente,
      telefono_cliente,
      observaciones
    } = req.body;

    // Validaciones básicas
    if (!tratamiento_id || !fecha || !hora || !dni_cliente || !nombre_cliente || !apellido_cliente || !email_cliente || !telefono_cliente) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Verificar que la fecha no sea pasada
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const selectedDate = new Date(fecha);
    
    if (selectedDate < todayMidnight) {
      return res.status(400).json({ error: 'No se pueden reservar turnos en fechas pasadas' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_cliente)) {
      return res.status(400).json({ error: 'El formato del email no es válido' });
    }

    // Verificar que el horario esté disponible
    const [turnosExistentes] = await db.pool.query(
      'SELECT id FROM turnos WHERE fecha = ? AND hora = ? AND tratamiento_id = ?',
      [fecha, hora, tratamiento_id]
    );

    if (turnosExistentes.length > 0) {
      return res.status(400).json({ error: 'El horario seleccionado ya está ocupado' });
    }

    // Verificar que el tratamiento existe
    const [tratamiento] = await db.pool.query('SELECT id FROM tratamientos WHERE id = ?', [tratamiento_id]);
    if (tratamiento.length === 0) {
      return res.status(400).json({ error: 'El tratamiento seleccionado no existe' });
    }

    // Crear el turno
    const [result] = await db.pool.query(
      `INSERT INTO turnos (
        cliente_id, tratamiento_id, fecha, hora, dni_cliente, 
        nombre_cliente, apellido_cliente, email_cliente, telefono_cliente, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cliente_id || null,
        tratamiento_id,
        fecha,
        hora,
        dni_cliente,
        nombre_cliente,
        apellido_cliente,
        email_cliente,
        telefono_cliente,
        observaciones || null
      ]
    );

    res.status(201).json({
      id: result.insertId,
      mensaje: 'Turno creado exitosamente',
      turno: {
        id: result.insertId,
        fecha,
        hora,
        cliente: `${nombre_cliente} ${apellido_cliente}`,
        tratamiento_id
      }
    });
  } catch (err) {
    console.error('Error al crear turno:', err);
    res.status(500).json({ error: 'Error al crear turno' });
  }
};

// Obtener turno por ID
exports.getTurnoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `
      SELECT t.*, 
             tr.nombre as tratamiento_nombre,
             tr.duracion as tratamiento_duracion,
             c.nombre as cliente_nombre_registrado,
             c.apellido as cliente_apellido_registrado
      FROM turnos t
      LEFT JOIN tratamientos tr ON t.tratamiento_id = tr.id
      LEFT JOIN clientes c ON t.cliente_id = c.id
      WHERE t.id = ?
    `;
    
    const [rows] = await db.pool.query(sql, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener turno por ID:', err);
    res.status(500).json({ error: 'Error al obtener turno' });
  }
};

// Actualizar turno
exports.updateTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fecha,
      hora,
      estado,
      dni_cliente,
      nombre_cliente,
      apellido_cliente,
      email_cliente,
      telefono_cliente,
      observaciones
    } = req.body;

    // Verificar que el turno existe
    const [turnoExistente] = await db.pool.query('SELECT * FROM turnos WHERE id = ?', [id]);
    if (turnoExistente.length === 0) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    // Si se está cambiando fecha/hora, verificar disponibilidad
    if (fecha && hora) {
      const [conflicto] = await db.pool.query(
        'SELECT id FROM turnos WHERE fecha = ? AND hora = ? AND tratamiento_id = ? AND id != ?',
        [fecha, hora, turnoExistente[0].tratamiento_id, id]
      );

      if (conflicto.length > 0) {
        return res.status(400).json({ error: 'El nuevo horario ya está ocupado' });
      }
    }

    // Actualizar solo los campos proporcionados
    const updates = [];
    const params = [];

    if (fecha) {
      updates.push('fecha = ?');
      params.push(fecha);
    }
    if (hora) {
      updates.push('hora = ?');
      params.push(hora);
    }
    if (estado) {
      updates.push('estado = ?');
      params.push(estado);
    }
    if (dni_cliente) {
      updates.push('dni_cliente = ?');
      params.push(dni_cliente);
    }
    if (nombre_cliente) {
      updates.push('nombre_cliente = ?');
      params.push(nombre_cliente);
    }
    if (apellido_cliente) {
      updates.push('apellido_cliente = ?');
      params.push(apellido_cliente);
    }
    if (email_cliente) {
      updates.push('email_cliente = ?');
      params.push(email_cliente);
    }
    if (telefono_cliente) {
      updates.push('telefono_cliente = ?');
      params.push(telefono_cliente);
    }
    if (observaciones !== undefined) {
      updates.push('observaciones = ?');
      params.push(observaciones);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    params.push(id);

    const [result] = await db.pool.query(
      `UPDATE turnos SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    res.json({ mensaje: 'Turno actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar turno:', err);
    res.status(500).json({ error: 'Error al actualizar turno' });
  }
};

// Eliminar turno
exports.deleteTurno = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.pool.query('DELETE FROM turnos WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }
    
    res.json({ mensaje: 'Turno eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar turno:', err);
    res.status(500).json({ error: 'Error al eliminar turno' });
  }
};

// Obtener configuración de horarios
exports.getConfiguracionHorarios = async (req, res) => {
  try {
    const [rows] = await db.pool.query(
      'SELECT * FROM configuracion_horarios ORDER BY dia_semana, hora_inicio'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener configuración de horarios:', err);
    res.status(500).json({ error: 'Error al obtener configuración de horarios' });
  }
};

// Actualizar configuración de horarios
exports.updateConfiguracionHorarios = async (req, res) => {
  try {
    const { horarios } = req.body;
    
    if (!Array.isArray(horarios)) {
      return res.status(400).json({ error: 'Los horarios deben ser un array' });
    }

    // Eliminar configuración existente
    await db.pool.query('DELETE FROM configuracion_horarios');

    // Insertar nueva configuración
    for (const horario of horarios) {
      await db.pool.query(
        'INSERT INTO configuracion_horarios (dia_semana, hora_inicio, hora_fin, duracion_turno, activo) VALUES (?, ?, ?, ?, ?)',
        [horario.dia_semana, horario.hora_inicio, horario.hora_fin, horario.duracion_turno, horario.activo]
      );
    }

    res.json({ mensaje: 'Configuración de horarios actualizada exitosamente' });
  } catch (err) {
    console.error('Error al actualizar configuración de horarios:', err);
    res.status(500).json({ error: 'Error al actualizar configuración de horarios' });
  }
}; 