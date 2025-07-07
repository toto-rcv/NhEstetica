-- ======================================================
-- MIGRACION 002 - TABLA DE TURNOS
-- ======================================================
-- Fecha: 2024-12-30
-- Descripcion: Crear tabla de turnos para el sistema de reservas

USE nhestetica_db;

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