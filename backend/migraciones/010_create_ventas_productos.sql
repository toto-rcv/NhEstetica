RENAME TABLE ventas TO ventas_tratamientos;

CREATE TABLE IF NOT EXISTS ventas_productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto VARCHAR(200) NOT NULL,
  marca VARCHAR(200) NOT NULL,
  costo INT,
  precio INT,
  cliente_id INT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);
