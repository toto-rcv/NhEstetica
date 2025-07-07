const API_URL = '/api/ingresos';

export const ingresosService = {
  // Obtener token de autorización
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
  },

  // Obtener todos los ingresos
  async getIngresos() {
    try {
      const response = await fetch(API_URL, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al obtener ingresos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getIngresos:', error);
      throw error;
    }
  },

  // Obtener ingresos por fecha
  async getIngresosByFecha(fecha) {
    try {
      const response = await fetch(`${API_URL}/fecha/${fecha}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al obtener ingresos por fecha');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getIngresosByFecha:', error);
      throw error;
    }
  },

  // Obtener ingreso por ID
  async getIngresoById(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al obtener ingreso');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getIngresoById:', error);
      throw error;
    }
  },

  // Crear nuevo ingreso
  async createIngreso(ingresoData) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(ingresoData),
      });
      if (!response.ok) {
        throw new Error('Error al crear ingreso');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en createIngreso:', error);
      throw error;
    }
  },

  // Actualizar ingreso
  async updateIngreso(id, ingresoData) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      };

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(ingresoData),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar ingreso');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en updateIngreso:', error);
      throw error;
    }
  },

  // Eliminar ingreso
  async deleteIngreso(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al eliminar ingreso');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en deleteIngreso:', error);
      throw error;
    }
  }
}; 