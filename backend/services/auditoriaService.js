const { pool } = require('../config/database');

class AuditoriaService {
  /**
   * Registrar un cambio en la auditoría
   * @param {Object} params - Parámetros del cambio
   * @param {string} params.tabla - Nombre de la tabla
   * @param {string} params.accion - Tipo de acción (INSERT, UPDATE, DELETE)
   * @param {number} params.registro_id - ID del registro afectado
   * @param {Object} params.datos_anteriores - Datos antes del cambio
   * @param {Object} params.datos_nuevos - Datos después del cambio
   * @param {Object} params.usuario - Información del usuario
   * @param {string} params.ip_address - IP del usuario
   * @param {string} params.user_agent - User agent del navegador
   */
  static async registrarCambio(params) {
    try {
      const {
        tabla,
        accion,
        registro_id,
        datos_anteriores,
        datos_nuevos,
        usuario,
        ip_address,
        user_agent
      } = params;

      // Generar detalles específicos del cambio
      const detalles = this.generarDetallesCambio(accion, datos_anteriores, datos_nuevos, tabla);

      const query = `
        INSERT INTO auditoria_caja (
          tabla, accion, registro_id, datos_anteriores, datos_nuevos,
          usuario_id, usuario_nombre, usuario_email, ip_address, user_agent, detalles
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        tabla,
        accion,
        registro_id,
        datos_anteriores ? JSON.stringify(datos_anteriores) : null,
        datos_nuevos ? JSON.stringify(datos_nuevos) : null,
        usuario?.id || null,
        usuario?.nombre || usuario?.username || null,
        usuario?.email || null,
        ip_address || null,
        user_agent || null,
        detalles
      ];

      await pool.execute(query, values);
    } catch (error) {
      console.error('Error al registrar auditoría:', error);
      // No lanzar error para no interrumpir el flujo principal
    }
  }

  /**
   * Generar detalles específicos del cambio
   * @param {string} accion - Tipo de acción
   * @param {Object} datosAnteriores - Datos antes del cambio
   * @param {Object} datosNuevos - Datos después del cambio
   * @param {string} tabla - Nombre de la tabla
   * @returns {string} Detalles del cambio
   */
  static generarDetallesCambio(accion, datosAnteriores, datosNuevos, tabla) {
    try {
      switch (accion) {
        case 'INSERT':
          return `Se agregó un nuevo registro en ${tabla}`;
        
        case 'UPDATE':
          if (!datosAnteriores || !datosNuevos) {
            return `Se modificó un registro en ${tabla}`;
          }
          
          const cambios = [];
          const datosAnt = typeof datosAnteriores === 'string' ? JSON.parse(datosAnteriores) : datosAnteriores;
          const datosNue = typeof datosNuevos === 'string' ? JSON.parse(datosNuevos) : datosNuevos;
          
          for (const [campo, valorNuevo] of Object.entries(datosNue)) {
            const valorAnterior = datosAnt[campo];
            if (valorAnterior !== valorNuevo) {
              // Formatear nombres de campos para mejor legibilidad
              const nombreCampo = this.formatearNombreCampo(campo);
              cambios.push(`${nombreCampo}: "${valorAnterior || 'vacío'}" → "${valorNuevo || 'vacío'}"`);
            }
          }
          
          return cambios.length > 0 ? cambios.join(', ') : `Se modificó un registro en ${tabla}`;
        
        case 'DELETE':
          return `Se eliminó un registro de ${tabla}`;
        
        default:
          return `Acción ${accion} en ${tabla}`;
      }
    } catch (error) {
      console.error('Error al generar detalles del cambio:', error);
      return `Acción ${accion} en ${tabla}`;
    }
  }

  /**
   * Formatear nombres de campos para mejor legibilidad
   * @param {string} campo - Nombre del campo
   * @returns {string} Nombre formateado
   */
  static formatearNombreCampo(campo) {
    const mapeo = {
      'monto_apertura': 'Monto de Apertura',
      'monto_cierre': 'Monto de Cierre',
      'fecha': 'Fecha',
      'detalle': 'Detalle',
      'forma_pago': 'Forma de Pago',
      'importe': 'Importe',
      'precio': 'Precio',
      'cantidad': 'Cantidad',
      'sesiones': 'Sesiones',
      'observacion': 'Observación',
      'estado': 'Estado',
      'nombre': 'Nombre',
      'apellido': 'Apellido',
      'email': 'Email',
      'telefono': 'Teléfono',
      'direccion': 'Dirección',
      'cargo': 'Cargo',
      'especialidad': 'Especialidad',
      'comision_venta': 'Comisión de Venta',
      'comision_fija': 'Comisión Fija',
      'sueldo_mensual': 'Sueldo Mensual'
    };
    
    return mapeo[campo] || campo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Obtener cambios de auditoría por fecha
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @returns {Array} Lista de cambios
   */
  static async obtenerCambiosPorFecha(fecha) {
    try {
      const query = `
        SELECT * FROM auditoria_caja 
        WHERE DATE(fecha_cambio) = ?
        ORDER BY fecha_cambio DESC
      `;
      
      const [rows] = await pool.execute(query, [fecha]);
      return rows;
    } catch (error) {
      console.error('Error al obtener auditoría:', error);
      throw error;
    }
  }

  /**
   * Obtener cambios de auditoría por tabla y fecha
   * @param {string} tabla - Nombre de la tabla
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @returns {Array} Lista de cambios
   */
  static async obtenerCambiosPorTablaYFecha(tabla, fecha) {
    try {
      const query = `
        SELECT * FROM auditoria_caja 
        WHERE tabla = ? AND DATE(fecha_cambio) = ?
        ORDER BY fecha_cambio DESC
      `;
      
      const [rows] = await pool.execute(query, [tabla, fecha]);
      return rows;
    } catch (error) {
      console.error('Error al obtener auditoría por tabla:', error);
      throw error;
    }
  }

  /**
   * Verificar si hubo cambios en las tablas de caja en una fecha específica
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @returns {boolean} True si hubo cambios
   */
  static async huboCambiosEnFecha(fecha) {
    try {
      const query = `
        SELECT COUNT(*) as total FROM auditoria_caja 
        WHERE DATE(fecha_cambio) = ?
      `;
      
      const [rows] = await pool.execute(query, [fecha]);
      return rows[0].total > 0;
    } catch (error) {
      console.error('Error al verificar cambios:', error);
      return false;
    }
  }

  /**
   * Obtener resumen de cambios por usuario en una fecha
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @returns {Array} Resumen de cambios por usuario
   */
  static async obtenerResumenCambiosPorUsuario(fecha) {
    try {
      const query = `
        SELECT 
          usuario_nombre,
          usuario_email,
          COUNT(*) as total_cambios,
          GROUP_CONCAT(DISTINCT tabla) as tablas_modificadas,
          GROUP_CONCAT(DISTINCT accion) as acciones_realizadas
        FROM auditoria_caja 
        WHERE DATE(fecha_cambio) = ?
        GROUP BY usuario_nombre, usuario_email
        ORDER BY total_cambios DESC
      `;
      
      const [rows] = await pool.execute(query, [fecha]);
      return rows;
    } catch (error) {
      console.error('Error al obtener resumen de cambios:', error);
      throw error;
    }
  }
}

module.exports = AuditoriaService; 