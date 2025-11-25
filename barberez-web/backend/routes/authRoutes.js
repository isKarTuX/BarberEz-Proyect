import express from 'express';
import AuthService from '../services/authService.js';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter para login (prevenir ataques de fuerza bruta)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 intentos por ventana
    message: {
        success: false,
        message: 'Demasiados intentos de login. Por favor intenta en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Login con validación y rate limiting
router.post('/login',
    loginLimiter,
    [
        body('correo')
            .trim()
            .notEmpty()
            .withMessage('Correo electrónico requerido'),
        body('contrasena')
            .trim()
            .notEmpty()
            .withMessage('Contraseña requerida')
    ],
    async (req, res) => {
        try {
            // Log para debugging
            console.log('📨 Login attempt:', { correo: req.body.correo });
            
            // Validar errores
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('❌ Validation errors:', errors.array());
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: errors.array()
                });
            }

            const { correo, contrasena } = req.body;

            const user = await AuthService.login(correo, contrasena);

            console.log('✅ Login successful:', user.correo);
            res.json({
                success: true,
                message: 'Login exitoso',
                data: user
            });
        } catch (error) {
            console.error('❌ Login error:', error.message);
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
);

// Registro con validación mejorada
router.post('/register',
    [
        body('nombre')
            .trim()
            .isLength({ min: 3 })
            .withMessage('El nombre debe tener al menos 3 caracteres'),
        body('correo')
            .isEmail()
            .normalizeEmail()
            .withMessage('Correo electrónico inválido'),
        body('telefono')
            .matches(/^\d{10}$/)
            .withMessage('El teléfono debe tener 10 dígitos'),
        body('contrasena')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres'),
        body('cedula')
            .matches(/^\d{7,10}$/)
            .withMessage('La cédula debe tener entre 7 y 10 dígitos'),
        body('rol')
            .isIn(['cliente', 'barbero', 'admin'])
            .withMessage('Rol inválido')
    ],
    async (req, res) => {
        try {
            // Validar errores
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: errors.array()
                });
            }

            const userData = req.body;
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
    }
);

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token es requerido'
            });
        }

        const result = await AuthService.refreshToken(refreshToken);

        res.json({
            success: true,
            message: 'Token refrescado exitosamente',
            data: result
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
});

export default router;

