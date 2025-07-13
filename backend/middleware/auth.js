require('dotenv').config();
const jwt = require('jsonwebtoken');

// Clave secreta para firmar los tokens (en producción debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';


// Middleware para verificar si el usuario está autenticado
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de acceso requerido' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token inválido o expirado' 
      });
    }
    
    // Asegurar que el email esté disponible
    if (user.type === 'cliente' && user.email) {
      user.nombre = user.nombre || user.username;
      user.email = user.email;
    } else if (user.type === 'admin') {
      user.nombre = user.username;
      user.email = user.username; // Para admins, usar username como email
    }
    
    req.user = user;
    next();
  });
};

// Función para generar token JWT
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username || user.email, // Usar email para clientes, username para admins
    email: user.email || user.username, // Incluir email explícitamente
    nombre: user.nombre || user.username,
    type: user.type || (user.username ? 'admin' : 'cliente')
  };
  
  return jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '24h' } // Token válido por 24 horas
  );
};

module.exports = {
  authenticateToken,
  generateToken,
  JWT_SECRET
}; 