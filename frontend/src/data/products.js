export const categories = ['Todo', 'Facial', 'Corporal', 'Cabello', 'Natural', 'Vegano'];

export const brands = ['Libra', 'Royal Bronze', 'Idraet', 'Skin Food'];

const genericBenefits = [
  "Hidrata profundamente la piel",
  "Mejora la textura y el brillo natural",
  "Apto para todo tipo de piel",
  "Fórmula liviana y de rápida absorción",
  "No testeado en animales 🐰"
];

const solarBenefits = [
  "Protección de amplio espectro UVA y UVB ☀️",
  "Vehículo de toque seco, no deja sensación grasa",
  "Efecto matificante para controlar el brillo",
  "Textura ligera y de rápida absorción",
  "Fácil de aplicar en rostro y cuerpo",
  "Resistente al agua 💧",
  "Enriquecido con antioxidantes que protegen la piel"
];



// Exporta una función asíncrona para obtener los productos desde la API
export async function rawProducts() {
  try {
    const response = await fetch('/api/productos');
    if (!response.ok) throw new Error('Error al obtener productos');
    const data = await response.json();
    
    return data.map((p, index) => {
      // Asegurar que siempre haya un ID válido
      const productId = p.id || `product-${index + 1}`;
      
      return {
        id: productId,
        name: p.nombre,
        category: p.categoria || '',
        brand: p.marca || '',
        image: p.imagen || '',
        subtitle: p.subtitle || '',
        description: p.descripcion || '',
        price: p.precio,
        isNatural: p.isNatural ?? false,
        isVegan: p.isVegan ?? false,
        benefits: p.benefits || [],
        link: `/productos/${productId}`,
      };
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    // Retornar array vacío en caso de error
    return [];
  }
}
