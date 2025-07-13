# Sistema de Email - NH Estética con Brevo

## Descripción

El sistema de email permite enviar automáticamente reportes de cierre de caja por email usando Brevo (anteriormente Sendinblue), incluyendo todas las tablas de caja y un registro de auditoría de cambios realizados por usuarios.

## Características

- ✅ **Envío automático** de reportes al cerrar la caja del día
- ✅ **Auditoría completa** de cambios en las tablas de caja
- ✅ **Tablas detalladas** con ingresos, egresos y resumen
- ✅ **Configuración flexible** desde la interfaz web
- ✅ **Email de prueba** para verificar la configuración
- ✅ **Registro de usuarios** que realizaron cambios
- ✅ **Alta tasa de entrega** con Brevo
- ✅ **Analytics y tracking** de emails enviados

## Configuración de Brevo

### 1. Crear Cuenta en Brevo

1. Ve a [Brevo](https://www.brevo.com/) y crea una cuenta gratuita
2. Verifica tu email y completa el proceso de registro
3. Accede al panel de control de Brevo

### 2. Generar API Key

1. En el panel de Brevo, ve a **Settings** > **API Keys**
2. Haz clic en **Create a new API key**
3. Dale un nombre como "NH Estética Email Service"
4. Selecciona los permisos: **Transactional emails**
5. Copia la API Key generada (empieza con `xkeysib-`)

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en el directorio `backend/` con:

```env
# Configuración de Email (Brevo)
BREVO_API_KEY=xkeysib-tu_api_key_aqui
EMAIL_FROM=noreply@nhestetica.com

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
npm install @getbrevo/brevo
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
4. **Envía el reporte** al email configurado usando Brevo

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

## Ventajas de Brevo

### vs Gmail SMTP

- ✅ **Mayor tasa de entrega** (99%+ vs 95%)
- ✅ **Analytics detallados** de emails enviados
- ✅ **Templates avanzados** y personalización
- ✅ **No requiere verificación en 2 pasos**
- ✅ **API más estable** y confiable
- ✅ **Soporte técnico** incluido
- ✅ **Plan gratuito** con 300 emails/día

### Características Adicionales

- 📊 **Dashboard** con estadísticas de envío
- 📈 **Tracking** de apertura y clics
- 🎨 **Editor visual** de templates
- 📧 **Listas de contactos** y segmentación
- 🔄 **Automatización** de emails
- 📱 **Responsive** en todos los dispositivos

## Solución de Problemas

### Error de API Key

- Verifica que la API Key sea correcta
- Asegúrate de que tenga permisos de "Transactional emails"
- Verifica que la cuenta de Brevo esté activa

### Email no se Envía

- Verifica la configuración en la interfaz web
- Revisa los logs del servidor para errores
- Usa el botón "Enviar Email de Prueba" para diagnosticar
- Verifica que el email destino sea válido

### No se Registran Cambios

- Verifica que las migraciones se ejecutaron correctamente
- Revisa que el usuario esté autenticado al realizar cambios
- Verifica los logs del servidor

### Límites de Brevo

- **Plan gratuito**: 300 emails/día
- **Plan Starter**: 20,000 emails/mes
- **Plan Business**: 100,000 emails/mes

## Seguridad

- ✅ Las API Keys de Brevo son más seguras que contraseñas de aplicación
- ✅ Solo usuarios con permisos completos pueden acceder a la configuración
- ✅ Los emails se envían solo al cerrar la caja
- ✅ Se registra toda la información de auditoría para trazabilidad
- ✅ Brevo cumple con GDPR y otras regulaciones de privacidad

## Migración desde Gmail

Si ya tenías configurado Gmail:

1. **Instala Brevo**: `npm install @getbrevo/brevo`
2. **Actualiza variables**: Cambia `EMAIL_USER` y `EMAIL_PASS` por `BREVO_API_KEY`
3. **Prueba la configuración**: Usa el botón de prueba en la interfaz
4. **Verifica envíos**: Los emails seguirán funcionando igual

## Notas Importantes

1. **Brevo**: El sistema ahora usa Brevo para mayor confiabilidad
2. **API Key**: Nunca compartas tu API Key de Brevo
3. **Plan Gratuito**: Incluye 300 emails por día, suficiente para uso normal
4. **Pruebas**: Siempre usa el email de prueba antes de cerrar la caja
5. **Backup**: Los reportes se envían por email, pero también se guardan en la base de datos
6. **Analytics**: Puedes ver estadísticas de envío en el panel de Brevo 