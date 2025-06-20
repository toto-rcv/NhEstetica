# Componente TreatmentService

Un componente reutilizable y dinámico para mostrar servicios de manera consistente en toda la aplicación.

## Características

- ✅ **Fully Responsive**: Se adapta perfectamente a móviles y tablets
- ✅ **Flexible Layout**: Imagen a la izquierda o derecha
- ✅ **Customizable**: Múltiples opciones de personalización
- ✅ **Interactive**: Efectos hover y animaciones suaves
- ✅ **Accessible**: Navegación por teclado y screen readers

## Uso Básico

```jsx
import TreatmentService from './components/servicios/treatmentservice';

// Uso básico
<TreatmentService
    image="/ruta/a/la/imagen.jpg"
    title="Nombre del Servicio"
    description="Descripción detallada del servicio..."
    price="$15.000"
    link="nombre-del-servicio"
/>
```

## Propiedades Disponibles

### Propiedades Básicas (Obligatorias)
- `image` (string): Ruta de la imagen del servicio
- `title` (string): Título del servicio
- `description` (string): Descripción del servicio

### Propiedades Opcionales
- `price` (string): Precio del servicio (ej: "$15.000")
- `link` (string): Enlace interno del servicio (ej: "tratamientos-faciales")

### Configuración de Layout
- `imagePosition` (string): Posición de la imagen - "left" (default) o "right"

### Enlaces y Botones
- `promoLink` (string): Enlace a promociones (ej: "https://wa.me/1234567890")
- `customButtonText` (string): Texto personalizado del botón (default: "Ver más")
- `customButtonLink` (string): Enlace personalizado del botón (puede ser externo)

### Estilos Opcionales
- `showLine` (boolean): Mostrar línea decorativa bajo el título (default: false)
- `showPrice` (boolean): Mostrar sección de precio (default: true)
- `showPromo` (boolean): Mostrar enlace de promociones (default: true)
- `className` (string): Clase CSS personalizada

### Callbacks
- `onImageClick` (function): Función personalizada al hacer click en la imagen
- `onButtonClick` (function): Función personalizada al hacer click en el botón

## Ejemplos de Uso

### 1. Servicio Básico con Imagen a la Izquierda
```jsx
<TreatmentService
    image="/servicios/Tratamiento_Facial/hydrafacial.jpg"
    title="Hydrafacial"
    description="Tratamiento facial revolucionario que combina limpieza profunda..."
    price="$15.000"
    link="tratamientos-faciales"
    imagePosition="left"
/>
```

### 2. Servicio con Imagen a la Derecha y Línea Decorativa
```jsx
<TreatmentService
    image="/servicios/Masajes/MasajeComun.jpg"
    title="Masaje Relajante"
    description="Masaje terapéutico diseñado para aliviar el estrés..."
    price="$12.000"
    link="masajes"
    imagePosition="right"
    showLine={true}
/>
```

### 3. Servicio con Enlace Externo y Botón Personalizado
```jsx
<TreatmentService
    image="/servicios/Tratamientos_Corporales/Mesoterapia.jpg"
    title="Mesoterapia Corporal"
    description="Tratamiento no quirúrgico que combina microinyecciones..."
    price="$18.000"
    imagePosition="right"
    customButtonText="Reservar Turno"
    customButtonLink="https://wa.me/1234567890"
    promoLink="https://wa.me/1234567890"
/>
```

### 4. Servicio sin Precio ni Promociones
```jsx
<TreatmentService
    image="/servicios/Depilacion_laser/Depilacion_Laser_Piernas.jpg"
    title="Depilación Láser"
    description="Tratamiento definitivo para eliminar el vello no deseado..."
    link="depilacion-laser"
    showPrice={false}
    showPromo={false}
/>
```

### 5. Servicio con Callbacks Personalizados
```jsx
<TreatmentService
    image="/servicios/Tratamiento_Facial/dermapen.jpg"
    title="Dermapen"
    description="Tratamiento de microagujas para rejuvenecimiento..."
    price="$20.000"
    onImageClick={() => console.log('Imagen clickeada')}
    onButtonClick={() => console.log('Botón clickeado')}
/>
```

## Uso con Datos Dinámicos

```jsx
const servicesData = [
    {
        id: 1,
        image: "/servicios/Tratamiento_Facial/hydrafacial.jpg",
        title: "Hydrafacial",
        description: "Tratamiento facial revolucionario...",
        price: "$15.000",
        link: "tratamientos-faciales",
        imagePosition: "left",
        showLine: true
    },
    // ... más servicios
];

// Renderizar múltiples servicios
{servicesData.map((service) => (
    <TreatmentService
        key={service.id}
        {...service}
    />
))}
```

## Estilos CSS Variables Utilizadas

El componente utiliza las siguientes variables CSS que deben estar definidas en tu archivo de estilos:

```css
:root {
    --primary-color: #tu-color-primario;
    --secondary-color: #tu-color-secundario;
    --terciary-color: #tu-color-terciario;
    --text-color: #tu-color-de-texto;
    --background-dark: #tu-color-de-fondo;
}
```

## Responsive Design

- **Desktop**: Layout horizontal con imagen y texto lado a lado
- **Tablet**: Layout adaptativo con espaciado optimizado
- **Mobile**: Layout vertical con imagen arriba y texto abajo

## Accesibilidad

- Navegación por teclado
- Textos alternativos en imágenes
- Contraste adecuado
- Enlaces semánticos
- Screen reader friendly

## Notas Importantes

1. **Imágenes**: Asegúrate de que las imágenes tengan una relación de aspecto similar para mejor consistencia visual
2. **Enlaces**: Los enlaces internos usan React Router, los externos se abren en nueva pestaña
3. **Precios**: Se muestran solo en desktop, en mobile se ocultan para ahorrar espacio
4. **Promociones**: El enlace de promociones es opcional y se puede ocultar
5. **Callbacks**: Las funciones personalizadas se ejecutan antes de la navegación por defecto 