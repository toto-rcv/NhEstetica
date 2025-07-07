const API_URL = '/api/caja/apertura';

export const cajaService = {
  // Obtener token de autorización
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
  },

  // Obtener caja por fecha
  async getCajaByFecha(fecha) {
    try {
      const response = await fetch(`${API_URL}/fecha/${fecha}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No hay caja para esa fecha
        }
        throw new Error('Error al obtener caja por fecha');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getCajaByFecha:', error);
      throw error;
    }
  },

  // Crear apertura de caja
  async createAperturaCaja(cajaData) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(cajaData),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear apertura de caja');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en createAperturaCaja:', error);
      throw error;
    }
  },

  // Cerrar caja
  async cerrarCaja(fecha, montoCierre) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      };

      const response = await fetch(`${API_URL}/cerrar/${fecha}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          monto_cierre: montoCierre
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al cerrar caja');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en cerrarCaja:', error);
      throw error;
    }
  },

  // Obtener todas las aperturas de caja
  async getAllAperturas() {
    try {
      const response = await fetch(API_URL, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al obtener aperturas de caja');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getAllAperturas:', error);
      throw error;
    }
  },

  // Obtener apertura de caja por ID
  async getAperturaById(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al obtener apertura de caja');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getAperturaById:', error);
      throw error;
    }
  },

  // Actualizar apertura de caja
  async updateApertura(id, cajaData) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      };

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(cajaData),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar apertura de caja');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en updateApertura:', error);
      throw error;
    }
  },

  // Eliminar apertura de caja
  async deleteApertura(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al eliminar apertura de caja');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en deleteApertura:', error);
      throw error;
    }
  }
}; 