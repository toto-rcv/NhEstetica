# Sistema de Tablas - NH Estética

## Descripción

Este sistema de tablas proporciona una interfaz protegida para gestionar diferentes aspectos del negocio de estética. Solo los usuarios autenticados pueden acceder a estas funcionalidades.

## Características

- **Autenticación Protegida**: Todas las páginas requieren login previo
- **Navegación Interna**: Menú de navegación persistente entre páginas
- **Tablas Editables**: Edición in-line de datos
- **Gestión de Datos**: Agregar y eliminar filas
- **Ordenamiento**: Ordenar por columnas
- **Diseño Responsivo**: Interfaz moderna y fácil de usar

## Páginas Disponibles

### 1. Inicio (`/tablas/inicio`)
- Panel de métricas del sistema
- Información general del negocio
- Estadísticas clave

### 2. Caja (`/tablas/caja`)
- Gestión de transacciones financieras
- Control de ingresos y egresos
- Métodos de pago
- Estados de transacciones

### 3. Clientes (`/tablas/clientes`)
- Base de datos de clientes
- Información personal y de contacto
- Historial de registros
- Estados de clientes

### 4. Ventas (`/tablas/ventas`)
- Registro de ventas y servicios
- Información de clientes y vendedores
- Precios y descuentos
- Estados de ventas

### 5. Personal (`/tablas/personal`)
- Gestión del personal
- Información de empleados
- Cargos y especialidades
- Salarios y estados

## Cómo Usar

### Acceso
1. Navegar a `/login`
2. Ingresar credenciales válidas
3. Ser redirigido automáticamente a `/tablas/inicio`

### Edición de Datos
1. **Editar Celda**: Hacer clic en cualquier celda para editarla
2. **Guardar Cambios**: Presionar Enter o hacer clic fuera de la celda
3. **Agregar Fila**: Usar el botón "Agregar Fila" en la parte superior
4. **Eliminar Fila**: Usar el botón "Eliminar" en la columna de acciones

### Navegación
- Usar el menú superior para navegar entre páginas
- El botón "Cerrar Sesión" está disponible en todas las páginas
- La navegación es interna, manteniendo el estado de autenticación

## Tecnologías Utilizadas

- **React**: Framework principal
- **React Router**: Navegación
- **@tanstack/react-table**: Tablas interactivas
- **Styled Components**: Estilos
- **JWT**: Autenticación

## Estructura de Archivos

```
src/
├── components/
│   ├── ProtectedRoute.js          # Protección de rutas
│   └── tablas/
│       ├── TablasNavBar.js        # Navegación interna
│       ├── TablasLayout.js        # Layout reutilizable
│       ├── EditableTable.js       # Tabla editable
│       └── TablasRedirect.js      # Redirección
└── pages/
    └── tablas/
        ├── inicio.js              # Panel de inicio
        ├── caja.js                # Gestión de caja
        ├── clientes.js            # Gestión de clientes
        ├── ventas.js              # Gestión de ventas
        └── personal.js            # Gestión de personal
```

## Notas Importantes

- Los datos se almacenan temporalmente en el estado de React
- Para persistencia de datos, se requiere integración con backend
- La autenticación se basa en JWT almacenado en localStorage
- Todas las rutas están protegidas automáticamente 