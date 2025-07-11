-- ======================================================
-- MIGRACIÓN AUDITORÍA CAJA
-- ======================================================
-- Fecha: 2024-12-30
-- Descripción: Tabla para registrar cambios en las tablas de caja

USE nhestetica_db;

-- ======================================================
-- TABLA AUDITORÍA CAJA
-- ======================================================
CREATE TABLE IF NOT EXISTS auditoria_caja (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tabla VARCHAR(50) NOT NULL COMMENT 'Nombre de la tabla modificada',
  accion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL COMMENT 'Tipo de acción realizada',
  registro_id BIGINT COMMENT 'ID del registro afectado',
  datos_anteriores JSON NULL COMMENT 'Datos antes del cambio',
  datos_nuevos JSON NULL COMMENT 'Datos después del cambio',
  usuario_id BIGINT NULL COMMENT 'ID del usuario que realizó el cambio',
  usuario_nombre VARCHAR(100) NULL COMMENT 'Nombre del usuario que realizó el cambio',
  fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora del cambio',
  ip_address VARCHAR(45) NULL COMMENT 'Dirección IP del usuario',
  user_agent TEXT NULL COMMENT 'User agent del navegador',
  
  -- Índices para optimizar consultas
  INDEX idx_tabla (tabla),
  INDEX idx_accion (accion),
  INDEX idx_fecha (fecha_cambio),
  INDEX idx_usuario (usuario_id),
  INDEX idx_registro (registro_id)
);

-- ======================================================
-- TABLA CONFIGURACIÓN EMAIL
-- ======================================================
CREATE TABLE IF NOT EXISTS configuracion_email (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email_destino VARCHAR(255) NOT NULL COMMENT 'Email donde se enviarán los reportes de caja',
  nombre_destinatario VARCHAR(100) NOT NULL COMMENT 'Nombre del destinatario',
  activo BOOLEAN DEFAULT TRUE COMMENT 'Si el envío de emails está activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar configuración por defecto
INSERT IGNORE INTO configuracion_email (email_destino, nombre_destinatario) 
VALUES ('admin@nhestetica.com', 'Administrador NH Estética'); 