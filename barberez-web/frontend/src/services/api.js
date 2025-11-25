import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 segundos timeout
});

// Variable para controlar si ya estamos refrescando el token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Interceptor para agregar token si existe
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores y refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 y no es login/register, intentar refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url.includes('/auth/login') || 
                originalRequest.url.includes('/auth/register')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (!user.refreshToken) {
                // No hay refresh token, redirigir a login
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken: user.refreshToken
                });

                const { token } = response.data.data;
                
                // Actualizar token en localStorage
                user.token = token;
                localStorage.setItem('user', JSON.stringify(user));

                // Actualizar header del request original
                originalRequest.headers.Authorization = `Bearer ${token}`;
                
                processQueue(null, token);
                
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Manejo de otros errores
        if (error.response?.status === 429) {
            console.error('Demasiadas peticiones. Por favor espera.');
        }

        return Promise.reject(error);
    }
);

// ==================== AUTH ====================
export const authAPI = {
    login: (correo, contrasena) =>
        api.post('/auth/login', { correo, contrasena }),

    register: (userData) =>
        api.post('/auth/register', userData),
};

// ==================== CITAS ====================
export const citasAPI = {
    getCitasCliente: (idCliente, estado = null) =>
        api.get(`/citas/cliente/${idCliente}${estado ? `?estado=${estado}` : ''}`),

    getCitasBarbero: (idBarbero, estado = null, fecha = null) => {
        const params = new URLSearchParams();
        if (estado) params.append('estado', estado);
        if (fecha) params.append('fecha', fecha);
        const queryString = params.toString();
        return api.get(`/citas/barbero/${idBarbero}${queryString ? `?${queryString}` : ''}`);
    },

    agendarCita: (citaData) =>
        api.post('/citas', citaData),

    actualizarEstado: (idCita, estado) =>
        api.patch(`/citas/${idCita}/estado`, { estado }),

    // Funciones helper para barberos
    confirmarCita: (idCita) =>
        api.patch(`/citas/${idCita}/estado`, { estado: 'confirmada' }),

    rechazarCita: (idCita) =>
        api.patch(`/citas/${idCita}/estado`, { estado: 'cancelada' }),

    completarCita: (idCita) =>
        api.patch(`/citas/${idCita}/estado`, { estado: 'completada' }),

    cancelarCita: (idCita, idUsuario, rol) =>
        api.delete(`/citas/${idCita}`, { data: { idUsuario, rol } }),

    getDisponibilidad: (idBarbero, fecha) =>
        api.get(`/citas/disponibilidad/${idBarbero}/${fecha}`),
};

// ==================== BARBEROS ====================
export const barberosAPI = {
    getAll: () =>
        api.get('/barberos'),

    getIngresos: (idBarbero, fechaInicio = null, fechaFin = null) =>
        api.get(`/barberos/${idBarbero}/ingresos`, {
            params: { fechaInicio, fechaFin }
        }),
};

// ==================== SERVICIOS ====================
export const serviciosAPI = {
    getAll: () =>
        api.get('/servicios'),

    crear: (servicioData) =>
        api.post('/servicios', servicioData),

    actualizar: (idSer, servicioData) =>
        api.put(`/servicios/${idSer}`, servicioData),

    eliminar: (idSer) =>
        api.delete(`/servicios/${idSer}`),
};

// ==================== ADMIN ====================
export const adminAPI = {
    getEstadisticas: () =>
        api.get('/admin/estadisticas'),

    getEstadisticasBarberos: () =>
        api.get('/admin/estadisticas/barberos'),

    getIngresos: (fechaInicio = null, fechaFin = null) =>
        api.get('/admin/ingresos', {
            params: { fechaInicio, fechaFin }
        }),

    getIngresosPorBarbero: (fechaInicio = null, fechaFin = null) =>
        api.get('/admin/ingresos/barberos', {
            params: { fechaInicio, fechaFin }
        }),

    getAllCitas: (estado = null) =>
        api.get('/admin/citas', {
            params: { estado }
        }),

    // Búsqueda avanzada de citas con filtros
    buscarCitas: (filtros) =>
        api.post('/admin/citas/buscar', filtros),

    // Estadísticas de citas con filtros
    getEstadisticasCitas: (filtros) =>
        api.post('/admin/citas/estadisticas', filtros),

    // ==================== GESTIÓN DE CLIENTES ====================
    getAllClientes: (filtros) =>
        api.post('/admin/clientes', filtros),

    updateCliente: (id, datos) =>
        api.put(`/admin/clientes/${id}`, datos),

    resetPasswordCliente: (id, nuevaContrasena) =>
        api.post(`/admin/clientes/${id}/reset-password`, { nuevaContrasena }),

    deleteCliente: (id) =>
        api.delete(`/admin/clientes/${id}`),

    // ==================== GESTIÓN DE BARBEROS ====================
    getAllBarberosGestion: (filtros) =>
        api.post('/admin/barberos', filtros),

    updateBarbero: (id, datos) =>
        api.put(`/admin/barberos/${id}`, datos),

    resetPasswordBarbero: (id, nuevaContrasena) =>
        api.post(`/admin/barberos/${id}/reset-password`, { nuevaContrasena }),

    deleteBarbero: (id) =>
        api.delete(`/admin/barberos/${id}`),
};

export default api;

