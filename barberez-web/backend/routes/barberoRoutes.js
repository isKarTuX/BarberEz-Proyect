import express from 'express';
import BarberoService from '../services/barberoService.js';

const router = express.Router();

// Obtener todos los barberos
router.get('/', async (req, res) => {
    try {
        const barberos = await BarberoService.getAllBarberos();

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

// Obtener ingresos de un barbero
router.get('/:idBarbero/ingresos', async (req, res) => {
    try {
        const { idBarbero } = req.params;
        const { fechaInicio, fechaFin } = req.query;

        const ingresos = await BarberoService.getIngresos(
            parseInt(idBarbero),
            fechaInicio,
            fechaFin
        );

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

export default router;

