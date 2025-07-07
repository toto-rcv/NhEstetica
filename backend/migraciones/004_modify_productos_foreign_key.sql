-- Migración para modificar la restricción de clave foránea en ventas_productos
-- Esto permitirá eliminar productos sin afectar las ventas históricas

USE nhestetica_db;

-- Eliminar la restricción de clave foránea existente
ALTER TABLE ventas_productos DROP FOREIGN KEY ventas_productos_ibfk_2;

-- Agregar la nueva restricción con ON DELETE SET NULL
ALTER TABLE ventas_productos 
ADD CONSTRAINT ventas_productos_ibfk_2 
FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL;

-- Verificar que el cambio se aplicó correctamente
SHOW CREATE TABLE ventas_productos; 