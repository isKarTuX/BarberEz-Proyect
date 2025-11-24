import pool from '../config/database.js';

class CitaService {
    // Obtener citas de un cliente
    static async getCitasCliente(idCliente, estado = null) {
        try {
            let query = `
                SELECT 
                    c.idCita,
                    c.fecha,
                    c.horaIn,
                    c.estado,
                    u.nombre as nombreBarbero,
                    GROUP_CONCAT(s.nombre SEPARATOR ', ') as servicios,
                    SUM(sc.total) as total
                FROM cita c
                INNER JOIN barbero b ON c.idBarbero = b.idBarbero
                INNER JOIN usuario u ON b.idBarbero = u.idUsuario
                LEFT JOIN servicioCita sc ON c.idCita = sc.idCita
                LEFT JOIN servicio s ON sc.idSer = s.idSer
                WHERE c.idCliente = ?
            `;

            const params = [idCliente];

            if (estado) {
                query += ' AND c.estado = ?';
                params.push(estado);
            }

            query += ' GROUP BY c.idCita ORDER BY c.fecha DESC, c.horaIn DESC';

            const [citas] = await pool.execute(query, params);
            return citas;
        } catch (error) {
            throw error;
        }
    }

    // Obtener citas de un barbero
    static async getCitasBarbero(idBarbero, estado = null) {
        try {
            let query = `
                SELECT 
                    c.idCita,
                    c.fecha,
                    c.horaIn,
                    c.estado,
                    uc.nombre as nombreCliente,
                    uc.telefono as telefonoCliente,
                    GROUP_CONCAT(s.nombre SEPARATOR ', ') as servicios,
                    SUM(sc.total) as total
                FROM cita c
                INNER JOIN cliente cl ON c.idCliente = cl.idCliente
                INNER JOIN usuario uc ON cl.idCliente = uc.idUsuario
                LEFT JOIN servicioCita sc ON c.idCita = sc.idCita
                LEFT JOIN servicio s ON sc.idSer = s.idSer
                WHERE c.idBarbero = ?
            `;

            const params = [idBarbero];

            if (estado) {
                query += ' AND c.estado = ?';
                params.push(estado);
            }

            query += ' GROUP BY c.idCita ORDER BY c.fecha DESC, c.horaIn DESC';

            const [citas] = await pool.execute(query, params);
            return citas;
        } catch (error) {
            throw error;
        }
    }

    // Agendar nueva cita
    static async agendarCita(citaData) {
        const { fecha, horaIn, idCliente, idBarbero, servicios, metodoPago } = citaData;

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Verificar disponibilidad del barbero
            const [existente] = await connection.execute(
                `SELECT idCita FROM cita 
                 WHERE idBarbero = ? AND fecha = ? AND horaIn = ? 
                 AND estado IN ('pendiente', 'confirmada')`,
                [idBarbero, fecha, horaIn]
            );

            if (existente.length > 0) {
                throw new Error('El barbero ya tiene una cita a esa hora');
            }

            // Crear la cita
            const [resultCita] = await connection.execute(
                'INSERT INTO cita (fecha, horaIn, idCliente, idBarbero) VALUES (?, ?, ?, ?)',
                [fecha, horaIn, idCliente, idBarbero]
            );

            const idCita = resultCita.insertId;

            // Agregar servicios
            for (const idSer of servicios) {
                const [servicio] = await connection.execute(
                    'SELECT precio FROM servicio WHERE idSer = ? AND activo = TRUE',
                    [idSer]
                );

                if (servicio.length === 0) {
                    throw new Error(`Servicio ${idSer} no encontrado o inactivo`);
                }

                await connection.execute(
                    'INSERT INTO servicioCita (idCita, idSer, total) VALUES (?, ?, ?)',
                    [idCita, idSer, servicio[0].precio]
                );
            }

            // Calcular monto total
            const [montoResult] = await connection.execute(
                'SELECT SUM(total) as monto FROM servicioCita WHERE idCita = ?',
                [idCita]
            );

            const monto = montoResult[0].monto;

            // Registrar pago
            await connection.execute(
                'INSERT INTO pago (idCita, monto, metodoPago, estado) VALUES (?, ?, ?, ?)',
                [idCita, monto, metodoPago, 'pendiente']
            );

            await connection.commit();

            return { idCita, monto };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Actualizar estado de cita
    static async actualizarEstado(idCita, nuevoEstado) {
        try {
            const [result] = await pool.execute(
                'UPDATE cita SET estado = ? WHERE idCita = ?',
                [nuevoEstado, idCita]
            );

            if (result.affectedRows === 0) {
                throw new Error('Cita no encontrada');
            }

            // Si se confirma o completa, actualizar pago
            if (nuevoEstado === 'completada') {
                await pool.execute(
                    'UPDATE pago SET estado = ? WHERE idCita = ?',
                    ['pagado', idCita]
                );
            } else if (nuevoEstado === 'cancelada') {
                await pool.execute(
                    'UPDATE pago SET estado = ? WHERE idCita = ?',
                    ['cancelado', idCita]
                );
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    // Cancelar cita
    static async cancelarCita(idCita, idUsuario, rol) {
        try {
            // Verificar que la cita pertenece al usuario
            const [cita] = await pool.execute(
                'SELECT * FROM cita WHERE idCita = ?',
                [idCita]
            );

            if (cita.length === 0) {
                throw new Error('Cita no encontrada');
            }

            if (rol === 'cliente' && cita[0].idCliente !== idUsuario) {
                throw new Error('No tienes permiso para cancelar esta cita');
            }

            if (rol === 'barbero' && cita[0].idBarbero !== idUsuario) {
                throw new Error('No tienes permiso para cancelar esta cita');
            }

            return await this.actualizarEstado(idCita, 'cancelada');
        } catch (error) {
            throw error;
        }
    }

    // Obtener horarios disponibles de un barbero
    static async getHorariosDisponibles(idBarbero, fecha) {
        try {
            const [ocupados] = await pool.execute(
                `SELECT horaIn FROM cita 
                 WHERE idBarbero = ? AND fecha = ? 
                 AND estado IN ('pendiente', 'confirmada')`,
                [idBarbero, fecha]
            );

            return ocupados.map(h => h.horaIn);
        } catch (error) {
            throw error;
        }
    }
}

export default CitaService;

