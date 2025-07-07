const API_URL = '/api/ventas/tratamientos';

export const ventasTratamientosService = {
  // Obtener token de autorización
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
  },

  // Obtener todas las ventas de tratamientos
  async getVentasTratamientos() {
    try {
      const response = await fetch(API_URL, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al obtener ventas de tratamientos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getVentasTratamientos:', error);
      throw error;
    }
  },

  // Obtener venta de tratamiento por ID
  async getVentaTratamientoById(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al obtener venta de tratamiento');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getVentaTratamientoById:', error);
      throw error;
    }
  },

  // Crear nueva venta de tratamiento
  async createVentaTratamiento(ventaData) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(ventaData),
      });
      if (!response.ok) {
        throw new Error('Error al crear venta de tratamiento');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en createVentaTratamiento:', error);
      throw error;
    }
  },

  // Actualizar venta de tratamiento
  async updateVentaTratamiento(id, ventaData) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      };

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(ventaData),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar venta de tratamiento');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en updateVentaTratamiento:', error);
      throw error;
    }
  },

  // Eliminar venta de tratamiento
  async deleteVentaTratamiento(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al eliminar venta de tratamiento');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en deleteVentaTratamiento:', error);
      throw error;
    }
  },

  // Buscar ventas de tratamientos
  async searchVentasTratamientos(searchTerm) {
    try {
      const response = await fetch(`${API_URL}/search?term=${encodeURIComponent(searchTerm)}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al buscar ventas de tratamientos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en searchVentasTratamientos:', error);
      throw error;
    }
  }
}; 