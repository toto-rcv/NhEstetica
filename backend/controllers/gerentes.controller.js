const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

// Obtener todos los gerentes
exports.getGerentes = async (req, res) => {
  try {
    const [gerentes] = await pool.execute(`
      SELECT id, username, permisos, created_at 
      FROM users 
      WHERE permisos = 1 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: gerentes
    });
  } catch (error) {
    console.error('Error al obtener gerentes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear un nuevo gerente
exports.createGerente = async (req, res) => {
  const { username, password, permisos = 1 } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username y password son requeridos'
    });
  }

  try {
    // Verificar si el username ya existe
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un usuario con este email'
      });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo gerente
    const [result] = await pool.execute(`
      INSERT INTO users (username, password, permisos) 
      VALUES (?, ?, ?)
    `, [username, hashedPassword, permisos]);

    // Obtener el gerente creado
    const [newGerente] = await pool.execute(`
      SELECT id, username, permisos, created_at 
      FROM users 
      WHERE id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Gerente creado exitosamente',
      data: newGerente[0]
    });
  } catch (error) {
    console.error('Error al crear gerente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar un gerente
exports.updateGerente = async (req, res) => {
  const { id } = req.params;
  const { username, password, permisos } = req.body;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: 'Username es requerido'
    });
  }

  try {
    // Verificar si el gerente existe
    const [existingGerente] = await pool.execute(
      'SELECT id FROM users WHERE id = ? AND permisos = 1',
      [id]
    );

    if (existingGerente.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gerente no encontrado'
      });
    }

    // Verificar si el username ya existe en otro usuario
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE username = ? AND id != ?',
      [username, id]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un usuario con este email'
      });
    }

    let updateQuery = 'UPDATE users SET username = ?';
    let queryParams = [username];

    // Si se proporciona una nueva contraseña, hashearla
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ', password = ?';
      queryParams.push(hashedPassword);
    }

    // Si se proporcionan permisos, actualizarlos
    if (permisos !== undefined) {
      updateQuery += ', permisos = ?';
      queryParams.push(permisos);
    }

    updateQuery += ' WHERE id = ?';
    queryParams.push(id);

    await pool.execute(updateQuery, queryParams);

    // Obtener el gerente actualizado
    const [updatedGerente] = await pool.execute(`
      SELECT id, username, permisos, created_at 
      FROM users 
      WHERE id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Gerente actualizado exitosamente',
      data: updatedGerente[0]
    });
  } catch (error) {
    console.error('Error al actualizar gerente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar un gerente
exports.deleteGerente = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el gerente existe
    const [existingGerente] = await pool.execute(
      'SELECT id FROM users WHERE id = ? AND permisos = 1',
      [id]
    );

    if (existingGerente.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gerente no encontrado'
      });
    }

    // Eliminar el gerente
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Gerente eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar gerente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener un gerente específico
exports.getGerente = async (req, res) => {
  const { id } = req.params;

  try {
    const [gerente] = await pool.execute(`
      SELECT id, username, permisos, created_at 
      FROM users 
      WHERE id = ? AND permisos = 1
    `, [id]);

    if (gerente.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gerente no encontrado'
      });
    }

    res.json({
      success: true,
      data: gerente[0]
    });
  } catch (error) {
    console.error('Error al obtener gerente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}; 