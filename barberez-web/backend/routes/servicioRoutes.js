import express from 'express';
import ServicioService from '../services/servicioService.js';

const router = express.Router();

// Obtener todos los servicios
router.get('/', async (req, res) => {
    try {
        const servicios = await ServicioService.getAllServicios();

        res.json({
            success: true,
            data: servicios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Crear nuevo servicio
router.post('/', async (req, res) => {
    try {
        const servicioData = req.body;

        if (!servicioData.nombre || !servicioData.duracion || !servicioData.precio) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        const servicio = await ServicioService.crearServicio(servicioData);

        res.status(201).json({
            success: true,
            message: 'Servicio creado exitosamente',
            data: servicio
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Actualizar servicio
router.put('/:idSer', async (req, res) => {
    try {
        const { idSer } = req.params;
        const servicioData = req.body;

        const updated = await ServicioService.actualizarServicio(
            parseInt(idSer),
            servicioData
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Servicio actualizado exitosamente'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

export default router;

