CREATE TABLE gastos_fijos_mensuales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mes VARCHAR(7) NOT NULL, -- formato YYYY-MM (ej: "2025-07")
  alquiler DECIMAL(10,2) DEFAULT 0,
  expensas DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE gastos_fijos_mensuales ADD UNIQUE INDEX idx_mes_unique (mes);

ALTER TABLE gastos_fijos_mensuales ADD UNIQUE (mes);