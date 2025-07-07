const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

exports.getClientes = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM clientes ORDER BY created_at DESC');
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

exports.getClienteByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM clientes WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener cliente por email:', err);
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

    // Validar campos requeridos
    if (!nombre || !apellido) {
      return res.status(400).json({ message: 'Nombre y apellido son requeridos' });
    }

    // Verificar si el cliente existe
    const [existingCliente] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [id]);
    if (existingCliente.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Procesar la fecha de antiguedad si es necesario
    if (antiguedad && antiguedad.includes('T')) {
      antiguedad = antiguedad.slice(0, 10);
    }

    let imagen = req.body.imagen;
    let eliminarAnterior = false;
    let imagenAnterior = null;

    // Si se subió una nueva imagen
    if (req.file) {
      imagen = `/images-de-clientes/${req.file.filename}`;
      eliminarAnterior = true;
      imagenAnterior = existingCliente[0].imagen;
    }

    // Construir la query dinámicamente
    let query = `UPDATE clientes SET 
      nombre = ?, 
      apellido = ?, 
      direccion = ?, 
      telefono = ?, 
      email = ?, 
      antiguedad = ?, 
      nacionalidad = ?`;
    
    let values = [
      nombre,
      apellido,
      direccion || '',
      telefono || '',
      email || '',
      antiguedad || null,
      nacionalidad || null
    ];

    // Si hay nueva imagen, incluirla en la query
    if (imagen) {
      query += ', imagen = ?';
      values.push(imagen);
    }

    query += ' WHERE id = ?';
    values.push(id);

    // Ejecutar la actualización
    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Eliminar imagen anterior si se subió una nueva
    if (eliminarAnterior && imagenAnterior) {
      const rutaFisica = path.join(__dirname, '../public', imagenAnterior);
      try {
        if (fs.existsSync(rutaFisica)) {
          fs.unlink(rutaFisica, (err) => {
            if (err) console.error('No se pudo eliminar la imagen anterior:', err);
          });
        }
      } catch (err) {
        console.error('Error comprobando o eliminando la imagen anterior:', err);
      }
    }

    // Obtener el cliente actualizado
    const [updatedCliente] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [id]);
    
    res.json({
      message: 'Cliente actualizado correctamente',
      cliente: updatedCliente[0]
    });

  } catch (err) {
    console.error('Error al actualizar cliente:', err);
    res.status(500).json({ 
      message: 'Error al actualizar cliente',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
  }
};

exports.deleteCliente = async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar si el cliente existe
    const [existingCliente] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [id]);
    if (existingCliente.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Verificar si el cliente tiene registros relacionados
    const [turnos] = await pool.execute('SELECT COUNT(*) as count FROM turnos WHERE cliente_id = ?', [id]);
    const [ventasTratamientos] = await pool.execute('SELECT COUNT(*) as count FROM ventas_tratamientos WHERE cliente_id = ?', [id]);
    const [ventasProductos] = await pool.execute('SELECT COUNT(*) as count FROM ventas_productos WHERE cliente_id = ?', [id]);

    if (turnos[0].count > 0 || ventasTratamientos[0].count > 0 || ventasProductos[0].count > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar el cliente porque tiene registros relacionados',
        details: {
          turnos: turnos[0].count,
          ventasTratamientos: ventasTratamientos[0].count,
          ventasProductos: ventasProductos[0].count
        }
      });
    }

    // Eliminar la imagen del cliente si existe
    if (existingCliente[0].imagen) {
      const rutaFisica = path.join(__dirname, '../public', existingCliente[0].imagen);
      try {
        if (fs.existsSync(rutaFisica)) {
          fs.unlinkSync(rutaFisica);
        }
      } catch (err) {
        console.error('Error al eliminar la imagen del cliente:', err);
        // No fallar si no se puede eliminar la imagen
      }
    }

    // Eliminar el cliente
    const [result] = await pool.execute('DELETE FROM clientes WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar cliente:', err);
    
    // Manejar errores específicos de MySQL
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ 
        message: 'No se puede eliminar el cliente porque tiene registros relacionados en otras tablas' 
      });
    }
    
    res.status(500).json({ 
      message: 'Error al eliminar cliente',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
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
