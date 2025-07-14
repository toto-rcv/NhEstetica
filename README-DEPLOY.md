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

Asegúrate de tener configurado el archivo `.env` en el backend con las credenciales de tu base de datos MySQL.

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

### Verificar puertos
```bash
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :5000
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