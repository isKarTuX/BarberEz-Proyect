import express from 'express';
import AuthService from '../services/authService.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({
                success: false,
                message: 'Correo y contraseña son requeridos'
            });
        }

        const user = await AuthService.login(correo, contrasena);

        res.json({
            success: true,
            message: 'Login exitoso',
            data: user
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
});

// Registro
router.post('/register', async (req, res) => {
    try {
        const userData = req.body;

        if (!userData.nombre || !userData.correo || !userData.contrasena ||
            !userData.cedula || !userData.rol) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        const result = await AuthService.register(userData);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

export default router;

