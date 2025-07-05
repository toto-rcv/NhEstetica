export let categories = ['Todo'];
export let brands = [];

export async function rawProducts() {
  try {
    const response = await fetch('/api/productos?limit=1000'); // Obtener todos los productos
    if (!response.ok) throw new Error('Error al obtener productos');
    const responseData = await response.json();

    // La API devuelve un objeto con estructura de paginación: {data: productos[], pagination: {}}
    const data = responseData.data || responseData;

    // Verificar que data sea un array
    if (!Array.isArray(data)) {
      console.error('❌ API response is not an array:', data);
      return [];
    }

    const brandSet = new Set();
    const categorySet = new Set();

    const productosProcesados = data.map((p, index) => {
      const productId = p.id || `product-${index + 1}`;
      const brand = p.marca || '';
      const category = p.categoria || '';

      if (brand) brandSet.add(brand);
      if (category) categorySet.add(category);

      return {
        id: productId,
        name: p.nombre,
        category,
        brand,
        image: p.imagen || '',
        subtitle: p.subtitle || '',
        description: p.descripcion || '',
        price: p.precio,
        isNatural: Boolean(p.isNatural) && p.isNatural !== '0' && p.isNatural !== 0 && p.isNatural !== false,
        isVegan: Boolean(p.isVegan) && p.isVegan !== '0' && p.isVegan !== 0 && p.isVegan !== false,
        benefits: p.benefits || [],
        link: `/productos/${productId}`,
      };
    });

    brands = [...brandSet].sort();
    categories = ['Todo', ...[...categorySet].filter(c => c !== 'Todo').sort()];

    return productosProcesados;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
}
