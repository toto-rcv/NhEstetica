-- ======================================================
-- MIGRACIÓN CONSOLIDADA - BASE DE DATOS COMPLETA
-- ======================================================
-- Fecha: 2024-12-30
-- Descripción: Migración consolidada que incluye toda la estructura
-- de la base de datos y todas las modificaciones necesarias

CREATE DATABASE IF NOT EXISTS nhestetica_db;

USE nhestetica_db;

-- ======================================================
-- TABLA USERS
-- ======================================================
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  permisos TINYINT(1) DEFAULT 0 COMMENT 'Permisos de administración: 1=Admin, 0=Usuario normal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================
-- TABLA CLIENTES
-- ======================================================
CREATE TABLE IF NOT EXISTS clientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    direccion VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    nacionalidad VARCHAR(100) DEFAULT NULL,
    antiguedad DATE,
    fecha_inscripcion DATE,
    password VARCHAR(255) NULL COMMENT 'Contraseña hasheada del cliente',
    imagen VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================================================
-- TABLA PRODUCTOS
-- ======================================================
CREATE TABLE IF NOT EXISTS productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    costo BIGINT NOT NULL DEFAULT 0,
    precio BIGINT NOT NULL,
    subtitulo VARCHAR(150),
    marca VARCHAR(100),
    descripcion TEXT,
    modo_uso TEXT,
    imagen VARCHAR(255),
    categoria VARCHAR(100),
    `natural` BOOLEAN DEFAULT FALSE,
    vegano BOOLEAN DEFAULT FALSE,
    beneficios TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================================================
-- TABLA TRATAMIENTOS
-- ======================================================
CREATE TABLE IF NOT EXISTS tratamientos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio BIGINT NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    duracion VARCHAR(50) DEFAULT '',
    imagen VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================================================
-- TABLA PERSONAL
-- ======================================================
CREATE TABLE IF NOT EXISTS personal (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NULL,
    telefono VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    cargo VARCHAR(100) NULL,
    especialidad VARCHAR(100),
    fecha_contratacion DATE,
    comision_venta DECIMAL(5,2) DEFAULT 0.00,
    comision_fija DECIMAL(10,2) DEFAULT 0.00,
    sueldo_mensual DECIMAL(10,2) DEFAULT 0.00,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    imagen VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================================================
-- TABLA VENTAS PRODUCTOS
-- ======================================================
CREATE TABLE IF NOT EXISTS ventas_productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    costo BIGINT NOT NULL,
    precio BIGINT NOT NULL,
    cantidad INT DEFAULT 1,
    fecha DATE,
    forma_de_pago VARCHAR(255),
    cuotas INT,
    observacion VARCHAR(255),
    cliente_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- ======================================================
-- TABLA VENTAS TRATAMIENTOS
-- ======================================================
CREATE TABLE IF NOT EXISTS ventas_tratamientos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sesiones BIGINT NOT NULL,
    precio BIGINT NOT NULL,
    forma_de_pago VARCHAR(255),
    vencimiento DATE,
    fecha DATE,
    cuotas INT,
    observacion VARCHAR(255),
    cliente_id BIGINT NOT NULL,
    tratamiento_id BIGINT NOT NULL,
    personal_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (tratamiento_id) REFERENCES tratamientos(id),
    FOREIGN KEY (personal_id) REFERENCES personal(id) ON DELETE SET NULL
);

-- ======================================================
-- TABLA COMISIONES
-- ======================================================
CREATE TABLE IF NOT EXISTS comisiones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_venta_tratamiento BIGINT NOT NULL,
    id_personal BIGINT NOT NULL,
    fecha DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_personal) REFERENCES personal(id),
    FOREIGN KEY (id_venta_tratamiento) REFERENCES ventas_tratamientos(id)
);

-- ======================================================
-- TABLA CAJA (LEGACY)
-- ======================================================
CREATE TABLE IF NOT EXISTS caja (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL COMMENT 'EGRESO O INGRESO',
    detalle VARCHAR(255),
    cantidad BIGINT NOT NULL,
    forma_de_pago VARCHAR(255),
    ciudadania VARCHAR(255),
    importe BIGINT NOT NULL,
    fecha DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================================================
-- TABLA CAJA APERTURAS Y CIERRES
-- ======================================================
CREATE TABLE IF NOT EXISTS caja_aperturas_cierres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  monto_apertura DECIMAL(10,2) NOT NULL,
  monto_cierre DECIMAL(10,2) NOT NULL,
  UNIQUE (fecha)
);

-- ======================================================
-- TABLA EGRESOS
-- ======================================================
CREATE TABLE IF NOT EXISTS egresos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  detalle VARCHAR(255) NOT NULL,
  forma_pago VARCHAR(100) NOT NULL,
  importe DECIMAL(12, 2) NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================
-- TABLA INGRESOS
-- ======================================================
CREATE TABLE IF NOT EXISTS ingresos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  detalle VARCHAR(255) NOT NULL,
  forma_pago VARCHAR(100) NOT NULL,
  importe DECIMAL(12, 2) NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================
-- DATOS INICIALES
-- ======================================================

-- Insertar usuario administrador con contraseña hasheada
INSERT IGNORE INTO users (username, password, permisos) VALUES 
('admin@nhestetica.com', '$2a$10$X2id.dbJc7iGGLUsMvfy2.N11zVDgM4NEqcCy8O6eMP5pM4yZunhe', 1);

-- ======================================================
-- MOSTRAR TABLAS CREADAS
-- ======================================================
SHOW TABLES; 