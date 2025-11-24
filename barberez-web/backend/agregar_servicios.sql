-- Agregar más servicios a la barbería
USE barberia_barberez;

-- Insertar nuevos servicios
INSERT INTO servicio (nombre, duracion, precio, activo) VALUES
('Limpieza facial', 40, 30000, TRUE),
('Arreglo de cejas', 15, 8000, TRUE),
('Tinte de pelo', 60, 35000, TRUE);

-- Verificar servicios
SELECT * FROM servicio;

