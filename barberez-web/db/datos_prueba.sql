-- ========================================
-- DATOS DE PRUEBA
-- Sistema BarberEz
-- ========================================

USE barberia_barberez;

-- ========================================
-- USUARIOS DE PRUEBA
-- ========================================

-- Contraseñas (todas con bcrypt):
-- admin123, barbero123, cliente123

-- Administrador (ya existe en schema.sql)

-- Barberos
INSERT INTO usuarios (nombre, correo, contrasena, telefono, cedula, rol, comision, activo) VALUES
('Carlos Rodríguez', 'barbero@barberez.com', '$2a$10$xQJ.z4YfZ8qLOzR8x5Bk3u0y7hYVZ5M7.xC4K6a2hT8wF0p1G2E3m', '3101234567', '1000000001', 'barbero', 40.00, TRUE),
('Miguel Ángel Torres', 'miguel@barberez.com', '$2a$10$xQJ.z4YfZ8qLOzR8x5Bk3u0y7hYVZ5M7.xC4K6a2hT8wF0p1G2E3m', '3102234567', '1000000002', 'barbero', 35.00, TRUE),
('Juan Pérez', 'juan@barberez.com', '$2a$10$xQJ.z4YfZ8qLOzR8x5Bk3u0y7hYVZ5M7.xC4K6a2hT8wF0p1G2E3m', '3103234567', '1000000003', 'barbero', 38.00, TRUE)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Clientes
INSERT INTO usuarios (nombre, correo, contrasena, telefono, cedula, rol, activo) VALUES
('Cliente Demo', 'cliente@barberez.com', '$2a$10$xQJ.z4YfZ8qLOzR8x5Bk3u0y7hYVZ5M7.xC4K6a2hT8wF0p1G2E3m', '3201234567', '1000000004', 'cliente', TRUE),
('Pedro Gómez', 'pedro@email.com', '$2a$10$xQJ.z4YfZ8qLOzR8x5Bk3u0y7hYVZ5M7.xC4K6a2hT8wF0p1G2E3m', '3202234567', '1000000005', 'cliente', TRUE),
('Luis Martínez', 'luis@email.com', '$2a$10$xQJ.z4YfZ8qLOzR8x5Bk3u0y7hYVZ5M7.xC4K6a2hT8wF0p1G2E3m', '3203234567', '1000000006', 'cliente', TRUE),
('Ana García', 'ana@email.com', '$2a$10$xQJ.z4YfZ8qLOzR8x5Bk3u0y7hYVZ5M7.xC4K6a2hT8wF0p1G2E3m', '3204234567', '1000000007', 'cliente', TRUE),
('Sofia López', 'sofia@email.com', '$2a$10$xQJ.z4YfZ8qLOzR8x5Bk3u0y7hYVZ5M7.xC4K6a2hT8wF0p1G2E3m', '3205234567', '1000000008', 'cliente', TRUE)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- ========================================
-- SERVICIOS
-- ========================================

INSERT INTO servicios (nombre, descripcion, duracion, precio, activo) VALUES
('Corte Clásico', 'Corte de cabello tradicional con tijera y máquina', 30, 25000, TRUE),
('Corte + Barba', 'Corte de cabello más arreglo de barba completo', 45, 40000, TRUE),
('Barba Completa', 'Perfilado, recorte y afeitado de barba', 20, 20000, TRUE),
('Corte Infantil', 'Corte de cabello para niños', 25, 18000, TRUE),
('Diseño en Cabello', 'Diseños personalizados con máquina', 40, 35000, TRUE),
('Afeitado Clásico', 'Afeitado tradicional con navaja', 30, 30000, TRUE),
('Tinte de Cabello', 'Aplicación de tinte profesional', 60, 50000, TRUE),
('Tratamiento Capilar', 'Tratamiento revitalizante para el cabello', 45, 45000, TRUE)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- ========================================
-- HORARIOS DE BARBEROS (Lunes a Sábado)
-- ========================================

-- Carlos Rodríguez (barbero_id = 2)
INSERT INTO horarios_barbero (barbero_id, dia_semana, hora_inicio, hora_fin, activo) VALUES
(2, 1, '09:00:00', '18:00:00', TRUE), -- Lunes
(2, 2, '09:00:00', '18:00:00', TRUE), -- Martes
(2, 3, '09:00:00', '18:00:00', TRUE), -- Miércoles
(2, 4, '09:00:00', '18:00:00', TRUE), -- Jueves
(2, 5, '09:00:00', '18:00:00', TRUE), -- Viernes
(2, 6, '09:00:00', '15:00:00', TRUE)  -- Sábado
ON DUPLICATE KEY UPDATE hora_inicio=hora_inicio;

-- Miguel Ángel Torres (barbero_id = 3)
INSERT INTO horarios_barbero (barbero_id, dia_semana, hora_inicio, hora_fin, activo) VALUES
(3, 1, '10:00:00', '19:00:00', TRUE),
(3, 2, '10:00:00', '19:00:00', TRUE),
(3, 3, '10:00:00', '19:00:00', TRUE),
(3, 4, '10:00:00', '19:00:00', TRUE),
(3, 5, '10:00:00', '19:00:00', TRUE),
(3, 6, '10:00:00', '16:00:00', TRUE)
ON DUPLICATE KEY UPDATE hora_inicio=hora_inicio;

-- Juan Pérez (barbero_id = 4)
INSERT INTO horarios_barbero (barbero_id, dia_semana, hora_inicio, hora_fin, activo) VALUES
(4, 1, '08:00:00', '17:00:00', TRUE),
(4, 2, '08:00:00', '17:00:00', TRUE),
(4, 3, '08:00:00', '17:00:00', TRUE),
(4, 4, '08:00:00', '17:00:00', TRUE),
(4, 5, '08:00:00', '17:00:00', TRUE),
(4, 6, '08:00:00', '14:00:00', TRUE)
ON DUPLICATE KEY UPDATE hora_inicio=hora_inicio;

-- ========================================
-- CITAS DE EJEMPLO
-- ========================================

-- Obtener fecha actual y próximos días
SET @hoy = CURDATE();
SET @manana = DATE_ADD(CURDATE(), INTERVAL 1 DAY);
SET @pasado_manana = DATE_ADD(CURDATE(), INTERVAL 2 DAY);

-- Citas para hoy
INSERT INTO citas (cliente_id, barbero_id, fecha, hora_inicio, hora_fin, estado, total, notas) VALUES
(5, 2, @hoy, '10:00:00', '10:30:00', 'confirmada', 25000, 'Cliente regular'),
(6, 2, @hoy, '11:00:00', '11:45:00', 'confirmada', 40000, 'Primera vez'),
(7, 3, @hoy, '14:00:00', '14:20:00', 'pendiente', 20000, NULL),
(8, 3, @hoy, '15:00:00', '15:45:00', 'confirmada', 40000, 'Quiere diseño especial');

-- Citas para mañana
INSERT INTO citas (cliente_id, barbero_id, fecha, hora_inicio, hora_fin, estado, total, notas) VALUES
(5, 4, @manana, '09:00:00', '09:30:00', 'pendiente', 25000, NULL),
(6, 2, @manana, '10:00:00', '10:45:00', 'pendiente', 40000, NULL),
(7, 3, @manana, '11:00:00', '11:30:00', 'confirmada', 30000, NULL),
(8, 4, @manana, '14:00:00', '14:25:00', 'pendiente', 18000, 'Corte infantil para hijo');

-- Citas para pasado mañana
INSERT INTO citas (cliente_id, barbero_id, fecha, hora_inicio, hora_fin, estado, total, notas) VALUES
(5, 2, @pasado_manana, '10:00:00', '10:30:00', 'pendiente', 25000, NULL),
(9, 3, @pasado_manana, '15:00:00', '15:40:00', 'pendiente', 35000, 'Quiere diseño');

-- Citas completadas (días anteriores)
INSERT INTO citas (cliente_id, barbero_id, fecha, hora_inicio, hora_fin, estado, total, notas) VALUES
(5, 2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '10:00:00', '10:30:00', 'completada', 25000, 'Muy satisfecho'),
(6, 3, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '11:00:00', '11:45:00', 'completada', 40000, NULL),
(7, 4, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '14:00:00', '14:20:00', 'completada', 20000, NULL),
(8, 2, DATE_SUB(CURDATE(), INTERVAL 7 DAY), '15:00:00', '15:30:00', 'completada', 25000, NULL);

-- Citas canceladas
INSERT INTO citas (cliente_id, barbero_id, fecha, hora_inicio, hora_fin, estado, total, notas) VALUES
(5, 3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '10:00:00', '10:30:00', 'cancelada', 25000, 'Cliente canceló por enfermedad');

-- ========================================
-- SERVICIOS DE LAS CITAS
-- ========================================

-- Asociar servicios a citas (usando los IDs de las citas recién creadas)
-- Cita 1: Corte Clásico
INSERT INTO cita_servicios (cita_id, servicio_id, precio)
SELECT c.id, 1, 25000
FROM citas c
WHERE c.cliente_id = 5 AND c.fecha = @hoy AND c.hora_inicio = '10:00:00'
LIMIT 1;

-- Cita 2: Corte + Barba
INSERT INTO cita_servicios (cita_id, servicio_id, precio)
SELECT c.id, 2, 40000
FROM citas c
WHERE c.cliente_id = 6 AND c.fecha = @hoy AND c.hora_inicio = '11:00:00'
LIMIT 1;

-- Cita 3: Barba Completa
INSERT INTO cita_servicios (cita_id, servicio_id, precio)
SELECT c.id, 3, 20000
FROM citas c
WHERE c.cliente_id = 7 AND c.fecha = @hoy AND c.hora_inicio = '14:00:00'
LIMIT 1;

-- Cita 4: Corte + Barba
INSERT INTO cita_servicios (cita_id, servicio_id, precio)
SELECT c.id, 2, 40000
FROM citas c
WHERE c.cliente_id = 8 AND c.fecha = @hoy AND c.hora_inicio = '15:00:00'
LIMIT 1;

-- ========================================
-- NOTIFICACIONES DE EJEMPLO
-- ========================================

INSERT INTO notificaciones (usuario_id, tipo, mensaje, leida) VALUES
(2, 'nueva_cita', 'Tienes una nueva cita para hoy a las 10:00', FALSE),
(2, 'nueva_cita', 'Tienes una nueva cita para hoy a las 11:00', FALSE),
(5, 'cita_confirmada', 'Tu cita ha sido confirmada para hoy a las 10:00', TRUE),
(6, 'cita_confirmada', 'Tu cita ha sido confirmada para hoy a las 11:00', FALSE);

-- ========================================
-- FIN DEL SCRIPT
-- ========================================

SELECT '✅ Datos de prueba insertados exitosamente' AS status;
SELECT 'Usuarios creados - Contraseña para todos: admin123, barbero123, cliente123' AS info;

