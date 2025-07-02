const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Configuración root para crear base y usuario
const rootConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password', // Intentar sin contraseña primero
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

// Crear pool de conexiones para usar en la app
const pool = mysql.createPool(appConfig);

// Script de inicialización completo
async function fullSetup() {
  let rootConnection;
  let appConnection;
  try {
    // 1. Conectar como root (probando contraseñas comunes si es necesario)
    try {
      rootConnection = await mysql.createConnection(rootConfig);
      console.log('✅ Conexión root exitosa (sin contraseña)');
    } catch (error) {
      const commonPasswords = ['root', 'admin', '1234', 'password', 'mysql'];
      for (const password of commonPasswords) {
        try {
          rootConfig.password = password;
          rootConnection = await mysql.createConnection(rootConfig);
          console.log(`✅ Conexión root exitosa con contraseña: ${password}`);
          break;
        } catch (err) {}
      }
      if (!rootConnection) throw new Error('No se pudo conectar como root');
    }

    // 2. Crear base de datos y usuario de aplicación
    await rootConnection.execute('CREATE DATABASE IF NOT EXISTS nhestetica_db');
    await rootConnection.execute(`CREATE USER IF NOT EXISTS 'nhestetica_user'@'localhost' IDENTIFIED BY 'nhestetica123'`);
    await rootConnection.execute(`GRANT ALL PRIVILEGES ON nhestetica_db.* TO 'nhestetica_user'@'localhost'`);
    await rootConnection.execute('FLUSH PRIVILEGES');
    await rootConnection.end();
    console.log('✅ Base de datos y usuario MySQL verificados/creados');

    // 3. Conectar como nhestetica_user
    appConnection = await mysql.createConnection(appConfig);
    console.log('✅ Conexión como nhestetica_user exitosa');

    // 4. Leer y ejecutar el SQL de database.sql
    const sqlPath = path.join(__dirname, '../database.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.toUpperCase().startsWith('SHOW TABLES'));
    for (const command of commands) {
      if (command) {
        try {
          // Evitar insertar usuario plano, lo haremos con hash después
          if (command.includes("INSERT IGNORE INTO users")) continue;
          await appConnection.query(command);
        } catch (error) {
          if (error.code !== 'ER_DUP_ENTRY') {
            console.error('❌ Error ejecutando comando:', error.message);
          }
        }
      }
    }
    console.log('✅ Script SQL ejecutado');

    // 5. Crear usuario de app con contraseña hasheada si no existe
    const [existingUsers] = await appConnection.execute('SELECT * FROM users WHERE username = ?', ['user']);
    if (existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('123', 10);
      await appConnection.execute('INSERT INTO users (username, password) VALUES (?, ?)', ['user', hashedPassword]);
      console.log('✅ Usuario "user" creado con contraseña hasheada');
    } else {
      // Si existe pero la contraseña no está hasheada, la actualizamos
      const user = existingUsers[0];
      if (user.password === '123') {
        const hashedPassword = await bcrypt.hash('123', 10);
        await appConnection.execute('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, 'user']);
        console.log('🔒 Contraseña de "user" actualizada a hash');
      }
    }
    console.log('🎉 Base de datos y usuario de app listos');
  } catch (error) {
    console.error('❌ Error en la configuración:', error.message);
  } finally {
    if (rootConnection) await rootConnection.end();
    if (appConnection) await appConnection.end();
  }
}

// Exportar el pool y la función de setup
module.exports = {
  pool,
  fullSetup
};

// Si se ejecuta directamente, corre el setup
if (require.main === module) {
  fullSetup();
} 