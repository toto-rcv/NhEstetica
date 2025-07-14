#!/bin/bash

echo "🚀 Iniciando despliegue de NhEstetica..."

# Variables
PROJECT_DIR="/var/www/nhestetica"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Crear directorios si no existen
sudo mkdir -p $PROJECT_DIR
sudo mkdir -p $BACKEND_DIR/logs

# Copiar archivos del proyecto
echo "📁 Copiando archivos del proyecto..."
sudo cp -r backend/* $BACKEND_DIR/
sudo cp -r frontend/* $FRONTEND_DIR/

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd $BACKEND_DIR
sudo npm install --production

# Construir frontend
echo "🏗️ Construyendo frontend..."
cd $FRONTEND_DIR
sudo npm install
sudo npm run build

# Configurar PM2
echo "⚙️ Configurando PM2..."
cd $BACKEND_DIR
sudo npm install -g pm2
sudo pm2 start ecosystem.config.js --env production
sudo pm2 save
sudo pm2 startup

# Configurar Nginx
echo "🌐 Configurando Nginx..."
sudo cp nginx/nhestetica.conf /etc/nginx/sites-available/nhestetica
sudo ln -sf /etc/nginx/sites-available/nhestetica /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Despliegue completado!"
echo "🌍 Tu aplicación está disponible en: http://31.97.83.15"
echo "📊 Para ver logs: pm2 logs nhestetica-backend"
echo "🔄 Para reiniciar: pm2 restart nhestetica-backend" 