-- Migración 004: Crear tabla clientes
-- Fecha: 2024-06-22
-- Descripción: Tabla para gestionar los clientes de la empresa

USE nhestetica_db;

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  direccion TEXT,
  telefono VARCHAR(20),
  email VARCHAR(100),
  antiguedad INT DEFAULT 0 COMMENT 'Antigüedad en días',
  fecha_inscripcion DATE,
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 