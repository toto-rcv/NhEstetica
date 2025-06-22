# Backend NhEstetica

Backend para el sistema de gestión de NhEstetica.

## Configuración Inicial

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar base de datos
Antes de ejecutar el servidor, necesitas configurar la base de datos MySQL:

1. **Instalar MySQL** si no lo tienes instalado
2. **Configurar credenciales** en `setup-database.js`:
   ```javascript
   const dbConfig = {
     host: 'localhost',
     user: 'root',
     password: 'tu_contraseña_aqui', // Cambia esto
     database: 'nhestetica_db'
   };
   ```

3. **Ejecutar el script de configuración**:
   ```bash
   node setup-database.js
   ```

### 3. Iniciar el servidor
```bash
npm start
```

## Estructura de la Base de Datos

### Tabla: `users`
- `id` - ID único del usuario
- `username` - Nombre de usuario
- `password` - Contraseña hasheada
- `created_at` - Fecha de creación

### Tabla: `personal`
- `id` - ID único del empleado
- `dni` - DNI único del empleado
- `nombre` - Nombre del empleado
- `apellido` - Apellido del empleado
- `direccion` - Dirección del empleado
- `telefono` - Teléfono del empleado
- `email` - Email del empleado
- `cargo` - Cargo/Posición del empleado
- `especialidad` - Especialidad del empleado
- `fecha_contratacion` - Fecha de contratación
- `comision_venta` - Porcentaje de comisión por venta
- `comision_fija` - Comisión fija
- `sueldo_mensual` - Sueldo mensual
- `estado` - Estado del empleado (Activo/Inactivo)

### Tabla: `clientes`
- `id` - ID único del cliente
- `nombre` - Nombre del cliente
- `apellido` - Apellido del cliente
- `direccion` - Dirección del cliente
- `telefono` - Teléfono del cliente
- `email` - Email del cliente
- `antiguedad` - Antigüedad en días
- `fecha_inscripcion` - Fecha de inscripción
- `estado` - Estado del cliente (Activo/Inactivo)

### Tabla: `comisiones`
- `id` - ID único de la comisión
- `personal_id` - ID del empleado (referencia a personal)
- `fecha` - Fecha de la comisión
- `hora` - Hora de la comisión
- `servicio` - Servicio realizado
- `comision` - Monto de la comisión
- `estado` - Estado de la comisión (Completado/Pendiente/Cancelado)

## Endpoints

### Autenticación
- `POST /api/login` - Iniciar sesión
- `POST /api/logout` - Cerrar sesión

### Personal
- `GET /api/personal` - Obtener todos los empleados
- `POST /api/personal` - Crear nuevo empleado
- `PUT /api/personal/:id` - Actualizar empleado
- `DELETE /api/personal/:id` - Eliminar empleado

### Clientes
- `GET /api/clientes` - Obtener todos los clientes
- `POST /api/clientes` - Crear nuevo cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Comisiones
- `GET /api/comisiones` - Obtener todas las comisiones
- `GET /api/comisiones/personal/:id` - Obtener comisiones por empleado
- `POST /api/comisiones` - Crear nueva comisión
- `PUT /api/comisiones/:id` - Actualizar comisión
- `DELETE /api/comisiones/:id` - Eliminar comisión

## Usuario por defecto
- **Usuario**: `user`
- **Contraseña**: `123`

## Notas importantes

1. **Seguridad**: Cambia las credenciales por defecto en producción
2. **Backup**: Realiza copias de seguridad regulares de la base de datos
3. **Permisos**: Asegúrate de que el usuario de MySQL tenga permisos para crear y modificar bases de datos 