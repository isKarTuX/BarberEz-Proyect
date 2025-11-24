-- ========================================
-- SCHEMA COMPLETO DE BASE DE DATOS
-- Sistema BarberEz
-- ========================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS barberia_barberez CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE barberia_barberez;

-- ========================================
-- TABLA: usuarios
-- ========================================
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

-- ========================================
-- TABLA: servicios
-- ========================================
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

-- ========================================
-- TABLA: citas
-- ========================================
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
    INDEX idx_cliente (cliente_id),
    INDEX idx_fecha_barbero (fecha, barbero_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: cita_servicios (relación muchos a muchos)
-- ========================================
CREATE TABLE IF NOT EXISTS cita_servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cita_id INT NOT NULL,
    servicio_id INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL COMMENT 'Precio del servicio al momento de la cita',
    FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cita_servicio (cita_id, servicio_id),
    INDEX idx_cita (cita_id),
    INDEX idx_servicio (servicio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: horarios_barbero
-- ========================================
CREATE TABLE IF NOT EXISTS horarios_barbero (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barbero_id INT NOT NULL,
    dia_semana TINYINT NOT NULL COMMENT '0=Domingo, 1=Lunes, ..., 6=Sábado',
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (barbero_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_barbero_dia (barbero_id, dia_semana)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: notificaciones
-- ========================================
CREATE TABLE IF NOT EXISTS notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_leida (usuario_id, leida),
    INDEX idx_fecha (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- EVENTO: Auto-cancelar citas antiguas pendientes
-- ========================================
DELIMITER $$

CREATE EVENT IF NOT EXISTS auto_cancelar_citas_antiguas
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    UPDATE citas
    SET estado = 'cancelada',
        notas = CONCAT(COALESCE(notas, ''), '\n[Auto-cancelada por sistema - cita expirada]')
    WHERE estado = 'pendiente'
    AND CONCAT(fecha, ' ', hora_inicio) < DATE_SUB(NOW(), INTERVAL 2 HOUR);
END$$

DELIMITER ;

-- Asegurar que el event scheduler esté activo
SET GLOBAL event_scheduler = ON;

-- ========================================
-- INSERTAR DATOS INICIALES
-- ========================================

-- Insertar usuario administrador por defecto
-- Contraseña: admin123 (hasheada con bcrypt)
INSERT INTO usuarios (nombre, correo, contrasena, telefono, cedula, rol) VALUES
('Administrador', 'admin@barberez.com', '$2a$10$xQJ.z4YfZ8qLOzR8x5Bk3u0y7hYVZ5M7.xC4K6a2hT8wF0p1G2E3m', '3001234567', '1000000000', 'admin')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- ========================================
-- VISTAS ÚTILES
-- ========================================

-- Vista de citas con información completa
CREATE OR REPLACE VIEW vista_citas_completas AS
SELECT
    c.id AS id_cita,
    c.fecha,
    c.hora_inicio,
    c.hora_fin,
    c.estado,
    c.total,
    c.notas,
    c.fecha_creacion,
    cl.id AS cliente_id,
    cl.nombre AS nombre_cliente,
    cl.correo AS correo_cliente,
    cl.telefono AS telefono_cliente,
    b.id AS barbero_id,
    b.nombre AS nombre_barbero,
    b.comision AS comision_barbero,
    GROUP_CONCAT(s.nombre SEPARATOR ', ') AS servicios,
    GROUP_CONCAT(s.id) AS servicios_ids
FROM citas c
INNER JOIN usuarios cl ON c.cliente_id = cl.id
INNER JOIN usuarios b ON c.barbero_id = b.id
LEFT JOIN cita_servicios cs ON c.id = cs.cita_id
LEFT JOIN servicios s ON cs.servicio_id = s.id
GROUP BY c.id, c.fecha, c.hora_inicio, c.hora_fin, c.estado, c.total, c.notas, c.fecha_creacion,
         cl.id, cl.nombre, cl.correo, cl.telefono, b.id, b.nombre, b.comision;

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger para actualizar el total de la cita al agregar servicios
DELIMITER $$

CREATE TRIGGER IF NOT EXISTS after_cita_servicio_insert
AFTER INSERT ON cita_servicios
FOR EACH ROW
BEGIN
    UPDATE citas
    SET total = (
        SELECT SUM(precio)
        FROM cita_servicios
        WHERE cita_id = NEW.cita_id
    )
    WHERE id = NEW.cita_id;
END$$

CREATE TRIGGER IF NOT EXISTS after_cita_servicio_delete
AFTER DELETE ON cita_servicios
FOR EACH ROW
BEGIN
    UPDATE citas
    SET total = COALESCE((
        SELECT SUM(precio)
        FROM cita_servicios
        WHERE cita_id = OLD.cita_id
    ), 0)
    WHERE id = OLD.cita_id;
END$$

DELIMITER ;

-- ========================================
-- PERMISOS Y OPTIMIZACIÓN
-- ========================================

-- Optimizar tablas
OPTIMIZE TABLE usuarios, servicios, citas, cita_servicios, horarios_barbero, notificaciones;

-- Analizar tablas para mejorar índices
ANALYZE TABLE usuarios, servicios, citas, cita_servicios, horarios_barbero, notificaciones;

-- ========================================
-- FIN DEL SCRIPT
-- ========================================

SELECT '✅ Base de datos creada exitosamente' AS status;
SELECT 'Usuario admin creado - Correo: admin@barberez.com - Contraseña: admin123' AS info;

