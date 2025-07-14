#!/bin/bash

echo "🔧 Corrigiendo problemas del despliegue..."

# Variables
PROJECT_DIR="/var/www/nhestetica"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Verificar si los directorios existen
echo "📁 Verificando directorios..."
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Directorio del proyecto no existe. Creando..."
    sudo mkdir -p $PROJECT_DIR
fi

if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Directorio backend no existe. Creando..."
    sudo mkdir -p $BACKEND_DIR
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Directorio frontend no existe. Creando..."
    sudo mkdir -p $FRONTEND_DIR
fi

# Copiar archivos desde el directorio actual
echo "📁 Copiando archivos..."
sudo cp -r backend/* $BACKEND_DIR/ 2>/dev/null || echo "⚠️ No se encontró directorio backend local"
sudo cp -r frontend/* $FRONTEND_DIR/ 2>/dev/null || echo "⚠️ No se encontró directorio frontend local"

# Verificar archivos críticos
echo "🔍 Verificando archivos críticos..."
if [ ! -f "$BACKEND_DIR/server.js" ]; then
    echo "❌ server.js no encontrado en $BACKEND_DIR"
    echo "📋 Contenido del directorio backend:"
    ls -la $BACKEND_DIR/ 2>/dev/null || echo "Directorio vacío o no existe"
else
    echo "✅ server.js encontrado"
fi

# Crear archivo de configuración de Nginx si no existe
echo "🌐 Configurando Nginx..."
if [ ! -f "nginx/nhestetica.conf" ]; then
    echo "📝 Creando archivo de configuración de Nginx..."
    sudo mkdir -p nginx
    sudo tee nginx/nhestetica.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name 31.97.83.15;
    
    # Frontend (React build)
    location / {
        root /var/www/nhestetica/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Cache estático
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API Backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Archivos de imágenes del backend
    location /images-de-productos/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /images-de-clientes/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /images-de-tratamientos/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /images-de-personal/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Configuración de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Logs
    access_log /var/log/nginx/nhestetica_access.log;
    error_log /var/log/nginx/nhestetica_error.log;
}
EOF
    echo "✅ Archivo de configuración de Nginx creado"
fi

# Configurar Nginx
echo "🌐 Aplicando configuración de Nginx..."
sudo cp nginx/nhestetica.conf /etc/nginx/sites-available/nhestetica
sudo ln -sf /etc/nginx/sites-available/nhestetica /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Limpiar PM2 y reiniciar
echo "🔄 Limpiando PM2..."
pm2 delete nhestetica-backend 2>/dev/null || echo "No había procesos PM2 para eliminar"

# Instalar dependencias si es necesario
if [ -d "$BACKEND_DIR" ]; then
    echo "📦 Instalando dependencias del backend..."
    cd $BACKEND_DIR
    sudo npm install --production
fi

if [ -d "$FRONTEND_DIR" ]; then
    echo "📦 Instalando dependencias del frontend..."
    cd $FRONTEND_DIR
    sudo npm install
    sudo npm run build
fi

echo "✅ Corrección completada!"
echo "🚀 Ahora ejecuta: ./start.sh" 