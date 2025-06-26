USE nhestetica_db;

ALTER TABLE ventas_tratamientos
ADD COLUMN vencimiento DATE AFTER precio;
