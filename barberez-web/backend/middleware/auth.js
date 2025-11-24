import jwt from 'jsonwebtoken';

// Middleware para verificar el token JWT
export const verificarToken = (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No se proporcionó token de autenticación'
            });
        }

        // Extraer el token
        const token = authHeader.substring(7); // Remover "Bearer "

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_barberez_2024');

        // Agregar la información del usuario al request
        req.usuario = decoded;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error al verificar token'
        });
    }
};

// Middleware para verificar roles
export const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        try {
            // Verificar que el usuario tenga un rol
            if (!req.usuario || !req.usuario.rol) {
                return res.status(403).json({
                    success: false,
                    message: 'No se pudo determinar el rol del usuario'
                });
            }

            // Verificar que el rol del usuario esté en la lista de roles permitidos
            if (!rolesPermitidos.includes(req.usuario.rol)) {
                return res.status(403).json({
                    success: false,
                    message: 'No tiene permisos para acceder a este recurso'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al verificar permisos'
            });
        }
    };
};

// Middleware para verificar que el usuario sea admin
export const verificarAdmin = verificarRol(['admin']);

// Middleware para verificar que el usuario sea admin o barbero
export const verificarAdminOBarbero = verificarRol(['admin', 'barbero']);

// Middleware opcional para obtener usuario si hay token, pero no obligatorio
export const obtenerUsuarioOpcional = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.usuario = null;
            return next();
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_barberez_2024');
        req.usuario = decoded;

        next();
    } catch (error) {
        req.usuario = null;
        next();
    }
};

export default {
    verificarToken,
    verificarRol,
    verificarAdmin,
    verificarAdminOBarbero,
    obtenerUsuarioOpcional
};

