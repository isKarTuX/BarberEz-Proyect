-- =============================================
-- TRIGGER PARA AUTO-CANCELAR CITAS VENCIDAS
-- =============================================
USE barberia_barberez;

-- Eliminar el evento si existe
DROP EVENT IF EXISTS auto_cancelar_citas_vencidas;

-- Crear evento que se ejecuta cada hora
DELIMITER $$
CREATE EVENT auto_cancelar_citas_vencidas
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
    -- Cancelar citas pendientes o confirmadas que ya pasaron
    UPDATE cita
    SET estado = 'cancelada'
    WHERE estado IN ('pendiente', 'confirmada')
    AND CONCAT(fecha, ' ', horaIn) < NOW()
    AND TIMESTAMPDIFF(HOUR, CONCAT(fecha, ' ', horaIn), NOW()) >= 2;
    -- Se cancelan automáticamente 2 horas después de la hora programada
END$$
DELIMITER ;

-- Verificar que el evento se creó
SHOW EVENTS WHERE Name = 'auto_cancelar_citas_vencidas';

-- Para ejecutar manualmente (opcional):
-- CALL (no aplica para eventos, pero puedes ejecutar el UPDATE directamente para probar)

-- Prueba manual:
/*
UPDATE cita
SET estado = 'cancelada'
WHERE estado IN ('pendiente', 'confirmada')
AND CONCAT(fecha, ' ', horaIn) < NOW()
AND TIMESTAMPDIFF(HOUR, CONCAT(fecha, ' ', horaIn), NOW()) >= 2;
*/

