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
  name: 'Serum Libra Colágeno',
  category: 'Facial',
  brand: 'Libra',
  image: '/productos/serum-libra.png',
  subtitle: "Refuerza tu piel desde adentro con colágeno activo",
  description: `
**Reafirmá, nutrí y protegé tu piel** con nuestro *Serum Libra con Colágeno*.

Este tratamiento intensivo está formulado para:

- Mejorar la elasticidad y firmeza del rostro  
- Suavizar líneas de expresión y prevenir arrugas  
- Hidratar profundamente sin dejar sensación grasa  
- Promover la regeneración celular y el aspecto saludable  

🌿 Ideal para pieles maduras o con primeros signos de envejecimiento.  
💧 Se absorbe rápidamente, dejando una textura sedosa y luminosa.
  `,
  price: 19.5,
  isNatural: true,
  isVegan: false,
  link: "/productos/Serum%20Libra%20Colageno",
  benefits: genericBenefits
},
{
  id: 3,
  name: 'Radiant C Lightening Face Cream',
  category: 'Facial',
  brand: 'Lidherma',
  image: '/productos/crema-lidherma.png',
  subtitle: "Luminosidad, nutrición y acción despigmentante en una sola crema",
  description: `
**Crema facial multifuncional** con textura cremosa y activos inteligentes que se adaptan a diferentes necesidades de la piel.

Indicada para:

- Tratamientos antiage y antioxidantes  
- Protocolos despigmentantes y post-solares  
- Pieles opacas, con manchas o signos de estrés  

💡 Su fórmula rica y versátil permite integrarla en múltiples rutinas profesionales o de uso diario.
  `,
  price: 18.0,
  isNatural: true,
  isVegan: true,
  link: "/productos/crema-lidherma.png",
  benefits: solarBenefits
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
