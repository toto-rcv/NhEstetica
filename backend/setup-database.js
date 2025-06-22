const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'nhestetica_user',
  password: 'nhestetica123', // Cambia esto por tu contraseña de MySQL
  database: 'nhestetica_db'
};

async function setupDatabase() {
  let connection;
  
  try {
    // Conectar a MySQL
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    console.log('✅ Conectado a MySQL');

    // Crear la base de datos si no existe
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    console.log(`✅ Base de datos '${dbConfig.database}' creada/verificada`);

    // Usar la base de datos
    await connection.query(`USE ${dbConfig.database}`);

    // Leer y ejecutar el script SQL
    const sqlPath = path.join(__dirname, 'database.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir el script en comandos individuales
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    // Ejecutar cada comando
    for (const command of commands) {
      if (command.trim()) {
        try {
          await connection.query(command);
          console.log(`✅ Comando ejecutado: ${command.substring(0, 50)}...`);
        } catch (error) {
          if (error.code !== 'ER_DUP_ENTRY') { // Ignorar errores de duplicados
            console.error(`❌ Error ejecutando comando: ${error.message}`);
          }
        }
      }
    }

    // Verificar que las tablas se crearon correctamente
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n📋 Tablas creadas:');
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });

    console.log('\n🎉 Base de datos configurada exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Inicia el backend: npm start');
    console.log('   2. Inicia el frontend: npm start');
    console.log('   3. Ve a /login y autentícate');
    console.log('   4. Navega a /tablas para gestionar los datos');

  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   - MySQL esté instalado y ejecutándose');
    console.log('   - Las credenciales en dbConfig sean correctas');
    console.log('   - Tengas permisos para crear bases de datos');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

// Ejecutar el script
setupDatabase(); 