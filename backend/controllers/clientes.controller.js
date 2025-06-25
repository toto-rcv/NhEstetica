const { pool } = require('../config/database');

exports.getClientes = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM clientes');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener clientes:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getClienteById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createCliente = async (req, res) => {
  try {
    const { nombre, apellido, direccion, telefono, email, antiguedad } = req.body;
    const imagen = req.file ? req.file.filename : null;

    if (!nombre || !apellido) {
      return res.status(400).json({ message: 'Nombre y apellido son requeridos' });
    }

    await pool.execute(
      `INSERT INTO clientes 
       (nombre, apellido, direccion, telefono, email, antiguedad, imagen, fecha_inscripcion, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 'Activo')`,
      [nombre, apellido, direccion || '', telefono || '', email || '', antiguedad || 0, imagen]
    );

    res.status(201).json({ message: 'Cliente creado exitosamente' });
  } catch (err) {
    console.error('Error al crear cliente:', err);
    res.status(500).json({ message: 'Error al crear cliente' });
  }
};

exports.updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, direccion, telefono, email, antiguedad } = req.body;
    const imagen = req.file ? req.file.filename : null;

    if (imagen) {
      await pool.execute(
        `UPDATE clientes SET nombre = ?, apellido = ?, direccion = ?, telefono = ?, email = ?, antiguedad = ?, imagen = ? WHERE id = ?`,
        [nombre, apellido, direccion || '', telefono || '', email || '', antiguedad || 0, imagen, id]
      );
    } else {
      await pool.execute(
        `UPDATE clientes SET nombre = ?, apellido = ?, direccion = ?, telefono = ?, email = ?, antiguedad = ? WHERE id = ?`,
        [nombre, apellido, direccion || '', telefono || '', email || '', antiguedad || 0, id]
      );
    }

    res.json({ message: 'Cliente actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar cliente:', err);
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
};

exports.deleteCliente = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM clientes WHERE id = ?', [id]);
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar cliente:', err);
    res.status(500).json({ message: 'Error al eliminar cliente' });
  }
};

exports.searchClientes = async (req, res) => {
  const { term } = req.query;
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM clientes WHERE nombre LIKE ? OR apellido LIKE ?`,
      [`%${term}%`, `%${term}%`]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar clientes' });
  }
};
