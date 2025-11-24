import express from 'express';
import CitaService from '../services/citaService.js';

const router = express.Router();

// Obtener citas de un cliente
router.get('/cliente/:idCliente', async (req, res) => {
    try {
        const { idCliente } = req.params;
        const { estado } = req.query;

        const citas = await CitaService.getCitasCliente(parseInt(idCliente), estado);

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

// Obtener citas de un barbero
router.get('/barbero/:idBarbero', async (req, res) => {
    try {
        const { idBarbero } = req.params;
        const { estado, fecha } = req.query;

        const citas = await CitaService.getCitasBarbero(
            parseInt(idBarbero),
            estado,
            fecha
        );

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

// Agendar nueva cita
router.post('/', async (req, res) => {
    try {
        const citaData = req.body;

        if (!citaData.fecha || !citaData.horaIn || !citaData.idCliente ||
            !citaData.idBarbero || !citaData.servicios || !citaData.metodoPago) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        const result = await CitaService.agendarCita(citaData);

        res.status(201).json({
            success: true,
            message: 'Cita agendada exitosamente',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Actualizar estado de cita
router.patch('/:idCita/estado', async (req, res) => {
    try {
        const { idCita } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({
                success: false,
                message: 'El estado es requerido'
            });
        }

        await CitaService.actualizarEstado(parseInt(idCita), estado);

        res.json({
            success: true,
            message: 'Estado actualizado exitosamente'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Cancelar cita
router.delete('/:idCita', async (req, res) => {
    try {
        const { idCita } = req.params;
        const { idUsuario, rol } = req.body;

        await CitaService.cancelarCita(parseInt(idCita), parseInt(idUsuario), rol);

        res.json({
            success: true,
            message: 'Cita cancelada exitosamente'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Obtener horarios disponibles
router.get('/disponibilidad/:idBarbero/:fecha', async (req, res) => {
    try {
        const { idBarbero, fecha } = req.params;

        const horariosOcupados = await CitaService.getHorariosDisponibles(
            parseInt(idBarbero),
            fecha
        );

        res.json({
            success: true,
            data: horariosOcupados
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;

