import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_barberez_2024';
const JWT_EXPIRES_IN = '8h'; // Token expira en 8 horas
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret_barberez_2024';
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // Refresh token expira en 7 días

class AuthService {
    // Login de usuario con JWT mejorado
    static async login(correo, contrasena) {
        try {
            const [users] = await pool.execute(
                'SELECT * FROM usuario WHERE correo = ?',
                [correo]
            );

            if (users.length === 0) {
                throw new Error('Usuario no encontrado');
            }

            const user = users[0];

            // Comparar contraseñas (soporta bcrypt Y texto plano)
            let isPasswordValid = false;
            
            // Verificar si la contraseña está hasheada con bcrypt (empieza con $2a$, $2b$ o $2y$)
            const isBcryptHash = /^\$2[aby]\$/.test(user.contrasena);
            
            if (isBcryptHash) {
                // Es un hash bcrypt, usar bcrypt.compare
                isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
            } else {
                // Es texto plano, comparar directamente
                isPasswordValid = user.contrasena === contrasena;
                
                // Si es válido, hashear y actualizar
                if (isPasswordValid) {
                    const hashedPassword = await bcrypt.hash(contrasena, 10);
                    await pool.execute(
                        'UPDATE usuario SET contrasena = ? WHERE idUsuario = ?',
                        [hashedPassword, user.idUsuario]
                    );
                    console.warn(`✅ Contraseña migrada a bcrypt para: ${user.correo}`);
                }
            }

            if (!isPasswordValid) {
                throw new Error('Contraseña incorrecta');
            }

            // Eliminar contraseña del objeto
            delete user.contrasena;

            // Generar tokens JWT con expiración
            const token = jwt.sign(
                { 
                    idUsuario: user.idUsuario,
                    correo: user.correo,
                    rol: user.rol,
                    nombre: user.nombre
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            const refreshToken = jwt.sign(
                { 
                    idUsuario: user.idUsuario,
                    correo: user.correo
                },
                REFRESH_TOKEN_SECRET,
                { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
            );

            return { 
                ...user, 
                token,
                refreshToken,
                expiresIn: JWT_EXPIRES_IN
            };
        } catch (error) {
            throw error;
        }
    }

    // Registrar nuevo usuario con hash seguro
    static async register(userData) {
        const { nombre, correo, telefono, contrasena, cedula, rol, comision = 0 } = userData;

        try {
            // Verificar si el correo ya existe
            const [existing] = await pool.execute(
                'SELECT idUsuario FROM usuario WHERE correo = ? OR cedula = ?',
                [correo, cedula]
            );

            if (existing.length > 0) {
                throw new Error('El correo o cédula ya están registrados');
            }

            // Hashear contraseña antes de guardar
            const hashedPassword = await bcrypt.hash(contrasena, 10);

            // Insertar directamente en la tabla usuario
            const [result] = await pool.execute(
                'INSERT INTO usuario (nombre, correo, telefono, contrasena, cedula, rol, comision) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [nombre, correo, telefono, hashedPassword, cedula, rol, comision]
            );

            return { id: result.insertId, nombre, correo, rol };
        } catch (error) {
            throw error;
        }
    }

    // Refrescar token JWT
    static async refreshToken(refreshToken) {
        try {
            // Verificar refresh token
            const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

            // Generar nuevo access token
            const newToken = jwt.sign(
                { 
                    idUsuario: decoded.idUsuario,
                    correo: decoded.correo
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            return { 
                token: newToken,
                expiresIn: JWT_EXPIRES_IN
            };
        } catch (error) {
            throw new Error('Refresh token inválido o expirado');
        }
    }

    // Verificar token JWT
    static verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }
}

export default AuthService;

