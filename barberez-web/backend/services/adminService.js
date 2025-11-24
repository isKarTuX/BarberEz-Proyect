import pool from '../config/database.js';

class AdminService {
    // Obtener ingresos totales
    static async getIngresosTotales(fechaInicio = null, fechaFin = null) {
        try {
            let query = `
                SELECT 
                    SUM(p.monto) as ingresoTotal,
                    COUNT(c.idCita) as totalCitas
                FROM pago p
                INNER JOIN cita c ON p.idCita = c.idCita
                WHERE p.estado = 'pagado' AND c.estado = 'completada'
            `;

            const params = [];

            if (fechaInicio && fechaFin) {
                query += ' AND c.fecha BETWEEN ? AND ?';
                params.push(fechaInicio, fechaFin);
            }

            const [result] = await pool.execute(query, params);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    // Obtener ingresos por barbero
    static async getIngresosPorBarbero(fechaInicio = null, fechaFin = null) {
        try {
            let query = `
                SELECT 
                    u.nombre as nombreBarbero,
                    b.comision,
                    COUNT(c.idCita) as totalCitas,
                    SUM(p.monto) as ingresoTotal,
                    SUM(p.monto * b.comision / 100) as comisionTotal
                FROM cita c
                INNER JOIN barbero b ON c.idBarbero = b.idBarbero
                INNER JOIN usuario u ON b.idBarbero = u.idUsuario
                INNER JOIN pago p ON c.idCita = p.idCita
                WHERE c.estado = 'completada' AND p.estado = 'pagado'
            `;

            const params = [];

            if (fechaInicio && fechaFin) {
                query += ' AND c.fecha BETWEEN ? AND ?';
                params.push(fechaInicio, fechaFin);
            }

            query += ' GROUP BY b.idBarbero ORDER BY ingresoTotal DESC';

            const [ingresos] = await pool.execute(query, params);
            return ingresos;
        } catch (error) {
            throw error;
        }
    }

    // Obtener todas las citas (Admin)
    static async getAllCitas(estado = null) {
        try {
            let query = `
                SELECT 
                    c.idCita,
                    c.fecha,
                    c.horaIn,
                    c.estado,
                    uc.nombre as nombreCliente,
                    uc.cedula as cedulaCliente,
                    uc.telefono as telefonoCliente,
                    ub.nombre as nombreBarbero,
                    ub.cedula as cedulaBarbero,
                    GROUP_CONCAT(s.nombre SEPARATOR ', ') as servicios,
                    SUM(sc.total) as total,
                    p.metodoPago,
                    p.estado as estadoPago
                FROM cita c
                INNER JOIN cliente cl ON c.idCliente = cl.idCliente
                INNER JOIN usuario uc ON cl.idCliente = uc.idUsuario
                INNER JOIN barbero b ON c.idBarbero = b.idBarbero
                INNER JOIN usuario ub ON b.idBarbero = ub.idUsuario
                LEFT JOIN servicioCita sc ON c.idCita = sc.idCita
                LEFT JOIN servicio s ON sc.idSer = s.idSer
                LEFT JOIN pago p ON c.idCita = p.idCita
            `;

            const params = [];

            if (estado) {
                query += ' WHERE c.estado = ?';
                params.push(estado);
            }

            query += ' GROUP BY c.idCita ORDER BY c.fecha DESC, c.horaIn DESC';

            const [citas] = await pool.execute(query, params);
            return citas;
        } catch (error) {
            throw error;
        }
    }

    // Búsqueda avanzada de citas con múltiples filtros
    static async buscarCitas(filtros) {
        try {
            let query = `
                SELECT 
                    c.idCita,
                    c.fecha,
                    c.horaIn,
                    c.estado,
                    uc.nombre as nombreCliente,
                    uc.cedula as cedulaCliente,
                    uc.correo as correoCliente,
                    uc.telefono as telefonoCliente,
                    ub.nombre as nombreBarbero,
                    ub.cedula as cedulaBarbero,
                    c.idBarbero,
                    c.idCliente,
                    GROUP_CONCAT(DISTINCT s.nombre SEPARATOR ', ') as servicios,
                    SUM(sc.total) as total,
                    p.metodoPago,
                    p.estado as estadoPago
                FROM cita c
                INNER JOIN cliente cl ON c.idCliente = cl.idCliente
                INNER JOIN usuario uc ON cl.idCliente = uc.idUsuario
                INNER JOIN barbero b ON c.idBarbero = b.idBarbero
                INNER JOIN usuario ub ON b.idBarbero = ub.idUsuario
                LEFT JOIN servicioCita sc ON c.idCita = sc.idCita
                LEFT JOIN servicio s ON sc.idSer = s.idSer
                LEFT JOIN pago p ON c.idCita = p.idCita
                WHERE 1=1
            `;

            const params = [];

            // Filtro por búsqueda de texto (nombre cliente, barbero o cédula)
            if (filtros.busqueda) {
                query += ` AND (
                    uc.nombre LIKE ? OR 
                    uc.cedula LIKE ? OR 
                    ub.nombre LIKE ? OR
                    ub.cedula LIKE ? OR
                    uc.correo LIKE ?
                )`;
                const searchTerm = `%${filtros.busqueda}%`;
                params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
            }

            // Filtro por estado de cita
            if (filtros.estado) {
                query += ' AND c.estado = ?';
                params.push(filtros.estado);
            }

            // Filtro por barbero específico
            if (filtros.idBarbero) {
                query += ' AND c.idBarbero = ?';
                params.push(filtros.idBarbero);
            }

            // Filtro por fecha específica
            if (filtros.fecha) {
                query += ' AND DATE(c.fecha) = ?';
                params.push(filtros.fecha);
            }

            // Filtro por rango de fechas
            if (filtros.fechaInicio && filtros.fechaFin) {
                query += ' AND DATE(c.fecha) BETWEEN ? AND ?';
                params.push(filtros.fechaInicio, filtros.fechaFin);
            } else if (filtros.fechaInicio) {
                query += ' AND DATE(c.fecha) >= ?';
                params.push(filtros.fechaInicio);
            } else if (filtros.fechaFin) {
                query += ' AND DATE(c.fecha) <= ?';
                params.push(filtros.fechaFin);
            }

            // Filtro por mes y año
            if (filtros.mes && filtros.ano) {
                query += ' AND MONTH(c.fecha) = ? AND YEAR(c.fecha) = ?';
                params.push(filtros.mes, filtros.ano);
            }

            // Filtro por método de pago
            if (filtros.metodoPago) {
                query += ' AND p.metodoPago = ?';
                params.push(filtros.metodoPago);
            }

            query += ' GROUP BY c.idCita ORDER BY c.fecha DESC, c.horaIn DESC';

            // Límite de resultados para performance
            if (filtros.limite) {
                query += ' LIMIT ?';
                params.push(parseInt(filtros.limite));
            }

            const [citas] = await pool.execute(query, params);

            return {
                citas,
                totalResultados: citas.length,
                filtrosAplicados: filtros
            };
        } catch (error) {
            throw error;
        }
    }

    // Obtener estadísticas de citas por filtros
    static async getEstadisticasCitas(filtros = {}) {
        try {
            let query = `
                SELECT 
                    COUNT(*) as totalCitas,
                    COUNT(CASE WHEN c.estado = 'pendiente' THEN 1 END) as pendientes,
                    COUNT(CASE WHEN c.estado = 'confirmada' THEN 1 END) as confirmadas,
                    COUNT(CASE WHEN c.estado = 'completada' THEN 1 END) as completadas,
                    COUNT(CASE WHEN c.estado = 'cancelada' THEN 1 END) as canceladas,
                    SUM(CASE WHEN p.estado = 'pagado' THEN p.monto ELSE 0 END) as totalIngresos,
                    AVG(CASE WHEN c.estado = 'completada' THEN sc.total END) as promedioServicio
                FROM cita c
                LEFT JOIN servicioCita sc ON c.idCita = sc.idCita
                LEFT JOIN pago p ON c.idCita = p.idCita
                WHERE 1=1
            `;

            const params = [];

            if (filtros.fechaInicio && filtros.fechaFin) {
                query += ' AND DATE(c.fecha) BETWEEN ? AND ?';
                params.push(filtros.fechaInicio, filtros.fechaFin);
            }

            if (filtros.idBarbero) {
                query += ' AND c.idBarbero = ?';
                params.push(filtros.idBarbero);
            }

            const [stats] = await pool.execute(query, params);
            return stats[0];
        } catch (error) {
            throw error;
        }
    }

    // Obtener estadísticas generales
    static async getEstadisticas() {
        try {
            const [clientes] = await pool.execute(
                'SELECT COUNT(*) as total FROM cliente'
            );
            const [barberos] = await pool.execute(
                'SELECT COUNT(*) as total FROM barbero'
            );
            const [citasPendientes] = await pool.execute(
                "SELECT COUNT(*) as total FROM cita WHERE estado = 'pendiente'"
            );
            const [citasHoy] = await pool.execute(
                "SELECT COUNT(*) as total FROM cita WHERE fecha = CURDATE()"
            );

            return {
                totalClientes: clientes[0].total,
                totalBarberos: barberos[0].total,
                citasPendientes: citasPendientes[0].total,
                citasHoy: citasHoy[0].total
            };
        } catch (error) {
            throw error;
        }
    }

    // Obtener estadísticas de citas por cada barbero
    static async getEstadisticasPorBarbero() {
        try {
            const [barberos] = await pool.execute(`
                SELECT 
                    b.idBarbero,
                    u.nombre as nombreBarbero,
                    u.telefono,
                    b.comision,
                    COUNT(c.idCita) as totalCitas,
                    COUNT(CASE WHEN c.estado = 'pendiente' THEN 1 END) as citasPendientes,
                    COUNT(CASE WHEN c.estado = 'confirmada' THEN 1 END) as citasConfirmadas,
                    COUNT(CASE WHEN c.estado = 'completada' THEN 1 END) as citasCompletadas,
                    COUNT(CASE WHEN c.estado = 'cancelada' THEN 1 END) as citasCanceladas,
                    SUM(CASE WHEN c.estado = 'completada' AND p.estado = 'pagado' THEN p.monto ELSE 0 END) as ingresoTotal,
                    SUM(CASE WHEN c.estado = 'completada' AND p.estado = 'pagado' THEN p.monto * b.comision / 100 ELSE 0 END) as comisionTotal
                FROM barbero b
                INNER JOIN usuario u ON b.idBarbero = u.idUsuario
                LEFT JOIN cita c ON b.idBarbero = c.idBarbero
                LEFT JOIN pago p ON c.idCita = p.idCita
                GROUP BY b.idBarbero
                ORDER BY totalCitas DESC
            `);

            return barberos;
        } catch (error) {
            throw error;
        }
    }

    // ==================== GESTIÓN DE CLIENTES ====================

    // Obtener todos los clientes con estadísticas
    static async getAllClientes(filtros = {}) {
        try {
            let query = `
                SELECT 
                    u.idUsuario,
                    u.nombre,
                    u.correo,
                    u.telefono,
                    u.cedula,
                    u.fechaRegistro,
                    COUNT(c.idCita) as totalCitas,
                    COUNT(CASE WHEN c.estado = 'completada' THEN 1 END) as citasCompletadas,
                    COUNT(CASE WHEN c.estado = 'cancelada' THEN 1 END) as citasCanceladas,
                    COUNT(CASE WHEN c.estado = 'pendiente' THEN 1 END) as citasPendientes,
                    SUM(CASE WHEN c.estado = 'completada' AND p.estado = 'pagado' THEN p.monto ELSE 0 END) as totalGastado,
                    MAX(c.fecha) as ultimaCita
                FROM usuario u
                INNER JOIN cliente cl ON u.idUsuario = cl.idCliente
                LEFT JOIN cita c ON cl.idCliente = c.idCliente
                LEFT JOIN pago p ON c.idCita = p.idCita
                WHERE 1=1
            `;

            const params = [];

            // Filtro por búsqueda
            if (filtros.busqueda) {
                query += ` AND (u.nombre LIKE ? OR u.correo LIKE ? OR u.cedula LIKE ? OR u.telefono LIKE ?)`;
                const searchTerm = `%${filtros.busqueda}%`;
                params.push(searchTerm, searchTerm, searchTerm, searchTerm);
            }

            query += ' GROUP BY u.idUsuario ORDER BY totalGastado DESC';

            const [clientes] = await pool.execute(query, params);
            return clientes;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar información de cliente
    static async updateCliente(idCliente, datos) {
        try {
            const { nombre, correo, telefono, cedula } = datos;

            await pool.execute(
                `UPDATE usuario 
                SET nombre = ?, correo = ?, telefono = ?, cedula = ?
                WHERE idUsuario = ?`,
                [nombre, correo, telefono, cedula, idCliente]
            );

            return { success: true, message: 'Cliente actualizado exitosamente' };
        } catch (error) {
            throw error;
        }
    }

    // Resetear contraseña de cliente
    static async resetPasswordCliente(idCliente, nuevaContrasena) {
        try {
            await pool.execute(
                `UPDATE usuario SET contrasena = ? WHERE idUsuario = ?`,
                [nuevaContrasena, idCliente]
            );

            return { success: true, message: 'Contraseña actualizada exitosamente' };
        } catch (error) {
            throw error;
        }
    }

    // Eliminar cliente
    static async deleteCliente(idCliente) {
        try {
            // Verificar si tiene citas
            const [citas] = await pool.execute(
                'SELECT COUNT(*) as total FROM cita WHERE idCliente = ?',
                [idCliente]
            );

            if (citas[0].total > 0) {
                throw new Error('No se puede eliminar un cliente con citas registradas');
            }

            await pool.execute(
                'DELETE FROM usuario WHERE idUsuario = ?',
                [idCliente]
            );

            return { success: true, message: 'Cliente eliminado exitosamente' };
        } catch (error) {
            throw error;
        }
    }

    // ==================== GESTIÓN DE BARBEROS ====================

    // Obtener todos los barberos con estadísticas
    static async getAllBarberosGestion(filtros = {}) {
        try {
            let query = `
                SELECT 
                    u.idUsuario,
                    u.nombre,
                    u.correo,
                    u.telefono,
                    u.cedula,
                    u.fechaRegistro,
                    b.comision,
                    COUNT(c.idCita) as totalCitas,
                    COUNT(CASE WHEN c.estado = 'completada' THEN 1 END) as citasCompletadas,
                    COUNT(CASE WHEN c.estado = 'pendiente' THEN 1 END) as citasPendientes,
                    COUNT(CASE WHEN c.estado = 'cancelada' THEN 1 END) as citasCanceladas,
                    SUM(CASE WHEN c.estado = 'completada' AND p.estado = 'pagado' THEN p.monto ELSE 0 END) as ingresoGenerado,
                    SUM(CASE WHEN c.estado = 'completada' AND p.estado = 'pagado' THEN p.monto * b.comision / 100 ELSE 0 END) as comisionTotal,
                    MAX(c.fecha) as ultimaCita
                FROM usuario u
                INNER JOIN barbero b ON u.idUsuario = b.idBarbero
                LEFT JOIN cita c ON b.idBarbero = c.idBarbero
                LEFT JOIN pago p ON c.idCita = p.idCita
                WHERE 1=1
            `;

            const params = [];

            // Filtro por búsqueda
            if (filtros.busqueda) {
                query += ` AND (u.nombre LIKE ? OR u.correo LIKE ? OR u.cedula LIKE ? OR u.telefono LIKE ?)`;
                const searchTerm = `%${filtros.busqueda}%`;
                params.push(searchTerm, searchTerm, searchTerm, searchTerm);
            }

            query += ' GROUP BY u.idUsuario ORDER BY totalCitas DESC';

            const [barberos] = await pool.execute(query, params);
            return barberos;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar información de barbero
    static async updateBarbero(idBarbero, datos) {
        try {
            const { nombre, correo, telefono, cedula, comision } = datos;

            // Actualizar usuario
            await pool.execute(
                `UPDATE usuario 
                SET nombre = ?, correo = ?, telefono = ?, cedula = ?
                WHERE idUsuario = ?`,
                [nombre, correo, telefono, cedula, idBarbero]
            );

            // Actualizar comisión
            await pool.execute(
                `UPDATE barbero SET comision = ? WHERE idBarbero = ?`,
                [comision, idBarbero]
            );

            return { success: true, message: 'Barbero actualizado exitosamente' };
        } catch (error) {
            throw error;
        }
    }

    // Resetear contraseña de barbero
    static async resetPasswordBarbero(idBarbero, nuevaContrasena) {
        try {
            await pool.execute(
                `UPDATE usuario SET contrasena = ? WHERE idUsuario = ?`,
                [nuevaContrasena, idBarbero]
            );

            return { success: true, message: 'Contraseña actualizada exitosamente' };
        } catch (error) {
            throw error;
        }
    }

    // Eliminar barbero
    static async deleteBarbero(idBarbero) {
        try {
            // Verificar si tiene citas
            const [citas] = await pool.execute(
                'SELECT COUNT(*) as total FROM cita WHERE idBarbero = ?',
                [idBarbero]
            );

            if (citas[0].total > 0) {
                throw new Error('No se puede eliminar un barbero con citas registradas');
            }

            await pool.execute(
                'DELETE FROM usuario WHERE idUsuario = ?',
                [idBarbero]
            );

            return { success: true, message: 'Barbero eliminado exitosamente' };
        } catch (error) {
            throw error;
        }
    }
}

export default AdminService;

