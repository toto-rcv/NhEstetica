ALTER TABLE ventas_productos
CHANGE COLUMN producto producto_id INT;

ALTER TABLE ventas_productos
ADD CONSTRAINT fk_producto
FOREIGN KEY (producto_id) REFERENCES productos(id)
ON DELETE SET NULL;
