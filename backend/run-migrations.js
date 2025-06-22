const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'nhestetica_user',
  password: 'nhestetica123',
  database: 'nhestetica_db'
};

async function runMigrations() {
  let connection;
  
  try {
    // Conectar a MySQL
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    console.log('✅ Conectado a MySQL');

    // Obtener todos los archivos de migración ordenados
    const migrationsDir = path.join(__dirname, 'migraciones');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ordenar alfabéticamente (001_, 002_, etc.)

    console.log(`📁 Encontradas ${migrationFiles.length} migraciones`);

    // Ejecutar cada migración
    for (const file of migrationFiles) {
      console.log(`\n🔄 Ejecutando migración: ${file}`);
      
      const filePath = path.join(migrationsDir, file);
      const sqlContent = fs.readFileSync(filePath, 'utf8');
      
      // Dividir el contenido en comandos individuales
      const commands = sqlContent
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

      // Ejecutar cada comando de la migración
      for (const command of commands) {
        if (command.trim()) {
          try {
            await connection.query(command);
            console.log(`   ✅ Comando ejecutado: ${command.substring(0, 50)}...`);
          } catch (error) {
            if (error.code !== 'ER_DUP_ENTRY') { // Ignorar errores de duplicados
              console.error(`   ❌ Error: ${error.message}`);
            } else {
              console.log(`   ⚠️  Comando ya existe (ignorado)`);
            }
          }
        }
      }
      
      console.log(`✅ Migración ${file} completada`);
    }

    // Verificar las tablas creadas
    await connection.query('USE nhestetica_db');
    const [tables] = await connection.query('SHOW TABLES');
    
    console.log('\n📋 Tablas en la base de datos:');
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });

    console.log('\n🎉 Todas las migraciones ejecutadas exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Inicia el backend: npm start');
    console.log('   2. Inicia el frontend: npm start');
    console.log('   3. Ve a /login y autentícate');
    console.log('   4. Navega a /tablas para gestionar los datos');

  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error.message);
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

// Ejecutar las migraciones
runMigrations(); 