# NhEstetica - Sistema de Gestión para Estética

Sistema fullstack para la gestión de una clínica estética, con frontend en React y backend en Node.js.

## 🏗️ Estructura del Proyecto

```
NhEstetica/
├── frontend/          # Aplicación React
├── backend/           # API Node.js
└── README.md         # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- MySQL (versión 8.0 o superior)
- npm o yarn

### 1. Configurar Base de Datos

1. Instala y configura MySQL
2. Crea un archivo `.env` en la carpeta `backend/` basado en `env.example`
3. Configura las credenciales de la base de datos en el archivo `.env`

### 2. Configurar Backend

```bash
cd backend
npm install
node setup.js
```

El comando `node setup.js` ejecutará las migraciones de la base de datos y configurará todo lo necesario.

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

## 🏃‍♂️ Ejecutar el Proyecto

### Backend

```bash
cd backend
npm start
```

El servidor se ejecutará en `http://localhost:5000`

### Frontend

```bash
cd frontend
npm start
```

La aplicación se ejecutará en `http://localhost:3000`

## 📋 Funcionalidades

### Backend
- API RESTful con Express.js
- Autenticación JWT
- Gestión de usuarios y roles
- Gestión de clientes
- Gestión de tratamientos y productos
- Sistema de turnos
- Gestión financiera (ingresos, egresos, caja)
- Sistema de comisiones
- Auditoría de cambios
- Envío de emails

### Frontend
- Interfaz moderna y responsive
- Panel de administración
- Gestión de clientes
- Gestión de tratamientos y productos
- Sistema de turnos
- Dashboard financiero
- Reportes y estadísticas
- Galería de servicios
- Formularios de contacto

## 🛠️ Scripts Disponibles

### Backend (`/backend`)
- `npm start` - Inicia el servidor
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm run setup` - Ejecuta las migraciones de la base de datos

### Frontend (`/frontend`)
- `npm start` - Inicia la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas

## 🔧 Configuración de Desarrollo

### Variables de Entorno (Backend)

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
DB_HOST=localhost
DB_USER=nhestetica_user
DB_PASSWORD=nhestetica123
DB_NAME=nhestetica_db
DB_PORT=3306
JWT_SECRET=tu_secreto_jwt
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password
```

## 📁 Estructura de Carpetas

### Backend
```
backend/
├── config/           # Configuraciones
├── controllers/      # Controladores de la API
├── middleware/       # Middlewares personalizados
├── migraciones/      # Archivos SQL de migración
├── public/          # Archivos estáticos
├── routes/          # Rutas de la API
├── services/        # Servicios de negocio
├── server.js        # Punto de entrada del servidor
└── setup.js         # Script de configuración inicial
```

### Frontend
```
frontend/
├── public/          # Archivos públicos
├── src/
│   ├── components/  # Componentes React
│   ├── contexts/    # Contextos de React
│   ├── pages/       # Páginas de la aplicación
│   ├── services/    # Servicios de API
│   └── utils/       # Utilidades
└── package.json
```

## 🔐 Autenticación

El sistema utiliza JWT para la autenticación. Los usuarios pueden acceder a través de `/login` y el token se almacena en el localStorage.

## 📊 Base de Datos

El sistema incluye las siguientes entidades principales:
- Usuarios y roles
- Clientes
- Tratamientos y productos
- Turnos y horarios
- Ventas y transacciones
- Configuraciones del sistema

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo.
