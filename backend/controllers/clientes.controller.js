const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

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
    const { nombre, apellido, direccion, telefono, email, antiguedad, nacionalidad } = req.body;
    let imagen = null;

    if (req.file) {
      imagen = `/images-de-clientes/${req.file.filename}`;
    } else if (req.body.imagen) {
      imagen = req.body.imagen;
    }

    if (!nombre || !apellido) {
      return res.status(400).json({ message: 'Nombre y apellido son requeridos' });
    }

    await pool.execute(
      `INSERT INTO clientes 
       (nombre, apellido, direccion, telefono, email, antiguedad, imagen, fecha_inscripcion, nacionalidad)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        nombre,
        apellido,
        direccion || '',
        telefono || '',
        email || '',
        antiguedad || 0,
        imagen || null,
        nacionalidad || null
      ]
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
    let { nombre, apellido, direccion, telefono, email, antiguedad, nacionalidad } = req.body;

    if (antiguedad && antiguedad.includes('T')) {
      antiguedad = antiguedad.slice(0, 10);
    }

    let imagen = req.body.imagen;
    let eliminarAnterior = false;
    let imagenAnterior = null;

    if (req.file) {
      imagen = `/images-de-clientes/${req.file.filename}`;
      eliminarAnterior = true;
    }

    if (eliminarAnterior) {
      const [rows] = await pool.execute('SELECT imagen FROM clientes WHERE id = ?', [id]);
      if (rows.length && rows[0].imagen) {
        imagenAnterior = rows[0].imagen;
      }
    }

    const query =
      imagen
        ? `UPDATE clientes SET nombre = ?, apellido = ?, direccion = ?, telefono = ?, email = ?, antiguedad = ?, imagen = ?, nacionalidad = ? WHERE id = ?`
        : `UPDATE clientes SET nombre = ?, apellido = ?, direccion = ?, telefono = ?, email = ?, antiguedad = ?, nacionalidad = ? WHERE id = ?`;

    const values =
      imagen
        ? [nombre, apellido, direccion || '', telefono || '', email || '', antiguedad || 0, imagen, nacionalidad || null, id]
        : [nombre, apellido, direccion || '', telefono || '', email || '', antiguedad || 0, nacionalidad || null, id];

    await pool.execute(query, values);

    if (eliminarAnterior && imagenAnterior) {
      const rutaFisica = path.join(__dirname, '../public', imagenAnterior);
      try {
        if (fs.existsSync(rutaFisica)) {
          fs.unlink(rutaFisica, (err) => {
            if (err) console.error('No se pudo eliminar la imagen anterior:', err);
          });
        } else {
          console.warn('La imagen anterior no existe en el servidor:', rutaFisica);
        }
      } catch (err) {
        console.error('Error comprobando o eliminando la imagen anterior:', err);
      }
    }

    const [rows] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [id]);
    res.json(rows[0] || { message: 'Cliente actualizado correctamente' });

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
