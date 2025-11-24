-- ========================================
-- AGREGAR SISTEMA DE PAGOS
-- Base de datos: barberia_barberez
-- ========================================

USE barberia_barberez;

-- ========================================
-- TABLA: pagos
-- ========================================
CREATE TABLE IF NOT EXISTS pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cita_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia') NOT NULL,
    estado_pago ENUM('pendiente', 'pagado', 'reembolsado') DEFAULT 'pendiente',

    -- Campos específicos para transferencia
    referencia_transferencia VARCHAR(100) DEFAULT NULL COMMENT 'Número de referencia de la transferencia',
    banco_origen VARCHAR(100) DEFAULT NULL COMMENT 'Banco desde el cual se hizo la transferencia',

    -- Campos específicos para tarjeta
    ultimos_4_digitos VARCHAR(4) DEFAULT NULL COMMENT 'Últimos 4 dígitos de la tarjeta',
    tipo_tarjeta ENUM('debito', 'credito') DEFAULT NULL,

    -- Auditoría y control
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    procesado_por INT DEFAULT NULL COMMENT 'ID del usuario que procesó el pago (admin o barbero)',
    notas TEXT COMMENT 'Notas adicionales sobre el pago',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
    FOREIGN KEY (procesado_por) REFERENCES usuarios(id) ON DELETE SET NULL,

    INDEX idx_cita (cita_id),
    INDEX idx_metodo_pago (metodo_pago),
    INDEX idx_estado_pago (estado_pago),
    INDEX idx_fecha_pago (fecha_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TRIGGER: Actualizar estado de cita al registrar pago
-- ========================================
DELIMITER $$

DROP TRIGGER IF EXISTS after_pago_insert$$

CREATE TRIGGER after_pago_insert
AFTER INSERT ON pagos
FOR EACH ROW
BEGIN
    -- Si el pago está completado, actualizar la cita a completada
    IF NEW.estado_pago = 'pagado' THEN
        UPDATE citas
        SET estado = 'completada'
        WHERE id = NEW.cita_id
        AND estado = 'confirmada';
    END IF;
END$$

DELIMITER ;

-- ========================================
-- TRIGGER: Validar monto del pago
-- ========================================
DELIMITER $$

DROP TRIGGER IF EXISTS before_pago_insert$$

CREATE TRIGGER before_pago_insert
BEFORE INSERT ON pagos
FOR EACH ROW
BEGIN
    DECLARE total_cita DECIMAL(10,2);

    -- Obtener el total de la cita
    SELECT total INTO total_cita
    FROM citas
    WHERE id = NEW.cita_id;

    -- Validar que el monto del pago sea correcto
    IF NEW.monto != total_cita THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El monto del pago no coincide con el total de la cita';
    END IF;

    -- Validar campos según método de pago
    IF NEW.metodo_pago = 'transferencia' THEN
        IF NEW.referencia_transferencia IS NULL OR NEW.referencia_transferencia = '' THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'La referencia de transferencia es obligatoria';
        END IF;
    END IF;

    IF NEW.metodo_pago = 'tarjeta' THEN
        IF NEW.ultimos_4_digitos IS NULL OR LENGTH(NEW.ultimos_4_digitos) != 4 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Los últimos 4 dígitos de la tarjeta son obligatorios';
        END IF;
        IF NEW.tipo_tarjeta IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El tipo de tarjeta es obligatorio';
        END IF;
    END IF;
END$$

DELIMITER ;

-- ========================================
-- VISTA: Información completa de pagos
-- ========================================
CREATE OR REPLACE VIEW vista_pagos_completos AS
SELECT
    p.id AS id_pago,
    p.cita_id,
    p.monto,
    p.metodo_pago,
    p.estado_pago,
    p.referencia_transferencia,
    p.banco_origen,
    p.ultimos_4_digitos,
    p.tipo_tarjeta,
    p.fecha_pago,
    p.notas AS notas_pago,
    c.fecha AS fecha_cita,
    c.hora_inicio,
    c.estado AS estado_cita,
    c.total AS total_cita,
    cl.nombre AS nombre_cliente,
    cl.correo AS correo_cliente,
    b.nombre AS nombre_barbero,
    b.comision AS comision_barbero,
    u.nombre AS procesado_por_nombre,
    GROUP_CONCAT(s.nombre SEPARATOR ', ') AS servicios
FROM pagos p
INNER JOIN citas c ON p.cita_id = c.id
INNER JOIN usuarios cl ON c.cliente_id = cl.id
INNER JOIN usuarios b ON c.barbero_id = b.id
LEFT JOIN usuarios u ON p.procesado_por = u.id
LEFT JOIN cita_servicios cs ON c.id = cs.cita_id
LEFT JOIN servicios s ON cs.servicio_id = s.id
GROUP BY p.id, p.cita_id, p.monto, p.metodo_pago, p.estado_pago,
         p.referencia_transferencia, p.banco_origen, p.ultimos_4_digitos,
         p.tipo_tarjeta, p.fecha_pago, p.notas, c.fecha, c.hora_inicio,
         c.estado, c.total, cl.nombre, cl.correo, b.nombre, b.comision, u.nombre;

-- ========================================
-- PROCEDIMIENTO: Registrar pago completo
-- ========================================
DELIMITER $$

DROP PROCEDURE IF EXISTS registrar_pago$$

CREATE PROCEDURE registrar_pago(
    IN p_cita_id INT,
    IN p_metodo_pago VARCHAR(20),
    IN p_referencia_transferencia VARCHAR(100),
    IN p_banco_origen VARCHAR(100),
    IN p_ultimos_4_digitos VARCHAR(4),
    IN p_tipo_tarjeta VARCHAR(10),
    IN p_procesado_por INT,
    IN p_notas TEXT,
    OUT p_mensaje VARCHAR(255),
    OUT p_pago_id INT
)
BEGIN
    DECLARE v_total_cita DECIMAL(10,2);
    DECLARE v_estado_cita VARCHAR(20);
    DECLARE v_pago_existente INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_mensaje = 'Error al procesar el pago';
        SET p_pago_id = NULL;
    END;

    START TRANSACTION;

    -- Verificar que la cita existe y obtener su información
    SELECT total, estado INTO v_total_cita, v_estado_cita
    FROM citas
    WHERE id = p_cita_id;

    IF v_total_cita IS NULL THEN
        SET p_mensaje = 'La cita no existe';
        SET p_pago_id = NULL;
        ROLLBACK;
    ELSE
        -- Verificar si ya existe un pago para esta cita
        SELECT id INTO v_pago_existente
        FROM pagos
        WHERE cita_id = p_cita_id
        AND estado_pago = 'pagado'
        LIMIT 1;

        IF v_pago_existente IS NOT NULL THEN
            SET p_mensaje = 'Esta cita ya tiene un pago registrado';
            SET p_pago_id = v_pago_existente;
            ROLLBACK;
        ELSE
            -- Insertar el pago
            INSERT INTO pagos (
                cita_id,
                monto,
                metodo_pago,
                estado_pago,
                referencia_transferencia,
                banco_origen,
                ultimos_4_digitos,
                tipo_tarjeta,
                procesado_por,
                notas
            ) VALUES (
                p_cita_id,
                v_total_cita,
                p_metodo_pago,
                'pagado',
                p_referencia_transferencia,
                p_banco_origen,
                p_ultimos_4_digitos,
                p_tipo_tarjeta,
                p_procesado_por,
                p_notas
            );

            SET p_pago_id = LAST_INSERT_ID();
            SET p_mensaje = 'Pago registrado exitosamente';

            COMMIT;
        END IF;
    END IF;
END$$

DELIMITER ;

-- ========================================
-- CONSULTAS ÚTILES PARA REPORTES
-- ========================================

-- Total de pagos por método
-- SELECT metodo_pago, COUNT(*) as cantidad, SUM(monto) as total
-- FROM pagos
-- WHERE estado_pago = 'pagado'
-- GROUP BY metodo_pago;

-- Pagos del día
-- SELECT * FROM vista_pagos_completos
-- WHERE DATE(fecha_pago) = CURDATE();

-- Pagos pendientes de confirmación (transferencias)
-- SELECT * FROM vista_pagos_completos
-- WHERE metodo_pago = 'transferencia'
-- AND estado_pago = 'pendiente';

DELIMITER ;

-- ========================================
-- MENSAJE DE ÉXITO
-- ========================================
SELECT 'Sistema de pagos creado exitosamente. Ahora soporta: efectivo, tarjeta y transferencia' AS mensaje;

