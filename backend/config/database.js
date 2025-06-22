const mysql = require('mysql2/promise');

// Configuración de la base de datos MySQL
const dbConfig = {
  host: 'localhost',
  user: 'nhestetica_user', // Usuario nuevo que crearemos
  password: 'nhestetica123', // Contraseña simple para desarrollo
  database: 'nhestetica_db', // Nombre de la base de datos
  port: 3306
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente');
    connection.release();
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message);
  }
}

// Función para inicializar la base de datos y crear las tablas
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Crear tabla de usuarios si no existe
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Verificar si ya existe el usuario 'user'
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      ['user']
    );
    
    // Si no existe, crear el usuario con contraseña hasheada
    if (existingUsers.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('123', 10);
      
      await connection.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        ['user', hashedPassword]
      );
      console.log('✅ Usuario "user" creado con contraseña "123"');
    }
    
    connection.release();
    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error.message);
  }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase
}; 