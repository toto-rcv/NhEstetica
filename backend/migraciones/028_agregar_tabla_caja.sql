CREATE TABLE IF NOT EXISTS caja_aperturas_cierres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  monto_apertura DECIMAL(10,2) NOT NULL,
  monto_cierre DECIMAL(10,2) NOT NULL,
  UNIQUE (fecha)
);
