const { pool } = require('../config/database');

// Obtener todo el personal
exports.getPersonal = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        dni,
        CONCAT(nombre, ' ', apellido) as nombreCompleto,
        nombre,
        apellido,
        direccion,
        telefono,
        email,
        cargo,
        especialidad,
        DATE_FORMAT(fecha_contratacion, '%d/%m/%Y') as fechaContratacion,
        comision_venta,
        comision_fija,
        sueldo_mensual,
        estado,
        created_at,
        updated_at
      FROM personal 
      WHERE estado = 'Activo'
      ORDER BY nombre, apellido
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener personal:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener un empleado por ID
exports.getPersonalById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        id,
        dni,
        nombre,
        apellido,
        direccion,
        telefono,
        email,
        cargo,
        especialidad,
        fecha_contratacion,
        comision_venta,
        comision_fija,
        sueldo_mensual,
        estado
      FROM personal 
      WHERE id = ? AND estado = 'Activo'
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear nuevo empleado
exports.createPersonal = async (req, res) => {
  try {
    const {
      dni,
      nombre,
      apellido,
      direccion,
      telefono,
      email,
      cargo,
      especialidad,
      fecha_contratacion,
      comision_venta,
      comision_fija,
      sueldo_mensual
    } = req.body;

    // Verificar si el DNI ya existe
    const [existingDni] = await pool.query(
      'SELECT id FROM personal WHERE dni = ? AND estado = "Activo"',
      [dni]
    );

    if (existingDni.length > 0) {
      return res.status(400).json({ 
        message: 'Ya existe un empleado con este DNI' 
      });
    }

    // Verificar si el email ya existe (si se proporciona)
    if (email) {
      const [existingEmail] = await pool.query(
        'SELECT id FROM personal WHERE email = ? AND estado = "Activo"',
        [email]
      );

      if (existingEmail.length > 0) {
        return res.status(400).json({ 
          message: 'Ya existe un empleado con este email' 
        });
      }
    }

    // Insertar nuevo empleado
    const [result] = await pool.execute(
      `INSERT INTO personal (
        dni, nombre, apellido, direccion, telefono, email, 
        cargo, especialidad, fecha_contratacion, 
        comision_venta, comision_fija, sueldo_mensual, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Activo')`,
      [
        dni,
        nombre,
        apellido,
        direccion || null,
        telefono || null,
        email || null,
        cargo || null,
        especialidad || null,
        fecha_contratacion || null,
        comision_venta || 0,
        comision_fija || 0,
        sueldo_mensual || 0
      ]
    );

    res.status(201).json({
      message: 'Empleado creado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar empleado
exports.updatePersonal = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      dni,
      nombre,
      apellido,
      direccion,
      telefono,
      email,
      cargo,
      especialidad,
      fecha_contratacion,
      comision_venta,
      comision_fija,
      sueldo_mensual
    } = req.body;

    // Verificar si el empleado existe
    const [existingEmployee] = await pool.query(
      'SELECT id FROM personal WHERE id = ? AND estado = "Activo"',
      [id]
    );

    if (existingEmployee.length === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    // Verificar si el DNI ya existe en otro empleado
    const [existingDni] = await pool.query(
      'SELECT id FROM personal WHERE dni = ? AND id != ? AND estado = "Activo"',
      [dni, id]
    );

    if (existingDni.length > 0) {
      return res.status(400).json({ 
        message: 'Ya existe otro empleado con este DNI' 
      });
    }

    // Verificar si el email ya existe en otro empleado (si se proporciona)
    if (email) {
      const [existingEmail] = await pool.query(
        'SELECT id FROM personal WHERE email = ? AND id != ? AND estado = "Activo"',
        [email, id]
      );

      if (existingEmail.length > 0) {
        return res.status(400).json({ 
          message: 'Ya existe otro empleado con este email' 
        });
      }
    }

    // Actualizar empleado
    await pool.execute(
      `UPDATE personal SET 
        dni = ?, nombre = ?, apellido = ?, direccion = ?, 
        telefono = ?, email = ?, cargo = ?, especialidad = ?, 
        fecha_contratacion = ?, comision_venta = ?, 
        comision_fija = ?, sueldo_mensual = ?
      WHERE id = ?`,
      [
        dni,
        nombre,
        apellido,
        direccion || null,
        telefono || null,
        email || null,
        cargo || null,
        especialidad || null,
        fecha_contratacion || null,
        comision_venta || 0,
        comision_fija || 0,
        sueldo_mensual || 0,
        id
      ]
    );

    res.json({ message: 'Empleado actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar empleado (cambiar estado a Inactivo)
exports.deletePersonal = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el empleado existe
    const [existingEmployee] = await pool.query(
      'SELECT id FROM personal WHERE id = ? AND estado = "Activo"',
      [id]
    );

    if (existingEmployee.length === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    // Cambiar estado a Inactivo
    await pool.execute(
      'UPDATE personal SET estado = "Inactivo" WHERE id = ?',
      [id]
    );

    res.json({ message: 'Empleado eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Buscar empleados por término
exports.searchPersonal = async (req, res) => {
  try {
    const { termino } = req.query;
    
    if (!termino) {
      return res.status(400).json({ message: 'Término de búsqueda requerido' });
    }

    const [rows] = await pool.query(`
      SELECT 
        id,
        dni,
        CONCAT(nombre, ' ', apellido) as nombreCompleto,
        nombre,
        apellido,
        direccion,
        telefono,
        email,
        cargo,
        especialidad,
        DATE_FORMAT(fecha_contratacion, '%d/%m/%Y') as fechaContratacion,
        comision_venta,
        comision_fija,
        sueldo_mensual,
        estado
      FROM personal 
      WHERE estado = 'Activo' 
        AND (
          dni LIKE ? OR 
          nombre LIKE ? OR 
          apellido LIKE ? OR 
          email LIKE ? OR 
          cargo LIKE ? OR 
          especialidad LIKE ?
        )
      ORDER BY nombre, apellido
    `, [
      `%${termino}%`,
      `%${termino}%`,
      `%${termino}%`,
      `%${termino}%`,
      `%${termino}%`,
      `%${termino}%`
    ]);

    res.json(rows);
  } catch (error) {
    console.error('Error al buscar personal:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}; 