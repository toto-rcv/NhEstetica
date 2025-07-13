const API_URL = '/api/resumen';

export const resumenService = {
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
  },

  // 1. GANANCIAS MENSUALES
  getResumenCompleto: async () => {
    try {
      const response = await fetch(`${API_URL}/ganancias-mensuales`, {
        headers: {
          'Content-Type': 'application/json',
          ...resumenService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener el resumen completo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en resumenService.getResumenCompleto:', error);
      throw error;
    }
  },

  // 2. GASTOS FIJOS MENSUALES
  getGastosFijosPorMes: async (mes) => {
    try {
      const response = await fetch(`/api/gastos-fijos/${mes}`, {
        headers: {
          'Content-Type': 'application/json',
          ...resumenService.getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener gastos fijos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en resumenService.getGastosFijosPorMes:', error);
      throw error;
    }
  },

  upsertGastosFijos: async ({ mes, alquiler, expensas }) => {
    try {
      const response = await fetch(`/api/gastos-fijos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...resumenService.getAuthHeaders(),
        },
        body: JSON.stringify({ mes, alquiler, expensas }),
      });
      if (!response.ok) {
        throw new Error('Error al guardar gastos fijos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en resumenService.upsertGastosFijos:', error);
      throw error;
    }
  },

  // 3. VENTAS MENSUALES AGRUPADAS POR CLIENTE Y NOMBRE
 // 3. VENTAS MENSUALES AGRUPADAS POR CLIENTE Y NOMBRE
getVentasMensualesPorTipo: async (mesActual) => {
  try {
    const headers = resumenService.getAuthHeaders();

    const [tratamientosRes, productosRes] = await Promise.all([
      fetch('/api/ventas/tratamientos', { headers }),
      fetch('/api/ventas/productos', { headers }),
    ]);

    if (!tratamientosRes.ok || !productosRes.ok) {
      throw new Error('Error al obtener ventas');
    }

    const tratamientos = await tratamientosRes.json();
    const productos = await productosRes.json();

    console.log('Tratamientos:', tratamientos);
    console.log('Productos:', productos);

    const filtrarPorMes = (items) =>
      items.filter(item => item.fecha?.slice(0, 7) === mesActual);

    const tratamientosLimpios = filtrarPorMes(tratamientos).map((t) => ({
      cliente: `${t.cliente_nombre} ${t.cliente_apellido}`,
      nombre: t.tratamiento_nombre || 'Sin nombre',
      total: parseFloat(t.precio || 0) * parseFloat(t.sesiones || 1),
      fecha: t.fecha, // <--- Asegurate que el backend te mande esta propiedad
    }));

    const productosLimpios = filtrarPorMes(productos).map((p) => ({
      cliente: `${p.cliente_nombre} ${p.cliente_apellido}`,
      nombre: p.nombre_producto || p.nombre || 'Sin nombre',
      total: parseFloat(p.precio || 0) * (parseInt(p.cantidad) || 1),
      fecha: p.fecha, // <--- Igual acá
    }));


    return {
      tratamientos: tratamientosLimpios,
      productos: productosLimpios,
    };
  } catch (err) {
    console.error('Error en resumenService.getVentasMensualesPorTipo:', err);
    throw err;
  }
}
};
