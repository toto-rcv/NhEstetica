-- Migración 009: Crear tabla productos
-- Fecha: 2024-06-22
-- Descripción: Tabla para gestionar productos de la empresa

USE nhestetica_db;

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  imagen VARCHAR(255),
  categoria VARCHAR(100),
  marca VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 