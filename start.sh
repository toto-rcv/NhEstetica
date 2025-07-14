#!/bin/bash

echo "🚀 Iniciando NhEstetica..."

# Iniciar PM2 si no está corriendo
if ! pm2 list | grep -q "nhestetica-backend"; then
    echo "📦 Iniciando backend con PM2..."
    cd /var/www/nhestetica/backend
    pm2 start ecosystem.config.js --env production
    pm2 save
else
    echo "✅ Backend ya está corriendo"
fi

# Verificar estado
echo "📊 Estado de la aplicación:"
pm2 list

echo "✅ ¡Listo! Tu aplicación está corriendo"
echo "🌍 URL: http://31.97.83.15"
echo "📊 Logs: pm2 logs nhestetica-backend" 