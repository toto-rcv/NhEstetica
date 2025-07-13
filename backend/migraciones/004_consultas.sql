-- ======================================================
-- MIGRACIÓN CONSULTAS
-- ======================================================
-- Fecha: 2024-12-30
-- Descripción: Tabla para almacenar consultas del formulario de contacto

USE nhestetica_db;

-- ======================================================
-- TABLA CONSULTAS
-- ======================================================
CREATE TABLE IF NOT EXISTS consultas (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL COMMENT 'Nombre del cliente',
  apellido VARCHAR(100) NOT NULL COMMENT 'Apellido del cliente',
  email VARCHAR(255) NOT NULL COMMENT 'Email del cliente',
  mensaje TEXT NOT NULL COMMENT 'Mensaje de la consulta',
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de envío',
  estado ENUM('Nueva', 'Leída', 'Respondida', 'Archivada') DEFAULT 'Nueva' COMMENT 'Estado de la consulta',
  
  -- Índices para optimizar consultas
  INDEX idx_email (email),
  INDEX idx_fecha_envio (fecha_envio),
  INDEX idx_estado (estado),
  INDEX idx_email_fecha (email, fecha_envio)
); 