-- ======================================================
-- MIGRACION 003 - AGREGAR COLUMNA DNI A CLIENTES
-- ======================================================
-- Fecha: 2024-12-30
-- Descripcion: Agregar columna DNI a la tabla clientes para el sistema de reservas

USE nhestetica_db;

-- Agregar columna DNI a la tabla clientes
ALTER TABLE clientes 
ADD COLUMN dni VARCHAR(20) NULL COMMENT 'DNI del cliente',
ADD INDEX idx_dni (dni);

-- Actualizar registros existentes con DNI por defecto (opcional)
-- UPDATE clientes SET dni = CONCAT('00000000', id) WHERE dni IS NULL; 