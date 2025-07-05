const API_URL = 'http://localhost:5000/api/inicio';

export const inicioService = {
  // Obtener ranking de clientes
  getRankingClientes: async () => {
    try {
      const response = await fetch(`${API_URL}/ranking-clientes`);
      if (!response.ok) {
        throw new Error('Error al obtener ranking de clientes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener ranking de clientes:', error);
      throw error;
    }
  },

  // Obtener estadísticas generales
  getEstadisticasGenerales: async () => {
    try {
      const response = await fetch(`${API_URL}/estadisticas`);
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas generales');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener estadísticas generales:', error);
      throw error;
    }
  },

  // Obtener tratamientos que vencen este mes
  getTratamientosVencimientoMes: async () => {
    try {
      const response = await fetch(`${API_URL}/tratamientos-vencimiento-mes`);
      if (!response.ok) {
        throw new Error('Error al obtener tratamientos por vencer');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener tratamientos por vencer:', error);
      throw error;
    }
  }
}; 