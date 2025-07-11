# Sistema de Email - NH Estética

## Descripción

El sistema de email permite enviar automáticamente reportes de cierre de caja por email, incluyendo todas las tablas de caja y un registro de auditoría de cambios realizados por usuarios.

## Características

- ✅ **Envío automático** de reportes al cerrar la caja del día
- ✅ **Auditoría completa** de cambios en las tablas de caja
- ✅ **Tablas detalladas** con ingresos, egresos y resumen
- ✅ **Configuración flexible** desde la interfaz web
- ✅ **Email de prueba** para verificar la configuración
- ✅ **Registro de usuarios** que realizaron cambios

## Configuración de Gmail

### 1. Activar Verificación en 2 Pasos

1. Ve a tu cuenta de Google
2. Navega a "Seguridad"
3. Activa "Verificación en 2 pasos"

### 2. Generar Contraseña de Aplicación

1. Ve a "Seguridad" > "Contraseñas de aplicación"
2. Selecciona "Otra aplicación personalizada"
3. Escribe "NH Estética" como nombre
4. Copia la contraseña generada (16 caracteres)

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en el directorio `backend/` con:

```env
# Configuración de Email (Gmail)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# Configuración de Base de Datos
DB_HOST=localhost
DB_USER=nhestetica_user
DB_PASSWORD=nhestetica123
DB_NAME=nhestetica_db
DB_PORT=3306

# Configuración de JWT
JWT_SECRET=tu_clave_secreta_jwt
```

## Instalación

### 1. Instalar Dependencias

```bash
cd backend
npm install nodemailer
```

### 2. Ejecutar Migraciones

```bash
node run-migrations.js
```

### 3. Configurar desde la Interfaz Web

1. Accede al sistema como administrador
2. Ve a "📧 Email" en el menú de navegación
3. Configura el email destino y nombre del destinatario
4. Usa "Enviar Email de Prueba" para verificar la configuración

## Funcionamiento

### Al Cerrar la Caja

Cuando se cierra la caja del día, el sistema:

1. **Registra la auditoría** del cambio de cierre
2. **Obtiene todos los datos** de caja del día:
   - Tabla de caja (apertura/cierre)
   - Ingresos (ventas de productos y tratamientos)
   - Egresos registrados
   - Cambios de auditoría
3. **Genera un email HTML** con todas las tablas
4. **Envía el reporte** al email configurado

### Contenido del Email

El email incluye:

- 📊 **Resumen de caja** con montos de apertura y cierre
- 💰 **Tabla de ingresos** con todos los detalles
- 💸 **Tabla de egresos** con todos los registros
- 👥 **Auditoría de cambios** por usuario
- 📋 **Lista de usuarios** que realizaron cambios

### Auditoría de Cambios

El sistema registra automáticamente:

- **Usuario** que realizó el cambio
- **Acción** (INSERT, UPDATE, DELETE)
- **Tabla** modificada
- **Datos anteriores** y **nuevos**
- **Fecha y hora** del cambio
- **IP** del usuario
- **User Agent** del navegador

## Estructura de Base de Datos

### Tabla: `auditoria_caja`

```sql
CREATE TABLE auditoria_caja (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tabla VARCHAR(50) NOT NULL,
  accion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  registro_id BIGINT,
  datos_anteriores JSON NULL,
  datos_nuevos JSON NULL,
  usuario_id BIGINT NULL,
  usuario_nombre VARCHAR(100) NULL,
  fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL
);
```

### Tabla: `configuracion_email`

```sql
CREATE TABLE configuracion_email (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email_destino VARCHAR(255) NOT NULL,
  nombre_destinatario VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Endpoints de API

### Configuración de Email

- `GET /api/email/configuracion` - Obtener configuración
- `PUT /api/email/configuracion` - Actualizar configuración
- `POST /api/email/prueba` - Enviar email de prueba

### Auditoría

- `GET /api/email/auditoria/:fecha` - Obtener auditoría por fecha

## Solución de Problemas

### Error de Autenticación Gmail

- Verifica que la verificación en 2 pasos esté activada
- Asegúrate de usar una contraseña de aplicación, no tu contraseña normal
- Verifica que el email y contraseña sean correctos

### Email no se Envía

- Verifica la configuración en la interfaz web
- Revisa los logs del servidor para errores
- Usa el botón "Enviar Email de Prueba" para diagnosticar

### No se Registran Cambios

- Verifica que las migraciones se ejecutaron correctamente
- Revisa que el usuario esté autenticado al realizar cambios
- Verifica los logs del servidor

## Seguridad

- ✅ Las contraseñas de aplicación son más seguras que las contraseñas normales
- ✅ Solo usuarios con permisos completos pueden acceder a la configuración
- ✅ Los emails se envían solo al cerrar la caja
- ✅ Se registra toda la información de auditoría para trazabilidad

## Notas Importantes

1. **Gmail**: El sistema está configurado para Gmail por defecto
2. **Contraseña de Aplicación**: Nunca uses tu contraseña normal de Gmail
3. **Verificación en 2 Pasos**: Es obligatoria para generar contraseñas de aplicación
4. **Pruebas**: Siempre usa el email de prueba antes de cerrar la caja
5. **Backup**: Los reportes se envían por email, pero también se guardan en la base de datos 