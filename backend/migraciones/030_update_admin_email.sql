-- Migración 030: Actualizar username del admin a un email válido
-- Esto permite que el admin se loguee con email como los clientes

UPDATE users SET username = 'admin@nhestetica.com' WHERE username = 'user'; 