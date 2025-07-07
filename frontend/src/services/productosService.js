const API_BASE_URL = '/api';

export const productosService = {
  // Obtener token de autorización
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
  },

  // Obtener todos los productos (con búsqueda opcional y paginación)
  async getProductos(searchTerm = '', page = 1, limit = 10) {
    const params = new URLSearchParams();
    if (searchTerm) params.append('query', searchTerm);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const url = `${API_BASE_URL}/productos?${params.toString()}`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener productos');
    return await response.json();
  },

  // Obtener producto por ID
  async getProductoById(id) {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener producto');
    return await response.json();
  },

  // Buscar producto por nombre exacto
  async getProductoByNombre(nombre) {
    const response = await fetch(`${API_BASE_URL}/productos/nombre/${encodeURIComponent(nombre)}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Error al buscar producto');
    }
    return await response.json();
  },

  // Crear producto
  async createProducto(productoData) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
    };

    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: 'POST',
      headers,
      body: JSON.stringify(productoData),
    });
    if (!response.ok) throw new Error('Error al crear producto');
    return await response.json();
  },

  // Actualizar producto
  async updateProducto(id, productoData) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
    };

    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(productoData),
    });
    if (!response.ok) throw new Error('Error al actualizar producto');
    return await response.json();
  },

  // Eliminar producto
  async deleteProducto(id) {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al eliminar producto');
    }
    
    return await response.json();
  },
}; 