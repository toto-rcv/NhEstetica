USE nhestetica_db;

-- Agregar columna fecha a la tabla ventas
ALTER TABLE ventas ADD COLUMN fecha DATETIME DEFAULT CURRENT_TIMESTAMP; 