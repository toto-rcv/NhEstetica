USE nhestetica_db;

CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tratamiento VARCHAR(200) NOT NULL,
  sesiones VARCHAR(200) NOT NULL,
  costo INT,
  precio INT,
  cliente_id INT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);