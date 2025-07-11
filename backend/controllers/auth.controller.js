const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { generateToken } = require('../middleware/auth');

exports.register = async (req, res) => {
  const { nombre, apellido, email, direccion, telefono, password } = req.body;
  
  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nombre, apellido, email y contraseña son requeridos' 
    });
  }

  try {
    // Verificar si el email ya existe en clientes
    const [existingCliente] = await pool.execute('SELECT * FROM clientes WHERE email = ?', [email]);
    
    if (existingCliente.length > 0) {
      return res.status(409).json({ success: false, message: 'Ya existe un cliente con este email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    await pool.execute(`
      INSERT INTO clientes (nombre, apellido, email, direccion, telefono, password, fecha_inscripcion) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [nombre, apellido, email, direccion, telefono, hashedPassword, fechaActual]);
    
    res.status(201).json({ success: true, message: 'Cliente registrado con éxito' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'El usuario y la contraseña son requeridos' });
  }

  try {
    let user = null;
    let userType = null;

    // Primero buscar en usuarios (administradores) - buscar por username (que ahora es email)
    const [users] = await pool.execute('SELECT * FROM users WHERE username = ?', [email]);
    
    if (users.length > 0) {
      user = users[0];
      userType = 'admin';
    } else {
      // Si no está en users, buscar en clientes por email
      const [clientes] = await pool.execute('SELECT * FROM clientes WHERE email = ?', [email]);
      
      if (clientes.length > 0) {
        user = clientes[0];
        userType = 'cliente';
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'El usuario o la contraseña es incorrecto' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'El usuario o la contraseña es incorrecto' });
    }

    const token = generateToken(user);
    
    if (userType === 'admin') {
      const userData = { 
        id: user.id, 
        username: user.username,
        permisos: user.permisos,
        type: 'admin'
      };
      
      // Debug: mostrar información del usuario
      console.log('Login admin - Usuario:', userData);
      console.log('Permisos:', userData.permisos);
      
      const token = generateToken(userData);
      
      res.json({
        success: true,
        message: 'Login exitoso',
        user: userData,
        token
      });
    } else {
      const userData = { 
        id: user.id, 
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        imagen: user.imagen,
        type: 'cliente'
      };
      const token = generateToken(userData);
      
      res.json({
        success: true,
        message: 'Login exitoso',
        user: userData,
        token
      });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.checkAuth = (req, res) => {
  res.json({ success: true, message: 'Usuario autenticado', user: req.user });
};

exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logout exitoso' });
};
