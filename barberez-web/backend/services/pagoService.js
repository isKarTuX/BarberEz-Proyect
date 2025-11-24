import db from '../config/database.js';

const pagoService = {
    // Registrar un nuevo pago
    registrarPago: async (datosPago) => {
        const {
            citaId,
            metodoPago,
            referenciaTransferencia,
            bancoOrigen,
            ultimos4Digitos,
            tipoTarjeta,
            procesadoPor,
            notas
        } = datosPago;

        // Validaciones básicas
        if (!citaId || !metodoPago) {
            throw new Error('Cita ID y método de pago son obligatorios');
        }

        // Validaciones específicas por método de pago
        if (metodoPago === 'transferencia') {
            if (!referenciaTransferencia || referenciaTransferencia.trim() === '') {
                throw new Error('La referencia de transferencia es obligatoria');
            }
        }

        if (metodoPago === 'tarjeta') {
            if (!ultimos4Digitos || ultimos4Digitos.length !== 4) {
                throw new Error('Los últimos 4 dígitos de la tarjeta son obligatorios y deben ser 4 dígitos');
            }
            if (!tipoTarjeta || !['debito', 'credito'].includes(tipoTarjeta)) {
                throw new Error('El tipo de tarjeta debe ser "debito" o "credito"');
            }
            // Validar que solo contenga números
            if (!/^\d{4}$/.test(ultimos4Digitos)) {
                throw new Error('Los últimos 4 dígitos deben ser numéricos');
            }
        }

        try {
            // Usar el procedimiento almacenado para registrar el pago
            const [result] = await db.query(
                `CALL registrar_pago(?, ?, ?, ?, ?, ?, ?, ?, @mensaje, @pago_id)`,
                [
                    citaId,
                    metodoPago,
                    referenciaTransferencia || null,
                    bancoOrigen || null,
                    ultimos4Digitos || null,
                    tipoTarjeta || null,
                    procesadoPor || null,
                    notas || null
                ]
            );

            // Obtener los valores de salida
            const [[output]] = await db.query('SELECT @mensaje as mensaje, @pago_id as pagoId');

            if (!output.pagoId) {
                throw new Error(output.mensaje || 'Error al registrar el pago');
            }

            return {
                success: true,
                mensaje: output.mensaje,
                pagoId: output.pagoId
            };
        } catch (error) {
            console.error('Error al registrar pago:', error);
            throw error;
        }
    },

    // Obtener todos los pagos
    obtenerTodos: async (filtros = {}) => {
        try {
            let query = 'SELECT * FROM vista_pagos_completos WHERE 1=1';
            const params = [];

            // Aplicar filtros
            if (filtros.metodoPago) {
                query += ' AND metodo_pago = ?';
                params.push(filtros.metodoPago);
            }

            if (filtros.estadoPago) {
                query += ' AND estado_pago = ?';
                params.push(filtros.estadoPago);
            }

            if (filtros.fechaInicio) {
                query += ' AND DATE(fecha_pago) >= ?';
                params.push(filtros.fechaInicio);
            }

            if (filtros.fechaFin) {
                query += ' AND DATE(fecha_pago) <= ?';
                params.push(filtros.fechaFin);
            }

            query += ' ORDER BY fecha_pago DESC';

            const [pagos] = await db.query(query, params);
            return pagos;
        } catch (error) {
            console.error('Error al obtener pagos:', error);
            throw error;
        }
    },

    // Obtener pago por ID de cita
    obtenerPorCita: async (citaId) => {
        try {
            const [pagos] = await db.query(
                'SELECT * FROM vista_pagos_completos WHERE cita_id = ?',
                [citaId]
            );
            return pagos[0] || null;
        } catch (error) {
            console.error('Error al obtener pago por cita:', error);
            throw error;
        }
    },

    // Obtener pago por ID
    obtenerPorId: async (pagoId) => {
        try {
            const [pagos] = await db.query(
                'SELECT * FROM vista_pagos_completos WHERE id_pago = ?',
                [pagoId]
            );
            return pagos[0] || null;
        } catch (error) {
            console.error('Error al obtener pago:', error);
            throw error;
        }
    },

    // Actualizar estado del pago
    actualizarEstado: async (pagoId, nuevoEstado, notas = null) => {
        try {
            const estadosValidos = ['pendiente', 'pagado', 'reembolsado'];
            if (!estadosValidos.includes(nuevoEstado)) {
                throw new Error('Estado de pago inválido');
            }

            await db.query(
                `UPDATE pagos 
                 SET estado_pago = ?, 
                     notas = COALESCE(?, notas)
                 WHERE id = ?`,
                [nuevoEstado, notas, pagoId]
            );

            return { success: true, mensaje: 'Estado actualizado correctamente' };
        } catch (error) {
            console.error('Error al actualizar estado del pago:', error);
            throw error;
        }
    },

    // Obtener estadísticas de pagos
    obtenerEstadisticas: async (fechaInicio = null, fechaFin = null) => {
        try {
            let query = `
                SELECT 
                    metodo_pago,
                    COUNT(*) as cantidad,
                    SUM(monto) as total,
                    AVG(monto) as promedio
                FROM pagos
                WHERE estado_pago = 'pagado'
            `;
            const params = [];

            if (fechaInicio) {
                query += ' AND DATE(fecha_pago) >= ?';
                params.push(fechaInicio);
            }

            if (fechaFin) {
                query += ' AND DATE(fecha_pago) <= ?';
                params.push(fechaFin);
            }

            query += ' GROUP BY metodo_pago';

            const [estadisticas] = await db.query(query, params);

            // Obtener totales generales
            const [[totales]] = await db.query(`
                SELECT 
                    COUNT(*) as total_pagos,
                    SUM(monto) as total_ingresos
                FROM pagos
                WHERE estado_pago = 'pagado'
                ${fechaInicio ? 'AND DATE(fecha_pago) >= ?' : ''}
                ${fechaFin ? 'AND DATE(fecha_pago) <= ?' : ''}
            `, params);

            return {
                porMetodo: estadisticas,
                totales
            };
        } catch (error) {
            console.error('Error al obtener estadísticas de pagos:', error);
            throw error;
        }
    },

    // Verificar si una cita tiene pago registrado
    verificarPagoCita: async (citaId) => {
        try {
            const [[resultado]] = await db.query(
                `SELECT 
                    COUNT(*) as tiene_pago,
                    MAX(estado_pago) as estado_pago
                 FROM pagos 
                 WHERE cita_id = ? AND estado_pago = 'pagado'`,
                [citaId]
            );
            return {
                tienePago: resultado.tiene_pago > 0,
                estadoPago: resultado.estado_pago
            };
        } catch (error) {
            console.error('Error al verificar pago de cita:', error);
            throw error;
        }
    }
};

export default pagoService;
