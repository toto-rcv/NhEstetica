#!/bin/bash

echo "🛑 Deteniendo NhEstetica..."

# Detener PM2
pm2 stop nhestetica-backend
pm2 delete nhestetica-backend

echo "✅ Aplicación detenida" 