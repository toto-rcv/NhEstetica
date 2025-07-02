-- Migración 028: Agregar campo password a la tabla clientes
-- Esto permitirá que los clientes tengan cuentas propias

ALTER TABLE clientes ADD COLUMN password VARCHAR(255) NULL COMMENT 'Contraseña hasheada del cliente'; 