export const categories = ['Todo', 'Facial', 'Corporal', 'Cabello', 'Natural', 'Vegano'];

export const brands = ['Libra', 'Royal Bronze', 'Idraet', 'Skin Food'];

const genericBenefits = [
  "Hidrata profundamente la piel",
  "Mejora la textura y el brillo natural",
  "Apto para todo tipo de piel",
  "Fórmula liviana y de rápida absorción",
  "No testeado en animales 🐰"
];

export const rawProducts = [
  {
    id: 1,
    name: 'Gel de Limpieza Facial',
    category: 'Facial',
    brand: 'Libra',
    image: '/productos/Gel-limpieza-facial.png',
    subtitle: "Limpieza profunda y frescura diaria para tu piel",
    description: `
**Descubrí una piel más limpia, suave y equilibrada** con nuestro *Gel de Limpieza Facial Libra*.

Este producto está especialmente formulado para:

- Eliminar impurezas, exceso de grasa y restos de maquillaje  
- Limpiar sin resecar ni irritar  
- Dejar una sensación de frescura desde la primera aplicación  
- Ayudar a mantener los poros limpios y la piel libre de imperfecciones  

✅ *Recomendado para todo tipo de piel, incluso las más sensibles.*
    `,
    price: 25.99,
    isNatural: true,
    isVegan: false,
    link: "/productos/Crema%20Hidratante%20Facial",
    benefits: genericBenefits
  },
  {
    id: 2,
    name: 'Aceite Corporal de Almendras',
    category: 'Corporal',
    brand: 'Idraet',
    image: '/productos/avocado.jpg',
    subtitle: "Satisfacción absoluta con nuestro producto insignia",
    description: 'Aceite suave para nutrir la piel seca.',
    price: 19.5,
    isNatural: true,
    isVegan: false,
    benefits: genericBenefits
  },
  {
    id: 3,
    name: 'Shampoo Fortalecedor',
    category: 'Cabello',
    brand: 'Skin Food',
    image: '/productos/zine.jpg',
    subtitle: "Satisfacción absoluta con nuestro producto insignia",
    description: 'Shampoo natural para fortalecer el cabello.',
    price: 18.0,
    isNatural: true,
    isVegan: true,
    benefits: genericBenefits
  },
  {
    id: 4,
    name: 'Mascarilla Facial Detox',
    category: 'Facial',
    brand: 'Idraet',
    image: '/productos/enzymatic.jpg',
    subtitle: "Satisfacción absoluta con nuestro producto insignia",
    description: 'Mascarilla de arcilla para limpieza profunda.',
    price: 21.0,
    isNatural: false,
    isVegan: true,
    benefits: genericBenefits
  },
  {
    id: 5,
    name: 'Loción Corporal Hidratante',
    category: 'Corporal',
    brand: 'Royal Bronze',
    image: '/productos/idraet.jpg',
    subtitle: "Satisfacción absoluta con nuestro producto insignia",
    description: 'Loción corporal de rápida absorción con vitamina E.',
    price: 22.75,
    isNatural: false,
    isVegan: false,
    benefits: genericBenefits
  },
  {
    id: 6,
    name: 'Acondicionador de Coco',
    category: 'Cabello',
    brand: 'Skin Food',
    image: '/productos/libra.jpg',
    subtitle: "Satisfacción absoluta con nuestro producto insignia",
    description: 'Acondicionador sin sulfatos, con extracto de coco.',
    price: 17.2,
    isNatural: true,
    isVegan: true,
    benefits: genericBenefits
  },
  {
    id: 7,
    name: 'Gel de Limpieza Facial',
    category: 'Facial',
    brand: 'Royal Bronze',
    image: '/productos/algae.jpg',
    subtitle: "Satisfacción absoluta con nuestro producto insignia",
    description: 'Limpia profundamente sin resecar la piel.',
    price: 16.9,
    isNatural: false,
    isVegan: true,
    benefits: genericBenefits
  },
  {
    id: 8,
    name: 'Crema Corporal Vegana',
    category: 'Vegano',
    brand: 'Skin Food',
    image: '/productos/vitaminec.jpg',
    subtitle: "Satisfacción absoluta con nuestro producto insignia",
    description: 'Textura ligera, 100% vegana y cruelty free.',
    price: 24.5,
    isNatural: true,
    isVegan: true,
    benefits: genericBenefits
  },
  {
    id: 9,
    name: 'Exfoliante',
    category: 'Facial',
    brand: 'Skin Food',
    image: '/productos/exfoliante.jpg',
    subtitle: "Satisfacción absoluta con nuestro producto insignia",
    description: 'Exfoliante para tu piel.',
    price: 24.5,
    isNatural: true,
    isVegan: true,
    benefits: genericBenefits
  },
];

export const products = rawProducts.map(product => ({
  ...product,
  link: `/productos/${encodeURIComponent(product.name)}`
}));
