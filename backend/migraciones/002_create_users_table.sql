-- Migración 002: Crear tabla users
-- Fecha: 2024-06-22
-- Descripción: Tabla para autenticación de usuarios del sistema

USE nhestetica_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario por defecto
INSERT IGNORE INTO users (username, password) VALUES ('user', '123'); 