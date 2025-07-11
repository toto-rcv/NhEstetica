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

      const query = `
        INSERT INTO auditoria_caja (
          tabla, accion, registro_id, datos_anteriores, datos_nuevos,
          usuario_id, usuario_nombre, ip_address, user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        tabla,
        accion,
        registro_id,
        datos_anteriores ? JSON.stringify(datos_anteriores) : null,
        datos_nuevos ? JSON.stringify(datos_nuevos) : null,
        usuario?.id || null,
        usuario?.nombre || null,
        ip_address || null,
        user_agent || null
      ];

      await pool.execute(query, values);
    } catch (error) {
      console.error('Error al registrar auditoría:', error);
      // No lanzar error para no interrumpir el flujo principal
    }
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
          COUNT(*) as total_cambios,
          GROUP_CONCAT(DISTINCT tabla) as tablas_modificadas,
          GROUP_CONCAT(DISTINCT accion) as acciones_realizadas
        FROM auditoria_caja 
        WHERE DATE(fecha_cambio) = ?
        GROUP BY usuario_nombre
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