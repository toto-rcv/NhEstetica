-- Script para crear la base de datos de NhEstetica
-- Ejecuta este script en tu servidor MySQL

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS nhestetica_db;

-- Usar la base de datos
USE nhestetica_db;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de Personal
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

-- Crear tabla de Clientes
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

-- Crear tabla de Comisiones (para el historial)
CREATE TABLE IF NOT EXISTS comisiones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  personal_id INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  servicio VARCHAR(200) NOT NULL,
  comision DECIMAL(10,2) NOT NULL,
  estado ENUM('Completado', 'Pendiente', 'Cancelado') DEFAULT 'Completado',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (personal_id) REFERENCES personal(id) ON DELETE CASCADE
);

-- Insertar usuario de prueba (la contraseña será hasheada por el backend)
-- Usuario: user, Contraseña: 123
INSERT IGNORE INTO users (username, password) VALUES ('user', '123');

-- Mostrar las tablas creadas
SHOW TABLES; 