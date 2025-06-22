-- Migración 003: Crear tabla personal
-- Fecha: 2024-06-22
-- Descripción: Tabla para gestionar el personal de la empresa

USE nhestetica_db;

CREATE TABLE IF NOT EXISTS personal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dni VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  direccion TEXT,
  telefono VARCHAR(20),
  email VARCHAR(100),
  cargo VARCHAR(100),
  especialidad VARCHAR(100),
  fecha_contratacion DATE,
  comision_venta DECIMAL(5,2) DEFAULT 0.00,
  comision_fija DECIMAL(10,2) DEFAULT 0.00,
  sueldo_mensual DECIMAL(10,2) DEFAULT 0.00,
  estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 