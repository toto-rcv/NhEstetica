-- Migración 005: Crear tabla comisiones
-- Fecha: 2024-06-22
-- Descripción: Tabla para gestionar el historial de comisiones del personal

USE nhestetica_db;

CREATE TABLE IF NOT EXISTS comisiones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  personal_id INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  servicio VARCHAR(200) NOT NULL,
  comision DECIMAL(10,2) NOT NULL,
  estado ENUM('Completado', 'Pendiente', 'Cancelado') DEFAULT 'Completado',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (personal_id) REFERENCES personal(id) ON DELETE CASCADE
); 