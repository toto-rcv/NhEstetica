-- Migración 020: Arreglar tabla personal
-- Fecha: 2024-12-30
-- Descripción: Agregar campos faltantes a la tabla personal

USE nhestetica_db;

-- Agregar DNI como primer campo
ALTER TABLE personal ADD COLUMN dni VARCHAR(20) UNIQUE FIRST;

-- Agregar especialidad después de cargo
ALTER TABLE personal ADD COLUMN especialidad VARCHAR(100) AFTER cargo;

-- Agregar fecha_contratacion después de especialidad
ALTER TABLE personal ADD COLUMN fecha_contratacion DATE AFTER especialidad;

-- Agregar comision_venta después de fecha_contratacion
ALTER TABLE personal ADD COLUMN comision_venta DECIMAL(5,2) DEFAULT 0.00 AFTER fecha_contratacion;

-- Agregar comision_fija después de comision_venta
ALTER TABLE personal ADD COLUMN comision_fija DECIMAL(10,2) DEFAULT 0.00 AFTER comision_venta;

-- Agregar sueldo_mensual después de comision_fija
ALTER TABLE personal ADD COLUMN sueldo_mensual DECIMAL(10,2) DEFAULT 0.00 AFTER comision_fija;

-- Agregar estado después de sueldo_mensual
ALTER TABLE personal ADD COLUMN estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo' AFTER sueldo_mensual;

-- Agregar created_at después de estado
ALTER TABLE personal ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER estado;

-- Agregar updated_at después de created_at
ALTER TABLE personal ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Modificar campos existentes para que sean opcionales donde corresponde
ALTER TABLE personal MODIFY COLUMN direccion VARCHAR(255) NULL;
ALTER TABLE personal MODIFY COLUMN telefono VARCHAR(20) NULL;
ALTER TABLE personal MODIFY COLUMN email VARCHAR(100) NULL;
ALTER TABLE personal MODIFY COLUMN cargo VARCHAR(100) NULL; 