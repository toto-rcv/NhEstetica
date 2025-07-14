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

# Verificar que los archivos se copiaron correctamente
echo "🔍 Verificando archivos..."
ls -la $BACKEND_DIR/
ls -la $FRONTEND_DIR/

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd $BACKEND_DIR
sudo npm install --production

# Configurar base de datos
echo "🗄️ Configurando base de datos..."
sudo mysql_secure_installation <<EOF

y
0
y
y
y
y
EOF

# Crear archivo .env si no existe
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo "📝 Creando archivo .env..."
    cp $BACKEND_DIR/env.example $BACKEND_DIR/.env
fi

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