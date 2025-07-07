const API_URL = '/api/tratamientos';
const PUBLIC_API_URL = '/api/tratamientos/public';

export const tratamientosService = {
  // Obtener token de autorización
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
  },

  getTratamientos: async (searchTerm = '') => {
    try {
      const url = searchTerm 
        ? `${PUBLIC_API_URL}?query=${encodeURIComponent(searchTerm)}`
        : PUBLIC_API_URL;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener tratamientos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getTratamientos:', error);
      throw error;
    }
  },

  getTratamiento: async (id) => {
    try {
      const response = await fetch(`${PUBLIC_API_URL}/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener tratamiento');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getTratamiento:', error);
      throw error;
    }
  },

  createTratamiento: async (tratamiento) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...tratamientosService.getAuthHeaders(),
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(tratamiento),
      });
      if (!response.ok) {
        throw new Error('Error al crear tratamiento');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en createTratamiento:', error);
      throw error;
    }
  },

  updateTratamiento: async (id, tratamiento) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...tratamientosService.getAuthHeaders(),
      };

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(tratamiento),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar tratamiento');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en updateTratamiento:', error);
      throw error;
    }
  },

  deleteTratamiento: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: tratamientosService.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Error al eliminar tratamiento');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en deleteTratamiento:', error);
      throw error;
    }
  },
}; 