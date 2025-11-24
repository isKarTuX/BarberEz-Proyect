import pool from '../config/database.js';

class ServicioService {
    // Obtener todos los servicios activos
    static async getAllServicios() {
        try {
            const [servicios] = await pool.execute(
                'SELECT * FROM servicio WHERE activo = TRUE ORDER BY nombre'
            );
            return servicios;
        } catch (error) {
            throw error;
        }
    }

    // Crear nuevo servicio
    static async crearServicio(servicioData) {
        const { nombre, duracion, precio } = servicioData;
        try {
            const [result] = await pool.execute(
                'INSERT INTO servicio (nombre, duracion, precio) VALUES (?, ?, ?)',
                [nombre, duracion, precio]
            );
            return { idSer: result.insertId, ...servicioData };
        } catch (error) {
            throw error;
        }
    }

    // Actualizar servicio
    static async actualizarServicio(idSer, servicioData) {
        const { nombre, duracion, precio, activo } = servicioData;
        try {
            const [result] = await pool.execute(
                'UPDATE servicio SET nombre = ?, duracion = ?, precio = ?, activo = ? WHERE idSer = ?',
                [nombre, duracion, precio, activo, idSer]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

export default ServicioService;

