const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Configuración de la base de datos MySQL (conexión inicial como root)
const rootConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Intentar sin contraseña primero
  port: 3306
};

// Configuración para el usuario de la aplicación
const appConfig = {
  host: 'localhost',
  user: 'nhestetica_user',
  password: 'nhestetica123',
  database: 'nhestetica_db',
  port: 3306
};

async function setupDatabase() {
  let rootConnection;
  let appConnection;
  
  try {
    console.log('🔧 Configurando base de datos...');
    
    // Intentar conectar como root sin contraseña
    try {
      rootConnection = await mysql.createConnection(rootConfig);
      console.log('✅ Conexión como root exitosa (sin contraseña)');
    } catch (error) {
      console.log('⚠️  No se pudo conectar como root sin contraseña');
      console.log('💡 Intentando con contraseñas comunes...');
      
      // Probar contraseñas comunes
      const commonPasswords = ['root', 'admin', '1234', 'password', 'mysql'];
      
      for (const password of commonPasswords) {
        try {
          rootConfig.password = password;
          rootConnection = await mysql.createConnection(rootConfig);
          console.log(`✅ Conexión como root exitosa con contraseña: ${password}`);
          break;
        } catch (err) {
          // Continuar con la siguiente contraseña
        }
      }
      
      if (!rootConnection) {
        throw new Error('No se pudo conectar como root con ninguna contraseña común');
      }
    }
    
    // Crear la base de datos si no existe
    await rootConnection.execute('CREATE DATABASE IF NOT EXISTS nhestetica_db');
    console.log('✅ Base de datos "nhestetica_db" creada/verificada');
    
    // Crear usuario para la aplicación
    try {
      await rootConnection.execute(`
        CREATE USER IF NOT EXISTS 'nhestetica_user'@'localhost' 
        IDENTIFIED BY 'nhestetica123'
      `);
      console.log('✅ Usuario "nhestetica_user" creado');
      
      // Dar permisos al usuario
      await rootConnection.execute(`
        GRANT ALL PRIVILEGES ON nhestetica_db.* TO 'nhestetica_user'@'localhost'
      `);
      await rootConnection.execute('FLUSH PRIVILEGES');
      console.log('✅ Permisos otorgados al usuario');
      
    } catch (error) {
      console.log('⚠️  Error creando usuario (puede que ya exista):', error.message);
    }
    
    // Cerrar conexión root
    await rootConnection.end();
    
    // Conectar con el usuario de la aplicación
    appConnection = await mysql.createConnection(appConfig);
    console.log('✅ Conexión con usuario de aplicación exitosa');
    
    // Crear tabla de usuarios
    await appConnection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla "users" creada/verificada');
    
    // Verificar si ya existe el usuario 'user'
    const [existingUsers] = await appConnection.execute(
      'SELECT * FROM users WHERE username = ?',
      ['user']
    );
    
    // Si no existe, crear el usuario con contraseña hasheada
    if (existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('123', 10);
      
      await appConnection.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        ['user', hashedPassword]
      );
      console.log('✅ Usuario "user" creado con contraseña "123"');
    } else {
      console.log('ℹ️  Usuario "user" ya existe');
    }
    
    // Mostrar usuarios existentes
    const [users] = await appConnection.execute('SELECT id, username, created_at FROM users');
    console.log('\n📋 Usuarios en la base de datos:');
    users.forEach(user => {
      console.log(`   - ID: ${user.id}, Usuario: ${user.username}, Creado: ${user.created_at}`);
    });
    
    console.log('\n🎉 Configuración completada exitosamente!');
    console.log('🚀 Puedes ejecutar "npm start" para iniciar el servidor');
    console.log('\n📝 Credenciales de la aplicación:');
    console.log('   Usuario MySQL: nhestetica_user');
    console.log('   Contraseña MySQL: nhestetica123');
    console.log('   Base de datos: nhestetica_db');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    console.log('\n💡 Opciones para solucionar:');
    console.log('   1. Instalar MySQL Workbench y configurar desde ahí');
    console.log('   2. Usar XAMPP/WAMP que viene con MySQL preconfigurado');
    console.log('   3. Reinstalar MySQL y recordar la contraseña de root');
  } finally {
    if (rootConnection) {
      await rootConnection.end();
    }
    if (appConnection) {
      await appConnection.end();
    }
  }
}

// Ejecutar configuración
setupDatabase(); 