-- Migración 027: Agregar columna permisos a la tabla users
-- Esta columna controlará el acceso al panel de administración
-- 1 = Acceso completo, 0 = Sin acceso

ALTER TABLE users ADD COLUMN permisos TINYINT(1) DEFAULT 0 COMMENT 'Permisos de administración: 1=Admin, 0=Usuario normal';

-- Actualizar el usuario existente para que tenga permisos de admin
UPDATE users SET permisos = 1 WHERE username = 'user'; 