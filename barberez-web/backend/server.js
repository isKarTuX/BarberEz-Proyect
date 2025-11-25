import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import citaRoutes from './routes/citaRoutes.js';
import barberoRoutes from './routes/barberoRoutes.js';
import servicioRoutes from './routes/servicioRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import pagoRoutes from './routes/pagoRoutes.js';

// Importar base de datos
import './config/database.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =========================================
// MIDDLEWARES
// =========================================

// CORS - Permitir peticiones desde el frontend
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5173'
].filter(Boolean); // Eliminar valores undefined

app.use(cors({
    origin: function (origin, callback) {
        // En desarrollo, permitir cualquier origen
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        // Permitir peticiones sin origin (como Postman, mobile apps, etc)
        if (!origin) {
            return callback(null, true);
        }
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parser de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de requests con más información
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${ip}`);
    next();
});

// =========================================
// RUTAS
// =========================================

app.get('/', (req, res) => {
    res.json({
        message: '🚀 API BarberEz funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            citas: '/api/citas',
            barberos: '/api/barberos',
            servicios: '/api/servicios',
            admin: '/api/admin',
            pagos: '/api/pagos'
        }
    });
});

// Montar rutas
app.use('/api/auth', authRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/barberos', barberoRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pagos', pagoRoutes);

// =========================================
// MANEJO DE ERRORES
// =========================================

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Error handler global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// =========================================
// INICIAR SERVIDOR
// =========================================

app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   🚀 SERVIDOR BARBEREZ INICIADO 🚀   ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Base de datos: ${process.env.DB_NAME}`);
    console.log('════════════════════════════════════════\n');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
    console.error('❌ Error no manejado:', err);
    process.exit(1);
});

