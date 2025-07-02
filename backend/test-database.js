const { pool } = require('./config/database');

async function testDatabase() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Probar conexión básica
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa');
    
    // Verificar si la tabla personal existe
    const [tables] = await connection.query('SHOW TABLES LIKE "personal"');
    if (tables.length === 0) {
      console.log('❌ La tabla "personal" NO existe');
      connection.release();
      return;
    }
    console.log('✅ La tabla "personal" existe');
    
    // Verificar la estructura de la tabla
    const [columns] = await connection.query('DESCRIBE personal');
    console.log('📋 Estructura de la tabla personal:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key ? col.Key : ''}`);
    });
    
    // Probar consulta básica
    const [count] = await connection.query('SELECT COUNT(*) as total FROM personal');
    console.log(`📊 Total de registros en personal: ${count[0].total}`);
    
    // Probar la consulta exacta del controlador
    const [rows] = await connection.query(`
      SELECT 
        id,
        dni,
        CONCAT(nombre, ' ', apellido) as nombreCompleto,
        nombre,
        apellido,
        direccion,
        telefono,
        email,
        cargo,
        especialidad,
        DATE_FORMAT(fecha_contratacion, '%d/%m/%Y') as fechaContratacion,
        comision_venta,
        comision_fija,
        sueldo_mensual,
        estado,
        created_at,
        updated_at
      FROM personal 
      WHERE estado = 'Activo'
      ORDER BY nombre, apellido
    `);
    
    console.log(`🎯 Consulta del controlador ejecutada exitosamente. Resultados: ${rows.length}`);
    if (rows.length > 0) {
      console.log('📋 Primer registro:', rows[0]);
    }
    
    connection.release();
    console.log('✅ Todas las pruebas exitosas');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.error('📍 Stack trace:', error.stack);
  } finally {
    process.exit(0);
  }
}

testDatabase(); 