# 🚀 Despliegue NhEstetica

Guía completa para desplegar la aplicación NhEstetica con PM2 y Nginx.

## 📋 Requisitos Previos

- Servidor Ubuntu/Debian
- Acceso SSH al servidor
- IP pública: `31.97.83.15`

## 🔧 Configuración Inicial

### 1. Conectar al servidor
```bash
ssh usuario@31.97.83.15
```

### 2. Clonar el proyecto
```bash
git clone <tu-repositorio>
cd NhEstetica
```

### 3. Configurar el servidor
```bash
chmod +x setup-server.sh
./setup-server.sh
```

### 4. Configurar MySQL (opcional - se hace automáticamente en deploy.sh)
```bash
sudo mysql_secure_installation
```

## 🚀 Despliegue

### Despliegue completo (primera vez)
```bash
chmod +x deploy.sh
./deploy.sh
```

### Iniciar aplicación
```bash
chmod +x start.sh
./start.sh
```

### Detener aplicación
```bash
chmod +x stop.sh
./stop.sh
```

## 📊 Comandos Útiles

### Ver logs del backend
```bash
pm2 logs nhestetica-backend
```

### Ver estado de PM2
```bash
pm2 status
```

### Reiniciar backend
```bash
pm2 restart nhestetica-backend
```

### Ver logs de Nginx
```bash
sudo tail -f /var/log/nginx/nhestetica_access.log
sudo tail -f /var/log/nginx/nhestetica_error.log
```

### Verificar configuración de Nginx
```bash
sudo nginx -t
```

### Recargar Nginx
```bash
sudo systemctl reload nginx
```

## 🌐 Acceso a la Aplicación

- **URL principal**: http://31.97.83.15
- **API Backend**: http://31.97.83.15/api/

## 📁 Estructura de Archivos

```
/var/www/nhestetica/
├── backend/           # Backend Node.js
├── frontend/          # Frontend React
└── frontend/build/    # Build de producción
```

## 🔧 Configuración de Base de Datos

### 1. Instalar MySQL
```bash
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 2. Configurar archivo .env
Crea el archivo `.env` en el directorio `backend/` basado en `env.example`:

```bash
cd backend
cp env.example .env
nano .env
```

Configuración mínima necesaria:
```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_USER=nhestetica_user
DB_PASSWORD=nhestetica123
DB_NAME=nhestetica_db
DB_PORT=3306

# Configuración de JWT
JWT_SECRET=tu_clave_secreta_jwt_super_segura

# Configuración del Servidor
PORT=5000
NODE_ENV=production
```

### 3. Configuración automática de la base de datos
El sistema automáticamente:
- Crea la base de datos `nhestetica_db`
- Crea el usuario `nhestetica_user` con contraseña `nhestetica123`
- Ejecuta las migraciones SQL
- Crea el usuario administrador: `adminNh@gmail.com` / `123`

### 4. Verificar conexión
```bash
cd /var/www/nhestetica/backend
node -e "require('./config/database').fullSetup().then(() => console.log('✅ DB OK')).catch(console.error)"
```

### 5. Acceder a MySQL
```bash
sudo mysql -u root -p
```

### 6. Comandos útiles de MySQL
```sql
-- Ver bases de datos
SHOW DATABASES;

-- Usar la base de datos
USE nhestetica_db;

-- Ver tablas
SHOW TABLES;

-- Ver usuarios
SELECT * FROM users;

-- Verificar permisos del usuario
SHOW GRANTS FOR 'nhestetica_user'@'localhost';
```

## 🛠️ Troubleshooting

### Si PM2 no inicia
```bash
pm2 delete nhestetica-backend
cd /var/www/nhestetica/backend
pm2 start ecosystem.config.js --env production
```

### Si Nginx no sirve el frontend
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Si hay problemas de permisos
```bash
sudo chown -R $USER:$USER /var/www/nhestetica
```

### Si hay problemas con MySQL
```bash
# Reiniciar MySQL
sudo systemctl restart mysql

# Verificar estado
sudo systemctl status mysql

# Ver logs
sudo tail -f /var/log/mysql/error.log
```

### Verificar puertos
```bash
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :5000
sudo netstat -tlnp | grep :3306
```

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. Hacer pull del repositorio
2. Ejecutar `./deploy.sh` nuevamente
3. O solo reiniciar con `pm2 restart nhestetica-backend`

## 📞 Soporte

Si tienes problemas:
1. Revisar logs: `pm2 logs nhestetica-backend`
2. Verificar estado: `pm2 status`
3. Revisar Nginx: `sudo nginx -t` 