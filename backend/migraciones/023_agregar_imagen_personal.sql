-- Migración 023: Agregar campo imagen a la tabla personal
ALTER TABLE personal ADD COLUMN imagen VARCHAR(255) DEFAULT NULL; 