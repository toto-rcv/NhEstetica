const API_URL = '/api/tratamientos';

export const tratamientosService = {
  getTratamientos: async () => {
    try {
      const response = await fetch(API_URL);
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
      const response = await fetch(`${API_URL}/${id}`);
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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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