-- Migración 031: Corregir la contraseña hasheada del admin
-- Actualizar con el hash correcto para la contraseña "123"

UPDATE users SET password = '$2a$10$X2id.dbJc7iGGLUsMvfy2.N11zVDgM4NEqcCy8O6eMP5pM4yZunhe' WHERE username = 'admin@nhestetica.com'; 