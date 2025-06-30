const API_BASE_URL = '/api';

export const personalService = {
  // Obtener todo el personal
  async getPersonal() {
    try {
      const response = await fetch(`${API_BASE_URL}/personal`);
      if (!response.ok) {
        throw new Error('Error al obtener el personal');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getPersonal:', error);
      throw error;
    }
  },

  // Obtener un empleado por ID
  async getPersonalById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/personal/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el empleado');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getPersonalById:', error);
      throw error;
    }
  },

  // Crear nuevo empleado
  async createPersonal(empleadoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/personal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empleadoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Si hay errores de validación específicos, mostrarlos
        if (errorData.errors && Array.isArray(errorData.errors)) {
          throw new Error(`Errores de validación:\n${errorData.errors.join('\n')}`);
        }
        throw new Error(errorData.message || 'Error al crear el empleado');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en createPersonal:', error);
      throw error;
    }
  },

  // Actualizar empleado
  async updatePersonal(id, empleadoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/personal/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empleadoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el empleado');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en updatePersonal:', error);
      throw error;
    }
  },

  // Eliminar empleado
  async deletePersonal(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/personal/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el empleado');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en deletePersonal:', error);
      throw error;
    }
  },

  // Buscar personal
  async searchPersonal(termino) {
    try {
      const response = await fetch(`${API_BASE_URL}/personal/search?termino=${encodeURIComponent(termino)}`);
      if (!response.ok) {
        throw new Error('Error al buscar el personal');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en searchPersonal:', error);
      throw error;
    }
  }
}; 