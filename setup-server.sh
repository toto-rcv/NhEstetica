#!/bin/bash

echo "🔧 Configurando servidor para NhEstetica..."

# Actualizar sistema
echo "📦 Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Node.js y npm
echo "📦 Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 globalmente
echo "📦 Instalando PM2..."
sudo npm install -g pm2

# Instalar MySQL
echo "📦 Instalando MySQL..."
sudo apt install -y mysql-server

# Instalar Nginx
echo "📦 Instalando Nginx..."
sudo apt install -y nginx

# Configurar firewall
echo "🔥 Configurando firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3306
sudo ufw --force enable

# Crear directorios necesarios
echo "📁 Creando directorios..."
sudo mkdir -p /var/www/nhestetica
sudo mkdir -p /var/www/nhestetica/backend/logs

# Configurar permisos
echo "🔐 Configurando permisos..."
sudo chown -R $USER:$USER /var/www/nhestetica

echo "✅ Configuración del servidor completada!"
echo "🚀 Ahora puedes ejecutar: ./deploy.sh" 