#!/bin/bash

echo "🔍 Verificando estado del despliegue..."

# Variables
PROJECT_DIR="/var/www/nhestetica"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo "📁 Verificando directorios..."
echo "Proyecto: $([ -d "$PROJECT_DIR" ] && echo "✅ Existe" || echo "❌ No existe")"
echo "Backend: $([ -d "$BACKEND_DIR" ] && echo "✅ Existe" || echo "❌ No existe")"
echo "Frontend: $([ -d "$FRONTEND_DIR" ] && echo "✅ Existe" || echo "❌ No existe")"

echo ""
echo "📄 Verificando archivos críticos..."
echo "server.js: $([ -f "$BACKEND_DIR/server.js" ] && echo "✅ Existe" || echo "❌ No existe")"
echo "package.json backend: $([ -f "$BACKEND_DIR/package.json" ] && echo "✅ Existe" || echo "❌ No existe")"
echo "package.json frontend: $([ -f "$FRONTEND_DIR/package.json" ] && echo "✅ Existe" || echo "❌ No existe")"
echo "build frontend: $([ -d "$FRONTEND_DIR/build" ] && echo "✅ Existe" || echo "❌ No existe")"

echo ""
echo "⚙️ Verificando servicios..."
echo "PM2: $(pm2 list | grep nhestetica-backend > /dev/null && echo "✅ Corriendo" || echo "❌ No corriendo")"
echo "Nginx: $(sudo systemctl is-active nginx)"
echo "MySQL: $(sudo systemctl is-active mysql)"

echo ""
echo "🌐 Verificando puertos..."
echo "Puerto 80: $(sudo netstat -tlnp | grep :80 > /dev/null && echo "✅ En uso" || echo "❌ Libre")"
echo "Puerto 5000: $(sudo netstat -tlnp | grep :5000 > /dev/null && echo "✅ En uso" || echo "❌ Libre")"
echo "Puerto 3306: $(sudo netstat -tlnp | grep :3306 > /dev/null && echo "✅ En uso" || echo "❌ Libre")"

echo ""
echo "📋 Verificando configuración de Nginx..."
echo "Configuración: $([ -f "/etc/nginx/sites-enabled/nhestetica" ] && echo "✅ Existe" || echo "❌ No existe")"
echo "Test Nginx: $(sudo nginx -t 2>&1 | grep -q "test is successful" && echo "✅ OK" || echo "❌ Error")"

echo ""
echo "🔧 Comandos útiles:"
echo "Para corregir problemas: ./fix-deployment.sh"
echo "Para ver logs PM2: pm2 logs nhestetica-backend"
echo "Para ver logs Nginx: sudo tail -f /var/log/nginx/nhestetica_error.log"
echo "Para reiniciar todo: ./stop.sh && ./start.sh" 