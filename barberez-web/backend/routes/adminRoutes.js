import express from 'express';
import AdminService from '../services/adminService.js';

const router = express.Router();

// Obtener estadísticas generales
router.get('/estadisticas', async (req, res) => {
    try {
        const stats = await AdminService.getEstadisticas();

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Obtener estadísticas por barbero
router.get('/estadisticas/barberos', async (req, res) => {
    try {
        const stats = await AdminService.getEstadisticasPorBarbero();

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Obtener ingresos totales
router.get('/ingresos', async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        const ingresos = await AdminService.getIngresosTotales(fechaInicio, fechaFin);

        res.json({
            success: true,
            data: ingresos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Obtener ingresos por barbero
router.get('/ingresos/barberos', async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        const ingresos = await AdminService.getIngresosPorBarbero(fechaInicio, fechaFin);

        res.json({
            success: true,
            data: ingresos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Obtener todas las citas
router.get('/citas', async (req, res) => {
    try {
        const { estado } = req.query;

        const citas = await AdminService.getAllCitas(estado);

        res.json({
            success: true,
            data: citas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Búsqueda avanzada de citas con filtros
router.post('/citas/buscar', async (req, res) => {
    try {
        const filtros = req.body;

        const resultado = await AdminService.buscarCitas(filtros);

        res.json({
            success: true,
            data: resultado.citas,
            meta: {
                total: resultado.totalResultados,
                filtros: resultado.filtrosAplicados
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Obtener estadísticas de citas
router.post('/citas/estadisticas', async (req, res) => {
    try {
        const filtros = req.body;

        const stats = await AdminService.getEstadisticasCitas(filtros);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== GESTIÓN DE CLIENTES ====================

// Obtener todos los clientes
router.post('/clientes', async (req, res) => {
    try {
        const filtros = req.body;
        const clientes = await AdminService.getAllClientes(filtros);

        res.json({
            success: true,
            data: clientes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Actualizar cliente
router.put('/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await AdminService.updateCliente(id, req.body);

        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Resetear contraseña de cliente
router.post('/clientes/:id/reset-password', async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevaContrasena } = req.body;

        const result = await AdminService.resetPasswordCliente(id, nuevaContrasena);

        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Eliminar cliente
router.delete('/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await AdminService.deleteCliente(id);

        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== GESTIÓN DE BARBEROS ====================

// Obtener todos los barberos
router.post('/barberos', async (req, res) => {
    try {
        const filtros = req.body;
        const barberos = await AdminService.getAllBarberosGestion(filtros);

        res.json({
            success: true,
            data: barberos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Actualizar barbero
router.put('/barberos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await AdminService.updateBarbero(id, req.body);

        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Resetear contraseña de barbero
router.post('/barberos/:id/reset-password', async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevaContrasena } = req.body;

        const result = await AdminService.resetPasswordBarbero(id, nuevaContrasena);

        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Eliminar barbero
router.delete('/barberos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await AdminService.deleteBarbero(id);

        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;

