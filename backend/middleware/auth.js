const jwt = require('jsonwebtoken');

// Clave secreta para firmar los tokens (en producción debería estar en variables de entorno)
const JWT_SECRET = 'nhestetica_secret_key_2024';

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
    req.user = user;
    next();
  });
};

// Función para generar token JWT
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username || user.email, // Usar email para clientes, username para admins
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