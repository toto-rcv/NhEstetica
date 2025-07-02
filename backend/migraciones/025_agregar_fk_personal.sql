ALTER TABLE ventas_tratamientos
ADD COLUMN personal_id BIGINT AFTER tratamiento_id;

ALTER TABLE ventas_tratamientos
ADD CONSTRAINT fk_ventas_tratamientos_personal
FOREIGN KEY (personal_id) REFERENCES personal(id)
ON DELETE SET NULL;