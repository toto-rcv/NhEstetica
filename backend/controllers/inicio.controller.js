const { pool } = require('../config/database');

// Función auxiliar para obtener clientes activos y pasivos
async function obtenerClientesActivosYPasivos() {
  try {
    // Obtener clientes activos (compraron hace menos de 1 mes)
    const [clientesActivos] = await pool.execute(`
      SELECT 
        c.id,
        c.nombre,
        c.apellido,
        CONCAT(c.nombre, ' ', c.apellido) as cliente,
        MAX(v.fecha) as ultima_compra,
        COUNT(v.id) as total_compras
      FROM clientes c
      INNER JOIN ventas_productos v ON c.id = v.cliente_id
      WHERE v.fecha >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
      GROUP BY c.id, c.nombre, c.apellido
      ORDER BY MAX(v.fecha) DESC
    `);

    // Obtener IDs de clientes activos para excluirlos de pasivos
    const idsClientesActivos = clientesActivos.map(cliente => cliente.id);
    
    // Obtener clientes pasivos (compraron hace más de 3 meses) 
    // EXCLUYENDO los que ya están en activos
    let clientesPasivos = [];
    if (idsClientesActivos.length > 0) {
      const placeholders = idsClientesActivos.map(() => '?').join(',');
      const [result] = await pool.execute(`
        SELECT 
          c.id,
          c.nombre,
          c.apellido,
          CONCAT(c.nombre, ' ', c.apellido) as cliente,
          MAX(v.fecha) as ultima_compra,
          COUNT(v.id) as total_compras
        FROM clientes c
        INNER JOIN ventas_productos v ON c.id = v.cliente_id
        WHERE v.fecha < DATE_SUB(NOW(), INTERVAL 3 MONTH)
        AND c.id NOT IN (${placeholders})
        GROUP BY c.id, c.nombre, c.apellido
        ORDER BY MAX(v.fecha) DESC
      `, idsClientesActivos);
      clientesPasivos = result;
    } else {
      // Si no hay clientes activos, obtener todos los pasivos
      const [result] = await pool.execute(`
        SELECT 
          c.id,
          c.nombre,
          c.apellido,
          CONCAT(c.nombre, ' ', c.apellido) as cliente,
          MAX(v.fecha) as ultima_compra,
          COUNT(v.id) as total_compras
        FROM clientes c
        INNER JOIN ventas_productos v ON c.id = v.cliente_id
        WHERE v.fecha < DATE_SUB(NOW(), INTERVAL 3 MONTH)
        GROUP BY c.id, c.nombre, c.apellido
        ORDER BY MAX(v.fecha) DESC
      `);
      clientesPasivos = result;
    }

    // Obtener totales (solo cantidades, no montos)
    const totalClientesActivos = clientesActivos.length;
    const totalClientesPasivos = clientesPasivos.length;

    return {
      activos: {
        clientes: clientesActivos,
        cantidad: totalClientesActivos
      },
      pasivos: {
        clientes: clientesPasivos,
        cantidad: totalClientesPasivos
      }
    };
  } catch (error) {
    console.error('Error al obtener clientes activos y pasivos:', error);
    return {
      activos: {
        clientes: [],
        cantidad: 0
      },
      pasivos: {
        clientes: [],
        cantidad: 0
      }
    };
  }
}

// Test de conectividad básica
exports.testConnection = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 as test');
    res.json({ message: 'Conexión exitosa', data: rows });
  } catch (err) {
    console.error('Error de conexión:', err);
    res.status(500).json({ message: 'Error de conexión', error: err.message });
  }
};

// Test de consulta básica de clientes
exports.getClientesBasico = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, nombre, apellido FROM clientes LIMIT 10');
    res.json({ message: 'Consulta exitosa', clientes: rows });
  } catch (err) {
    console.error('Error al obtener clientes básico:', err);
    res.status(500).json({ message: 'Error al obtener clientes', error: err.message });
  }
};

// Obtener ranking de clientes
exports.getRankingClientes = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    console.log('Buscando clientes para mes:', currentMonth, 'año:', currentYear);

    // Intentar primero con la columna estado, si falla usar consulta sin estado
    let rows;
    try {
      [rows] = await pool.execute(`
        SELECT 
          c.id,
          c.nombre,
          c.apellido,
          CONCAT(c.nombre, ' ', c.apellido) as cliente,
          COALESCE(SUM(CASE 
            WHEN MONTH(v.fecha) = ? AND YEAR(v.fecha) = ? 
            THEN v.precio * v.cantidad 
            ELSE 0 
          END), 0) as total_mes,
          COALESCE(SUM(CASE 
            WHEN YEAR(v.fecha) = ? 
            THEN v.precio * v.cantidad 
            ELSE 0 
          END), 0) as total_año
        FROM clientes c
        LEFT JOIN ventas_productos v ON c.id = v.cliente_id
        WHERE c.estado = 'Activo'
        GROUP BY c.id, c.nombre, c.apellido
        ORDER BY total_año DESC, total_mes DESC
      `, [currentMonth, currentYear, currentYear]);
    } catch (error) {
      console.log('Error con columna estado, intentando sin estado:', error.message);
      // Si falla, intentar sin la columna estado
      [rows] = await pool.execute(`
        SELECT 
          c.id,
          c.nombre,
          c.apellido,
          CONCAT(c.nombre, ' ', c.apellido) as cliente,
          COALESCE(SUM(CASE 
            WHEN MONTH(v.fecha) = ? AND YEAR(v.fecha) = ? 
            THEN v.precio * v.cantidad 
            ELSE 0 
          END), 0) as total_mes,
          COALESCE(SUM(CASE 
            WHEN YEAR(v.fecha) = ? 
            THEN v.precio * v.cantidad 
            ELSE 0 
          END), 0) as total_año
        FROM clientes c
        LEFT JOIN ventas_productos v ON c.id = v.cliente_id
        GROUP BY c.id, c.nombre, c.apellido
        ORDER BY total_año DESC, total_mes DESC
      `, [currentMonth, currentYear, currentYear]);
    }

    console.log('Clientes encontrados:', rows.length);

    // Agregar ranking basado en el total del año
    const clientesConRanking = rows.map((cliente, index) => ({
      ...cliente,
      ranking: index + 1
    }));

    // Obtener información de clientes activos y pasivos
    const clientesActivosYPasivos = await obtenerClientesActivosYPasivos();

    // Valores por defecto para estadísticas
    let clienteMasGastoMes = {
      cliente: 'Sin datos',
      total: 0
    };
    let clienteMasGastoAño = {
      cliente: 'Sin datos',
      total: 0
    };

    // Solo calcular estadísticas si hay clientes
    if (clientesConRanking.length > 0) {
      // Encontrar cliente que más gastó en el mes
      clienteMasGastoMes = clientesConRanking.reduce((prev, current) => 
        (current.total_mes > prev.total_mes) ? current : prev
      );

      // Encontrar cliente que más gastó en el año
      clienteMasGastoAño = clientesConRanking.reduce((prev, current) => 
        (current.total_año > prev.total_año) ? current : prev
      );

      clienteMasGastoMes = {
        cliente: clienteMasGastoMes.cliente,
        total: clienteMasGastoMes.total_mes
      };

      clienteMasGastoAño = {
        cliente: clienteMasGastoAño.cliente,
        total: clienteMasGastoAño.total_año
      };
    }

    res.json({
      ranking: clientesConRanking,
      clientesActivosYPasivos: clientesActivosYPasivos,
      estadisticas: {
        clienteMasGastoMes: clienteMasGastoMes,
        clienteMasGastoAño: clienteMasGastoAño
      }
    });
  } catch (err) {
    console.error('Error al obtener ranking de clientes:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

// Obtener estadísticas generales del dashboard
exports.getEstadisticasGenerales = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Total de clientes activos
    const [clientesActivos] = await pool.execute(
      'SELECT COUNT(*) as total FROM clientes WHERE estado = "Activo"'
    );

    // Total de ventas del mes
    const [ventasMes] = await pool.execute(`
      SELECT 
        COUNT(*) as total_ventas,
        COALESCE(SUM(precio * cantidad), 0) as total_ingresos
      FROM ventas_productos 
      WHERE MONTH(fecha) = ? AND YEAR(fecha) = ?
    `, [currentMonth, currentYear]);

    // Total de ventas del año
    const [ventasAño] = await pool.execute(`
      SELECT 
        COUNT(*) as total_ventas,
        COALESCE(SUM(precio * cantidad), 0) as total_ingresos
      FROM ventas_productos 
      WHERE YEAR(fecha) = ?
    `, [currentYear]);

    res.json({
      clientesActivos: clientesActivos[0].total,
      ventasMes: {
        cantidad: ventasMes[0].total_ventas,
        ingresos: ventasMes[0].total_ingresos
      },
      ventasAño: {
        cantidad: ventasAño[0].total_ventas,
        ingresos: ventasAño[0].total_ingresos
      }
    });
  } catch (err) {
    console.error('Error al obtener estadísticas generales:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener tratamientos que vencen este mes
exports.getTratamientosVencimientoMes = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    console.log('Buscando tratamientos que vencen en mes:', currentMonth, 'año:', currentYear);

    const [rows] = await pool.execute(`
      SELECT 
        c.id as cliente_id,
        CONCAT(c.nombre, ' ', c.apellido) as cliente,
        t.nombre as tratamiento,
        vt.vencimiento as fecha_vencimiento,
        vt.sesiones,
        vt.precio,
        vt.fecha as fecha_compra
      FROM ventas_tratamientos vt
      INNER JOIN clientes c ON vt.cliente_id = c.id
      INNER JOIN tratamientos t ON vt.tratamiento_id = t.id
      WHERE MONTH(vt.vencimiento) = ? 
        AND YEAR(vt.vencimiento) = ?
        AND vt.vencimiento IS NOT NULL
      ORDER BY vt.vencimiento ASC
    `, [currentMonth, currentYear]);

    console.log('Tratamientos por vencer encontrados:', rows.length);

    res.json({
      tratamientos: rows,
      total: rows.length
    });
  } catch (err) {
    console.error('Error al obtener tratamientos por vencer:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
}; 