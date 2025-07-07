const API_URL = '/api/egresos';

export const egresosService = {
  // Obtener token de autorización
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
  },

  // Obtener todos los egresos
  async getEgresos() {
    try {
      const response = await fetch(API_URL, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al obtener egresos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getEgresos:', error);
      throw error;
    }
  },

  // Obtener egresos por fecha
  async getEgresosByFecha(fecha) {
    try {
      const response = await fetch(`${API_URL}/fecha/${fecha}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al obtener egresos por fecha');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getEgresosByFecha:', error);
      throw error;
    }
  },

  // Obtener egreso por ID
  async getEgresoById(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al obtener egreso');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getEgresoById:', error);
      throw error;
    }
  },

  // Crear nuevo egreso
  async createEgreso(egresoData) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(egresoData),
      });
      if (!response.ok) {
        throw new Error('Error al crear egreso');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en createEgreso:', error);
      throw error;
    }
  },

  // Actualizar egreso
  async updateEgreso(id, egresoData) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      };

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(egresoData),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar egreso');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en updateEgreso:', error);
      throw error;
    }
  },

  // Eliminar egreso
  async deleteEgreso(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al eliminar egreso');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en deleteEgreso:', error);
      throw error;
    }
  }
}; 