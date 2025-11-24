import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración del pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'barberia_barberez',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Verificar conexión inicial
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión a MySQL establecida correctamente');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error conectando a MySQL:', err.message);
        process.exit(1);
    });

export default pool;

