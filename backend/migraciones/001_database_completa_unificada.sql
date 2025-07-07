-- ======================================================
-- MIGRACIÓN UNIFICADA - BASE DE DATOS COMPLETA
-- ======================================================
-- Fecha: 2024-12-30
-- Descripción: Migración unificada que incluye toda la estructura
-- de la base de datos, incluyendo turnos y DNI de clientes

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
    dni VARCHAR(20) NULL COMMENT 'DNI del cliente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dni (dni)
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
-- TABLA TURNOS
-- ======================================================
CREATE TABLE IF NOT EXISTS turnos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id BIGINT NULL COMMENT 'ID del cliente si está registrado',
    tratamiento_id BIGINT NOT NULL COMMENT 'ID del tratamiento reservado',
    fecha DATE NOT NULL COMMENT 'Fecha del turno',
    hora TIME NOT NULL COMMENT 'Hora del turno',
    estado ENUM('pendiente', 'confirmado', 'cancelado', 'completado') DEFAULT 'pendiente' COMMENT 'Estado del turno',
    
    -- Datos del cliente para turnos sin registro
    dni_cliente VARCHAR(20) NOT NULL COMMENT 'DNI del cliente',
    nombre_cliente VARCHAR(100) NOT NULL COMMENT 'Nombre del cliente',
    apellido_cliente VARCHAR(100) NOT NULL COMMENT 'Apellido del cliente',
    email_cliente VARCHAR(100) NOT NULL COMMENT 'Email del cliente',
    telefono_cliente VARCHAR(20) NOT NULL COMMENT 'Teléfono del cliente',
    
    -- Observaciones adicionales
    observaciones TEXT NULL COMMENT 'Observaciones del turno',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
    FOREIGN KEY (tratamiento_id) REFERENCES tratamientos(id) ON DELETE CASCADE,
    
    -- Índices para optimizar consultas
    INDEX idx_fecha_hora (fecha, hora),
    INDEX idx_cliente_id (cliente_id),
    INDEX idx_tratamiento_id (tratamiento_id),
    INDEX idx_estado (estado),
    INDEX idx_dni_cliente (dni_cliente),
    
    -- Restricción única para evitar turnos duplicados en mismo horario
    UNIQUE KEY unique_fecha_hora_tratamiento (fecha, hora, tratamiento_id)
);

-- ======================================================
-- TABLA CONFIGURACION_HORARIOS
-- ======================================================
-- Tabla para configurar horarios disponibles por día de la semana
CREATE TABLE IF NOT EXISTS configuracion_horarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dia_semana TINYINT NOT NULL COMMENT '0=Domingo, 1=Lunes, ..., 6=Sábado',
    hora_inicio TIME NOT NULL COMMENT 'Hora de inicio del horario',
    hora_fin TIME NOT NULL COMMENT 'Hora de fin del horario',
    duracion_turno INT NOT NULL DEFAULT 60 COMMENT 'Duración del turno en minutos',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Si el horario está activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_dia_semana (dia_semana),
    INDEX idx_activo (activo),
    
    -- Restricción única para evitar horarios duplicados
    UNIQUE KEY unique_dia_hora (dia_semana, hora_inicio, hora_fin)
);

-- ======================================================
-- DATOS INICIALES
-- ======================================================

-- Insertar usuario administrador con contraseña hasheada
INSERT IGNORE INTO users (username, password, permisos) VALUES 
('adminNh@gmail.com', '$2a$10$X2id.dbJc7iGGLUsMvfy2.N11zVDgM4NEqcCy8O6eMP5pM4yZunhe', 1);

-- ======================================================
-- DATOS INICIALES PARA CONFIGURACIÓN DE HORARIOS
-- ======================================================
-- Horarios: Lunes a Sábados 9:00 a 19:00
INSERT IGNORE INTO configuracion_horarios (dia_semana, hora_inicio, hora_fin, duracion_turno) VALUES
-- Lunes
(1, '09:00:00', '19:00:00', 60),
-- Martes
(2, '09:00:00', '19:00:00', 60),
-- Miércoles
(3, '09:00:00', '19:00:00', 60),
-- Jueves
(4, '09:00:00', '19:00:00', 60),
-- Viernes
(5, '09:00:00', '19:00:00', 60),
-- Sábado
(6, '09:00:00', '19:00:00', 60);

-- ======================================================
-- MOSTRAR TABLAS CREADAS
-- ======================================================
SHOW TABLES; 