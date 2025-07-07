const API_BASE_URL = '/api';
const PUBLIC_API_URL = '/api/clientes/public';

export const clientesService = {
  // Obtener token de autorización
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
  },

  // Obtener todos los clientes
  async getClientes() {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener clientes');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getClientes:', error);
      throw error;
    }
  },

  // Buscar clientes
  async searchClientes(termino) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/search?term=${encodeURIComponent(termino)}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Error al buscar clientes');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en searchClientes:', error);
      throw error;
    }
  },

  // Crear nuevo cliente
  async createCliente(clienteData) {
    try {
      const formData = new FormData();
      formData.append('nombre', clienteData.nombre);
      formData.append('apellido', clienteData.apellido);
      formData.append('direccion', clienteData.direccion);
      formData.append('email', clienteData.email);
      formData.append('telefono', clienteData.telefono);
      formData.append('antiguedad', clienteData.antiguedad || '');
      formData.append('nacionalidad', clienteData.nacionalidad || '');

      if (clienteData.imagen) {
        formData.append('imagen', clienteData.imagen);
      }

      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear cliente');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en createCliente:', error);
      throw error;
    }
  },

  // Actualizar cliente
  async updateCliente(id, clienteData) {
    try {
      let body;
      let headers = this.getAuthHeaders();
      
      // Verificar si se está enviando una imagen
      const isFormData = clienteData.imagen instanceof File;
      
      if (isFormData) {
        // Si hay imagen, usar FormData
        const formData = new FormData();
        formData.append('nombre', clienteData.nombre || '');
        formData.append('apellido', clienteData.apellido || '');
        formData.append('direccion', clienteData.direccion || '');
        formData.append('email', clienteData.email || '');
        formData.append('telefono', clienteData.telefono || '');
        formData.append('antiguedad', clienteData.antiguedad || '');
        formData.append('nacionalidad', clienteData.nacionalidad || '');
        formData.append('imagen', clienteData.imagen);
        body = formData;
      } else {
        // Si no hay imagen, usar JSON
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({
          nombre: clienteData.nombre || '',
          apellido: clienteData.apellido || '',
          direccion: clienteData.direccion || '',
          email: clienteData.email || '',
          telefono: clienteData.telefono || '',
          antiguedad: clienteData.antiguedad || '',
          nacionalidad: clienteData.nacionalidad || ''
        });
      }

      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'PUT',
        headers,
        body,
      });

      if (!response.ok) {
        let errorMessage = 'Error al actualizar cliente';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Si no puede parsear JSON, usar mensaje genérico
          errorMessage = `Error del servidor: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      // Retornar el cliente actualizado o los datos del resultado
      return result.cliente || result;
    } catch (error) {
      console.error('Error en updateCliente:', error);
      throw error;
    }
  },

  // Eliminar cliente
  async deleteCliente(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar cliente');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en deleteCliente:', error);
      throw error;
    }
  },

  // Obtener cliente por ID
  async getClienteById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener cliente');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getClienteById:', error);
      throw error;
    }
  },

  // Obtener cliente por email (público)
  async getClienteByEmail(email) {
    try {
      const response = await fetch(`${PUBLIC_API_URL}/by-email/${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener cliente por email');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getClienteByEmail:', error);
      throw error;
    }
  }
}; 