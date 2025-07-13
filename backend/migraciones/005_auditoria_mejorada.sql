-- ======================================================
-- MIGRACIÓN AUDITORÍA MEJORADA
-- ======================================================
-- Fecha: 2024-12-30
-- Descripción: Agregar campos para email del usuario y detalles específicos

USE nhestetica_db;

-- ======================================================
-- AGREGAR CAMPOS A AUDITORIA_CAJA
-- ======================================================

-- Agregar campo usuario_email
ALTER TABLE auditoria_caja 
ADD COLUMN usuario_email VARCHAR(255) NULL COMMENT 'Email del usuario que realizó el cambio' 
AFTER usuario_nombre;

-- Agregar campo detalles
ALTER TABLE auditoria_caja 
ADD COLUMN detalles TEXT NULL COMMENT 'Detalles específicos del cambio realizado' 
AFTER user_agent;

-- Crear índice para el email del usuario
CREATE INDEX idx_usuario_email ON auditoria_caja(usuario_email); 