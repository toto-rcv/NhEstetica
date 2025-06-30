const db = require('../config/database');

// Obtener todos los tratamientos
exports.getAllTratamientos = async (req, res) => {
  try {
    const [rows] = await db.pool.query('SELECT * FROM tratamientos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tratamientos' });
  }
};

// Obtener tratamiento por nombre
exports.getTratamientoByNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    const [rows] = await db.pool.query('SELECT * FROM tratamientos WHERE nombre = ?', [nombre]);
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar tratamiento por nombre' });
  }
};

// Obtener tratamiento por ID
exports.getTratamientoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.pool.query('SELECT * FROM tratamientos WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar tratamiento por ID' });
  }
};

// Crear tratamiento
exports.createTratamiento = async (req, res) => {
  try {
    const { nombre, precio, descripcion, categoria, imagen, duracion } = req.body;
    if (!nombre || !precio || !categoria) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const [result] = await db.pool.query(
      'INSERT INTO tratamientos (nombre, precio, descripcion, categoria, imagen, duracion) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, precio, descripcion || '', categoria, imagen || '', duracion || '']
    );
    res.status(201).json({ id: result.insertId, nombre, precio, descripcion, categoria, imagen, duracion });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear tratamiento' });
  }
};

// Actualizar tratamiento
exports.updateTratamiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion, categoria, imagen, duracion } = req.body;
    const [result] = await db.pool.query(
      'UPDATE tratamientos SET nombre = ?, precio = ?, descripcion = ?, categoria = ?, imagen = ?, duracion = ? WHERE id = ?',
      [nombre, precio, descripcion || '', categoria, imagen || '', duracion || '', id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ id, nombre, precio, descripcion, categoria, imagen, duracion });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar tratamiento' });
  }
};

// Eliminar tratamiento
exports.deleteTratamiento = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.pool.query('DELETE FROM tratamientos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Tratamiento eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar tratamiento' });
  }
};
