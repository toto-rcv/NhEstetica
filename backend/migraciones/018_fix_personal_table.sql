-- Migración para asegurar que la tabla 'personal' tenga todas las columnas requeridas
-- Modifica los nombres y agrega las columnas necesarias

ALTER TABLE personal
  -- Cambiar nombre de columna 'comision' a 'comision_venta'
  CHANGE COLUMN comision comision_venta DECIMAL(10,2) DEFAULT 0,
  -- Cambiar nombre de columna 'sueldo' a 'sueldo_mensual'
  CHANGE COLUMN sueldo sueldo_mensual DECIMAL(10,2) DEFAULT 0,
  -- Asegurar que 'dni' existe y es VARCHAR(20)
  MODIFY COLUMN dni VARCHAR(20) NOT NULL,
  -- Asegurar que 'comision_fija' existe y es DECIMAL
  MODIFY COLUMN comision_fija DECIMAL(10,2) DEFAULT 0,
  -- Agregar columna 'fecha_contratacion' si no existe
  ADD COLUMN IF NOT EXISTS fecha_contratacion DATE NULL AFTER especialidad,
  -- Agregar columna 'estado' si no existe
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'Activo' AFTER sueldo_mensual,
  -- Agregar columna 'created_at' si no existe
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Agregar columna 'updated_at' si no existe
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- NOTA: Si alguna columna ya existe, el comando ADD COLUMN IF NOT EXISTS la ignorará.
-- Si tu versión de MySQL no soporta 'IF NOT EXISTS', deberás agregar las columnas manualmente solo si faltan.

-- Estructura final esperada:
-- id INT PRIMARY KEY AUTO_INCREMENT
-- dni VARCHAR(20) NOT NULL
-- nombre VARCHAR(100) NOT NULL
-- apellido VARCHAR(100) NOT NULL
-- direccion VARCHAR(255)
-- telefono VARCHAR(30)
-- email VARCHAR(100)
-- cargo VARCHAR(100)
-- especialidad VARCHAR(100)
-- fecha_contratacion DATE
-- comision_venta DECIMAL(10,2) DEFAULT 0
-- comision_fija DECIMAL(10,2) DEFAULT 0
-- sueldo_mensual DECIMAL(10,2) DEFAULT 0
-- estado VARCHAR(20) DEFAULT 'Activo'
-- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 