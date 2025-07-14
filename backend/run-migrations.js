require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos desde variables de entorno
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'nhestetica_user',
  password: process.env.DB_PASSWORD || 'nhestetica123',
  database: process.env.DB_NAME || 'nhestetica_db',
  port: process.env.DB_PORT || 3306
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
      
      // Limpiar el contenido SQL
      let cleanSql = sqlContent
        // Remover comentarios de una línea que empiecen con --
        .replace(/--.*$/gm, '')
        // Remover líneas vacías
        .replace(/^\s*[\r\n]/gm, '')
        // Remover espacios en blanco al inicio y final
        .trim();

      // Dividir el contenido en comandos individuales
      const commands = cleanSql
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0);

      console.log(`   📝 Encontrados ${commands.length} comandos SQL`);

      // Ejecutar cada comando de la migración
      for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        if (command.trim()) {
          try {
            console.log(`   🔄 Ejecutando comando ${i + 1}/${commands.length}: ${command.substring(0, 60)}...`);
            await connection.query(command);
            console.log(`   ✅ Comando ${i + 1} ejecutado exitosamente`);
          } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
              console.log(`   ⚠️  Comando ${i + 1} ya existe (ignorado)`);
            } else if (error.code === 'ER_DB_CREATE_EXISTS') {
              console.log(`   ⚠️  Base de datos ya existe (ignorado)`);
            } else if (error.code === 'ER_TABLE_EXISTS_ERROR') {
              console.log(`   ⚠️  Tabla ya existe (ignorado)`);
            } else {
              console.error(`   ❌ Error en comando ${i + 1}: ${error.message}`);
              console.error(`   Comando: ${command.substring(0, 100)}...`);
            }
          }
        }
      }
      
      console.log(`✅ Migración ${file} completada`);
    }

    // Verificar las tablas creadas
    console.log('\n🔍 Verificando tablas creadas...');
    await connection.query('USE nhestetica_db');
    const [tables] = await connection.query('SHOW TABLES');
    
    console.log('\n📋 Tablas en la base de datos:');
    if (tables.length === 0) {
      console.log('   ❌ No se encontraron tablas. Algo salió mal.');
    } else {
      tables.forEach(table => {
        console.log(`   ✅ ${Object.values(table)[0]}`);
      });
    }

    // Verificar datos iniciales
    console.log('\n🔍 Verificando datos iniciales...');
    try {
      const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
      console.log(`   👥 Usuarios: ${users[0].count}`);
      
      const [horarios] = await connection.query('SELECT COUNT(*) as count FROM configuracion_horarios');
      console.log(`   🕐 Horarios configurados: ${horarios[0].count}`);
    } catch (error) {
      console.log(`   ⚠️  Error verificando datos: ${error.message}`);
    }

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