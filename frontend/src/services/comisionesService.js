const API_BASE_URL = '/api';

export const comisionesService = {
  // Obtener todas las comisiones
  async getComisiones() {
    try {
      const response = await fetch(`${API_BASE_URL}/comisiones`);
      if (!response.ok) {
        throw new Error('Error al obtener las comisiones');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getComisiones:', error);
      throw error;
    }
  },

  // Obtener una comisión por ID
  async getComisionById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/comisiones/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener la comisión');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getComisionById:', error);
      throw error;
    }
  },

  // Obtener comisiones por fecha
  async getComisionesByFecha(fecha) {
    try {
      const response = await fetch(`${API_BASE_URL}/comisiones/fecha/${fecha}`);
      if (!response.ok) {
        throw new Error('Error al obtener las comisiones por fecha');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getComisionesByFecha:', error);
      throw error;
    }
  },

  // Crear nueva comisión
  async createComision(comisionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/comisiones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comisionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la comisión');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en createComision:', error);
      throw error;
    }
  },

  // Actualizar comisión
  async updateComision(id, comisionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/comisiones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comisionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la comisión');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en updateComision:', error);
      throw error;
    }
  },

  // Eliminar comisión
  async deleteComision(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/comisiones/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la comisión');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en deleteComision:', error);
      throw error;
    }
  }
}; 