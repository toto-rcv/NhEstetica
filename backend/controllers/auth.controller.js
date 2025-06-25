const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { generateToken } = require('../middleware/auth');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos' });
  }

  try {
    const [existing] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.status(201).json({ success: true, message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos' });
  }

  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: 'Login exitoso',
      user: { id: user.id, username: user.username },
      token
    });
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
