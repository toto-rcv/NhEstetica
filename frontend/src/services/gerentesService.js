const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

class GerentesService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/gerentes`;
  }

  // Obtener todos los gerentes
  async getGerentes() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(this.baseURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching gerentes:', error);
      throw error;
    }
  }

  // Crear un nuevo gerente
  async createGerente(gerenteData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gerenteData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear gerente');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating gerente:', error);
      throw error;
    }
  }

  // Actualizar un gerente
  async updateGerente(id, gerenteData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gerenteData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar gerente');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating gerente:', error);
      throw error;
    }
  }

  // Eliminar un gerente
  async deleteGerente(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar gerente');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting gerente:', error);
      throw error;
    }
  }
}

export const gerentesService = new GerentesService(); 