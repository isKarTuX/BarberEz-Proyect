import pool from '../config/database.js';

class BarberoService {
    // Obtener todos los barberos
    static async getAllBarberos() {
        try {
            const [barberos] = await pool.execute(`
                SELECT 
                    u.idUsuario as idBarbero,
                    u.nombre,
                    u.correo,
                    u.telefono,
                    u.cedula,
                    b.comision
                FROM usuario u
                INNER JOIN barbero b ON u.idUsuario = b.idBarbero
                WHERE u.rol = 'barbero'
                ORDER BY u.nombre
            `);
            return barberos;
        } catch (error) {
            throw error;
        }
    }

    // Obtener ingresos de un barbero
    static async getIngresos(idBarbero, fechaInicio = null, fechaFin = null) {
        try {
            let query = `
                SELECT 
                    c.fecha,
                    c.idCita,
                    uc.nombre as nombreCliente,
                    GROUP_CONCAT(s.nombre SEPARATOR ', ') as servicios,
                    SUM(sc.total) as total,
                    p.estado as estadoPago,
                    b.comision
                FROM cita c
                INNER JOIN cliente cl ON c.idCliente = cl.idCliente
                INNER JOIN usuario uc ON cl.idCliente = uc.idUsuario
                INNER JOIN barbero b ON c.idBarbero = b.idBarbero
                LEFT JOIN servicioCita sc ON c.idCita = sc.idCita
                LEFT JOIN servicio s ON sc.idSer = s.idSer
                LEFT JOIN pago p ON c.idCita = p.idCita
                WHERE c.idBarbero = ? AND c.estado = 'completada'
            `;

            const params = [idBarbero];

            if (fechaInicio && fechaFin) {
                query += ' AND c.fecha BETWEEN ? AND ?';
                params.push(fechaInicio, fechaFin);
            }

            query += ' GROUP BY c.idCita ORDER BY c.fecha DESC';

            const [ingresos] = await pool.execute(query, params);
            return ingresos;
        } catch (error) {
            throw error;
        }
    }
}

export default BarberoService;

