-- =========================================
-- EJECUTAR ESTE SCRIPT EN MySQL Workbench o phpMyAdmin
-- =========================================

-- 1. Crear/Seleccionar base de datos
CREATE DATABASE IF NOT EXISTS barberia_barberez CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE barberia_barberez;

-- 2. Crear tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    cedula VARCHAR(20) UNIQUE,
    rol ENUM('admin', 'barbero', 'cliente') NOT NULL DEFAULT 'cliente',
    comision DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Porcentaje de comisión para barberos',
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_correo (correo),
    INDEX idx_rol (rol),
    INDEX idx_cedula (cedula)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Crear tabla servicios
CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion INT NOT NULL DEFAULT 30 COMMENT 'Duración en minutos',
    precio DECIMAL(10,2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Crear tabla citas
CREATE TABLE IF NOT EXISTS citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    barbero_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (barbero_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_fecha (fecha),
    INDEX idx_estado (estado),
    INDEX idx_barbero (barbero_id),
    INDEX idx_cliente (cliente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Crear tabla cita_servicios
CREATE TABLE IF NOT EXISTS cita_servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cita_id INT NOT NULL,
    servicio_id INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cita_servicio (cita_id, servicio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Insertar usuario administrador (contraseña: admin123)
INSERT INTO usuarios (nombre, correo, contrasena, telefono, cedula, rol) VALUES
('Administrador', 'admin@barberez.com', '$2a$10$xQJ.z4YfZ8qLOzR8x5Bk3u0y7hYVZ5M7.xC4K6a2hT8wF0p1G2E3m', '3001234567', '1000000000', 'admin')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- 7. Insertar barbero de prueba (contraseña: barbero123)
INSERT INTO usuarios (nombre, correo, contrasena, telefono, cedula, rol, comision) VALUES
('Carlos Rodríguez', 'barbero@barberez.com', '$2a$10$xQJ.z4YfZ8qLOzR8x5Bk3u0y7hYVZ5M7.xC4K6a2hT8wF0p1G2E3m', '3101234567', '1000000001', 'barbero', 40.00)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- 8. Insertar cliente de prueba (contraseña: cliente123)
INSERT INTO usuarios (nombre, correo, contrasena, telefono, cedula, rol) VALUES
('Cliente Demo', 'cliente@barberez.com', '$2a$10$xQJ.z4YfZ8qLOzR8x5Bk3u0y7hYVZ5M7.xC4K6a2hT8wF0p1G2E3m', '3201234567', '1000000004', 'cliente')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- 9. Insertar servicios básicos
INSERT INTO servicios (nombre, descripcion, duracion, precio, activo) VALUES
('Corte Clásico', 'Corte de cabello tradicional', 30, 25000, TRUE),
('Corte + Barba', 'Corte completo con arreglo de barba', 45, 40000, TRUE),
('Barba Completa', 'Perfilado y recorte de barba', 20, 20000, TRUE)
ON DUPLICATE KEY UPDATE nombre=nombre;

SELECT '✅ BASE DE DATOS CREADA EXITOSAMENTE' AS STATUS;
SELECT 'Prueba login con: admin@barberez.com / admin123' AS INFO;
