import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class AuthService {
    // Login de usuario
    static async login(correo, contrasena) {
        try {
            const [users] = await pool.execute(
                'SELECT u.*, COALESCE(b.comision, 0) as comision FROM usuario u LEFT JOIN barbero b ON u.idUsuario = b.idBarbero WHERE u.correo = ?',
                [correo]
            );

            if (users.length === 0) {
                throw new Error('Usuario no encontrado');
            }

            const user = users[0];

            // Comparar contraseñas (si están hasheadas usa bcrypt, sino comparación directa)
            const isPasswordValid = user.contrasena === contrasena ||
                                   await bcrypt.compare(contrasena, user.contrasena);

            if (!isPasswordValid) {
                throw new Error('Contraseña incorrecta');
            }

            // Eliminar contraseña del objeto
            delete user.contrasena;

            return user;
        } catch (error) {
            throw error;
        }
    }

    // Registrar nuevo usuario
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

            // Usar el procedimiento almacenado
            const [result] = await pool.execute(
                'CALL sp_registrar_usuario(?, ?, ?, ?, ?, ?, ?)',
                [nombre, correo, telefono, contrasena, cedula, rol, comision]
            );

            return result[0][0];
        } catch (error) {
            throw error;
        }
    }
}

export default AuthService;

