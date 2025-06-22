# NH Estética - Sistema de Login

Este proyecto incluye un sistema de login simple y **oculto** para la aplicación NH Estética.

## Características del Login

- **Completamente oculto**: No aparece en el header, footer ni navegación
- **Acceso directo**: Solo accesible escribiendo la URL `/login`
- **Interfaz simple y moderna**: Diseño limpio con styled-components
- **Validación básica**: Verifica que los campos estén completos
- **Integración con backend**: Conecta con un servidor Express.js
- **Persistencia de sesión**: Usa localStorage para mantener el estado de login
- **Redirección automática**: Si ya estás autenticado, te redirige automáticamente

## Credenciales de Prueba

El sistema incluye las siguientes credenciales de prueba:

- **Usuario**: `admin` | **Contraseña**: `123456`
- **Usuario**: `user` | **Contraseña**: `password123`
- **Usuario**: `test` | **Contraseña**: `test123`

## Instalación y Uso

### 1. Instalar dependencias

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 2. Iniciar el servidor backend

```bash
cd backend
npm start
```

El servidor se ejecutará en `http://localhost:5000`

### 3. Iniciar el frontend

```bash
cd frontend
npm start
```

La aplicación se abrirá en `http://localhost:3000`

### 4. Acceder al login

**Escribe directamente en el navegador:** `http://localhost:3000/login`

⚠️ **Importante**: El login no aparece en ningún menú de navegación. Solo es accesible escribiendo la URL.

## Estructura del Proyecto

```
NhEstetica/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Login.js          # Componente de login (oculto)
│   │   ├── components/
│   │   │   └── header.js         # Header con funcionalidad de logout
│   │   └── App.js                # Rutas de la aplicación
│   └── package.json
└── backend/
    ├── index.js                  # Servidor Express con endpoints de login
    └── package.json
```

## Endpoints del Backend

- `POST /api/login` - Autenticación de usuarios
- `GET /api/check-auth` - Verificación de autenticación (placeholder)
- `GET /api/saludo` - Endpoint de prueba

## Funcionalidades

### Login (Oculto)
- **Acceso**: Solo por URL directa `/login`
- Formulario con campos de usuario y contraseña
- Validación de campos requeridos
- Mensajes de error y éxito
- Estado de carga durante la autenticación
- Redirección automática después del login exitoso
- **Protección**: Si ya estás autenticado, te redirige automáticamente

### Header (Solo para usuarios autenticados)
- **Sin enlace de login**: El login no aparece en la navegación
- Muestra saludo personalizado y botón "Cerrar Sesión" solo cuando está autenticado
- Persistencia del estado de autenticación

### Logout
- Limpia los datos de sesión del localStorage
- Redirige al usuario a la página principal
- Actualiza el estado del header

## Seguridad y Ocultación

- ✅ **Login completamente oculto**: No aparece en menús ni navegación
- ✅ **Acceso solo por URL**: Solo quienes conocen la ruta pueden acceder
- ✅ **Redirección automática**: Usuarios autenticados no pueden acceder al login
- ✅ **Sin referencias visibles**: No hay enlaces ni botones que lleven al login

## Personalización

Para personalizar el sistema:

1. **Cambiar credenciales**: Modifica el objeto `validCredentials` en `backend/index.js`
2. **Estilos**: Edita los styled-components en `frontend/src/pages/Login.js`
3. **Validaciones**: Agrega validaciones adicionales en el frontend o backend
4. **Base de datos**: Reemplaza las credenciales hardcodeadas con una base de datos real

## Notas de Seguridad

⚠️ **Este es un sistema de login básico para desarrollo/pruebas. Para producción:**

- Implementa autenticación con JWT
- Usa HTTPS
- Hashea las contraseñas
- Implementa rate limiting
- Usa una base de datos segura
- Agrega validaciones más robustas
- Considera implementar autenticación de dos factores