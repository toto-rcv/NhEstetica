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
        GREATEST(
          COALESCE((SELECT MAX(fecha) FROM ventas_productos WHERE cliente_id = c.id), '1900-01-01'),
          COALESCE((SELECT MAX(fecha) FROM ventas_tratamientos WHERE cliente_id = c.id), '1900-01-01')
        ) as ultima_compra,
        (
          COALESCE((SELECT COUNT(*) FROM ventas_productos WHERE cliente_id = c.id), 0) +
          COALESCE((SELECT COUNT(*) FROM ventas_tratamientos WHERE cliente_id = c.id), 0)
        ) as total_compras
      FROM clientes c
      WHERE (
        EXISTS (SELECT 1 FROM ventas_productos WHERE cliente_id = c.id AND fecha >= DATE_SUB(NOW(), INTERVAL 1 MONTH)) OR
        EXISTS (SELECT 1 FROM ventas_tratamientos WHERE cliente_id = c.id AND fecha >= DATE_SUB(NOW(), INTERVAL 1 MONTH))
      )
      ORDER BY ultima_compra DESC
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
          GREATEST(
            COALESCE((SELECT MAX(fecha) FROM ventas_productos WHERE cliente_id = c.id), '1900-01-01'),
            COALESCE((SELECT MAX(fecha) FROM ventas_tratamientos WHERE cliente_id = c.id), '1900-01-01')
          ) as ultima_compra,
          (
            COALESCE((SELECT COUNT(*) FROM ventas_productos WHERE cliente_id = c.id), 0) +
            COALESCE((SELECT COUNT(*) FROM ventas_tratamientos WHERE cliente_id = c.id), 0)
          ) as total_compras
        FROM clientes c
        WHERE c.id NOT IN (${placeholders})
        AND (
          EXISTS (SELECT 1 FROM ventas_productos WHERE cliente_id = c.id AND fecha < DATE_SUB(NOW(), INTERVAL 3 MONTH)) OR
          EXISTS (SELECT 1 FROM ventas_tratamientos WHERE cliente_id = c.id AND fecha < DATE_SUB(NOW(), INTERVAL 3 MONTH))
        )
        ORDER BY ultima_compra DESC
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
          GREATEST(
            COALESCE((SELECT MAX(fecha) FROM ventas_productos WHERE cliente_id = c.id), '1900-01-01'),
            COALESCE((SELECT MAX(fecha) FROM ventas_tratamientos WHERE cliente_id = c.id), '1900-01-01')
          ) as ultima_compra,
          (
            COALESCE((SELECT COUNT(*) FROM ventas_productos WHERE cliente_id = c.id), 0) +
            COALESCE((SELECT COUNT(*) FROM ventas_tratamientos WHERE cliente_id = c.id), 0)
          ) as total_compras
        FROM clientes c
        WHERE (
          EXISTS (SELECT 1 FROM ventas_productos WHERE cliente_id = c.id AND fecha < DATE_SUB(NOW(), INTERVAL 3 MONTH)) OR
          EXISTS (SELECT 1 FROM ventas_tratamientos WHERE cliente_id = c.id AND fecha < DATE_SUB(NOW(), INTERVAL 3 MONTH))
        )
        ORDER BY ultima_compra DESC
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

    // Consulta simplificada sin la columna estado
    const [rows] = await pool.execute(`
      SELECT 
        c.id,
        c.nombre,
        c.apellido,
        CONCAT(c.nombre, ' ', c.apellido) as cliente,
        CAST(COALESCE(
          (SELECT SUM(vp.precio * vp.cantidad) 
           FROM ventas_productos vp 
           WHERE vp.cliente_id = c.id 
           AND MONTH(vp.fecha) = ? AND YEAR(vp.fecha) = ?), 0
        ) AS DECIMAL(15,2)) +
        CAST(COALESCE(
          (SELECT SUM(vt.precio * vt.sesiones) 
           FROM ventas_tratamientos vt 
           WHERE vt.cliente_id = c.id 
           AND MONTH(vt.fecha) = ? AND YEAR(vt.fecha) = ?), 0
        ) AS DECIMAL(15,2)) as total_mes,
        CAST(COALESCE(
          (SELECT SUM(vp.precio * vp.cantidad) 
           FROM ventas_productos vp 
           WHERE vp.cliente_id = c.id 
           AND YEAR(vp.fecha) = ?), 0
        ) AS DECIMAL(15,2)) +
        CAST(COALESCE(
          (SELECT SUM(vt.precio * vt.sesiones) 
           FROM ventas_tratamientos vt 
           WHERE vt.cliente_id = c.id 
           AND YEAR(vt.fecha) = ?), 0
        ) AS DECIMAL(15,2)) as total_año
      FROM clientes c
      HAVING total_año > 0 OR total_mes > 0
      ORDER BY total_año DESC, total_mes DESC
    `, [currentMonth, currentYear, currentMonth, currentYear, currentYear, currentYear]);

    console.log('Clientes encontrados:', rows.length);

    // Agregar ranking basado en el total del año y convertir valores a números
    const clientesConRanking = rows.map((cliente, index) => ({
      ...cliente,
      total_mes: parseFloat(cliente.total_mes) || 0,
      total_año: parseFloat(cliente.total_año) || 0,
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
      let maxGastoMes = 0;
      let clienteMaxGastoMes = null;
      
      clientesConRanking.forEach(cliente => {
        const gastoMes = parseFloat(cliente.total_mes) || 0;
        if (gastoMes > maxGastoMes) {
          maxGastoMes = gastoMes;
          clienteMaxGastoMes = cliente;
        }
      });
      clienteMasGastoMes = clienteMaxGastoMes;

      // Encontrar cliente que más gastó en el año
      let maxGastoAño = 0;
      let clienteMaxGastoAño = null;
      
      clientesConRanking.forEach(cliente => {
        const gastoAño = parseFloat(cliente.total_año) || 0;
        if (gastoAño > maxGastoAño) {
          maxGastoAño = gastoAño;
          clienteMaxGastoAño = cliente;
        }
      });
      clienteMasGastoAño = clienteMaxGastoAño;

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
      'SELECT COUNT(*) as total FROM clientes'
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