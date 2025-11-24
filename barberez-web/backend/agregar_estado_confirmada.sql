-- Agregar estado 'confirmada' a la tabla cita
USE barberia_barberez;

-- Modificar el ENUM para incluir 'confirmada'
ALTER TABLE cita
MODIFY COLUMN estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada')
DEFAULT 'pendiente';

-- Verificar que el cambio se aplicó correctamente
DESCRIBE cita;

-- Ver los estados disponibles
SELECT COLUMN_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'barberia_barberez'
  AND TABLE_NAME = 'cita'
  AND COLUMN_NAME = 'estado';

