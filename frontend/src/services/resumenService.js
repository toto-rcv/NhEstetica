const API_URL = '/api/resumen';

export const resumenService = {
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
  },

  getResumenCompleto: async () => {
    try {
      const response = await fetch(`${API_URL}/ganancias-mensuales`, {
        headers: {
          'Content-Type': 'application/json',
          ...resumenService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener el resumen completo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en resumenService.getResumenCompleto:', error);
      throw error;
    }
  },

  // Nuevo método: obtener gastos fijos para un mes (formato YYYY-MM)
  getGastosFijosPorMes: async (mes) => {
    try {
      const response = await fetch(`/api/gastos-fijos/${mes}`, {
        headers: {
          'Content-Type': 'application/json',
          ...resumenService.getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener gastos fijos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en resumenService.getGastosFijosPorMes:', error);
      throw error;
    }
  },

  // Nuevo método: crear o actualizar gastos fijos
  upsertGastosFijos: async ({ mes, alquiler, expensas }) => {
    try {
      const response = await fetch(`/api/gastos-fijos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...resumenService.getAuthHeaders(),
        },
        body: JSON.stringify({ mes, alquiler, expensas }),
      });
      if (!response.ok) {
        throw new Error('Error al guardar gastos fijos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en resumenService.upsertGastosFijos:', error);
      throw error;
    }
  },
};
