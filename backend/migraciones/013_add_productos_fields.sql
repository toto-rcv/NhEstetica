-- Migración 013: Agregar campos adicionales a tabla productos
-- Fecha: 2024-12-19
-- Descripción: Agregar campos subtitle, isNatural, isVegan y benefits para compatibilidad con products.js

USE nhestetica_db;

-- Agregar campo subtitle
ALTER TABLE productos ADD COLUMN subtitle VARCHAR(255) DEFAULT NULL;

-- Agregar campo isNatural (boolean)
ALTER TABLE productos ADD COLUMN isNatural BOOLEAN DEFAULT FALSE;

-- Agregar campo isVegan (boolean)
ALTER TABLE productos ADD COLUMN isVegan BOOLEAN DEFAULT FALSE;

-- Agregar campo benefits (texto para almacenar array JSON)
ALTER TABLE productos ADD COLUMN benefits TEXT DEFAULT NULL; 