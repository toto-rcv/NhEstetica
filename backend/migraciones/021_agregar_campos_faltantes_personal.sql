-- Migración 021: Agregar campos faltantes críticos a la tabla personal
-- Fecha: 2024-12-30
-- Descripción: Agregar DNI, fecha_contratacion y estado que son campos críticos

USE nhestetica_db;

-- Agregar DNI como primer campo (campo crítico)
ALTER TABLE personal ADD COLUMN dni VARCHAR(20) UNIQUE FIRST;

-- Agregar fecha_contratacion después de especialidad
ALTER TABLE personal ADD COLUMN fecha_contratacion DATE AFTER especialidad;

-- Agregar estado después de updated_at
ALTER TABLE personal ADD COLUMN estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo' AFTER updated_at;

-- Corregir el tipo de comision_fija para que sea consistente
ALTER TABLE personal MODIFY COLUMN comision_fija DECIMAL(10,2) DEFAULT 0.00; 