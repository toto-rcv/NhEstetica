const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { pool, testConnection, initializeDatabase } = require('./config/database');
const { authenticateToken, generateToken } = require('./middleware/auth');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Inicializar la base de datos al arrancar el servidor
async function startServer() {
  await testConnection();
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
  });
}

// Endpoint de login con MySQL
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Validar que se proporcionen ambos campos
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Usuario y contraseña son requeridos' 
    });
  }
  
  try {
    // Buscar usuario en la base de datos
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario o contraseña incorrectos' 
      });
    }
    
    const user = users[0];
    
    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario o contraseña incorrectos' 
      });
    }
    
    // Generar token JWT
    const token = generateToken(user);
    
    res.json({ 
      success: true, 
      message: 'Login exitoso',
      user: { 
        id: user.id, 
        username: user.username 
      },
      token: token
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Endpoint para verificar si el usuario está autenticado
app.get('/api/check-auth', authenticateToken, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Usuario autenticado',
    user: req.user
  });
});

// Endpoint para logout (opcional, ya que el logout se maneja en el frontend)
app.post('/api/logout', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Logout exitoso' 
  });
});

// Endpoint de prueba
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: '¡Hola desde el backend con MySQL!' });
});

// Iniciar el servidor
startServer().catch(console.error);
