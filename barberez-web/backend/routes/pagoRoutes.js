import express from 'express';
import pagoService from '../services/pagoService.js';
import { verificarToken, verificarRol } from '../middleware/auth.js';

const router = express.Router();

// Middleware para verificar autenticación en todas las rutas
router.use(verificarToken);

/**
 * @route   POST /api/pagos
 * @desc    Registrar un nuevo pago
 * @access  Admin, Barbero
 */
router.post('/', verificarRol(['admin', 'barbero']), async (req, res) => {
    try {
        const {
            citaId,
            metodoPago,
            referenciaTransferencia,
            bancoOrigen,
            ultimos4Digitos,
            tipoTarjeta,
            notas
        } = req.body;

        // Validaciones
        if (!citaId || !metodoPago) {
            return res.status(400).json({
                success: false,
                message: 'Cita ID y método de pago son obligatorios'
            });
        }

        const metodosValidos = ['efectivo', 'tarjeta', 'transferencia'];
        if (!metodosValidos.includes(metodoPago)) {
            return res.status(400).json({
                success: false,
                message: 'Método de pago inválido. Debe ser: efectivo, tarjeta o transferencia'
            });
        }

        const resultado = await pagoService.registrarPago({
            citaId,
            metodoPago,
            referenciaTransferencia,
            bancoOrigen,
            ultimos4Digitos,
            tipoTarjeta,
            procesadoPor: req.usuario.id,
            notas
        });

        res.status(201).json({
            success: true,
            message: 'Pago registrado exitosamente',
            data: resultado
        });
    } catch (error) {
        console.error('Error al registrar pago:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al registrar el pago'
        });
    }
});

/**
 * @route   GET /api/pagos
 * @desc    Obtener todos los pagos con filtros opcionales
 * @access  Admin, Barbero
 */
router.get('/', verificarRol(['admin', 'barbero']), async (req, res) => {
    try {
        const { metodoPago, estadoPago, fechaInicio, fechaFin } = req.query;

        const pagos = await pagoService.obtenerTodos({
            metodoPago,
            estadoPago,
            fechaInicio,
            fechaFin
        });

        res.json({
            success: true,
            data: pagos,
            total: pagos.length
        });
    } catch (error) {
        console.error('Error al obtener pagos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los pagos'
        });
    }
});

/**
 * @route   GET /api/pagos/cita/:citaId
 * @desc    Obtener pago de una cita específica
 * @access  Admin, Barbero, Cliente (solo su cita)
 */
router.get('/cita/:citaId', async (req, res) => {
    try {
        const { citaId } = req.params;
        const pago = await pagoService.obtenerPorCita(citaId);

        if (!pago) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró pago para esta cita'
            });
        }

        // Si es cliente, verificar que sea su cita
        if (req.usuario.rol === 'cliente' && pago.cliente_id !== req.usuario.id) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permiso para ver este pago'
            });
        }

        res.json({
            success: true,
            data: pago
        });
    } catch (error) {
        console.error('Error al obtener pago por cita:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el pago'
        });
    }
});

/**
 * @route   GET /api/pagos/:id
 * @desc    Obtener un pago por ID
 * @access  Admin, Barbero
 */
router.get('/:id', verificarRol(['admin', 'barbero']), async (req, res) => {
    try {
        const { id } = req.params;
        const pago = await pagoService.obtenerPorId(id);

        if (!pago) {
            return res.status(404).json({
                success: false,
                message: 'Pago no encontrado'
            });
        }

        res.json({
            success: true,
            data: pago
        });
    } catch (error) {
        console.error('Error al obtener pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el pago'
        });
    }
});

/**
 * @route   PUT /api/pagos/:id/estado
 * @desc    Actualizar estado de un pago
 * @access  Admin
 */
router.put('/:id/estado', verificarRol(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoEstado, notas } = req.body;

        if (!nuevoEstado) {
            return res.status(400).json({
                success: false,
                message: 'El nuevo estado es obligatorio'
            });
        }

        const resultado = await pagoService.actualizarEstado(id, nuevoEstado, notas);

        res.json({
            success: true,
            message: 'Estado del pago actualizado correctamente',
            data: resultado
        });
    } catch (error) {
        console.error('Error al actualizar estado del pago:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al actualizar el estado del pago'
        });
    }
});

/**
 * @route   GET /api/pagos/estadisticas/resumen
 * @desc    Obtener estadísticas de pagos
 * @access  Admin
 */
router.get('/estadisticas/resumen', verificarRol(['admin']), async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        const estadisticas = await pagoService.obtenerEstadisticas(fechaInicio, fechaFin);

        res.json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las estadísticas'
        });
    }
});

/**
 * @route   GET /api/pagos/verificar/:citaId
 * @desc    Verificar si una cita tiene pago registrado
 * @access  Admin, Barbero
 */
router.get('/verificar/:citaId', verificarRol(['admin', 'barbero']), async (req, res) => {
    try {
        const { citaId } = req.params;
        const resultado = await pagoService.verificarPagoCita(citaId);

        res.json({
            success: true,
            data: resultado
        });
    } catch (error) {
        console.error('Error al verificar pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar el pago'
        });
    }
});

export default router;
