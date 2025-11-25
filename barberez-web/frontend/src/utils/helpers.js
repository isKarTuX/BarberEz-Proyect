/**
 * Utility Functions - BarberEz
 * 
 * Funciones reutilizables para formateo, validación y operaciones comunes.
 * Centraliza lógica para mantener consistencia en toda la aplicación.
 */

// ==================== FORMATTERS ====================

/**
 * Formateadores de datos
 */
export const formatters = {
    /**
     * Formatea fecha a formato largo en español
     * @param {string|Date} fecha - Fecha a formatear
     * @returns {string} - Ej: "25 de noviembre de 2025"
     */
    fecha: (fecha) => {
        if (!fecha) return 'Sin fecha';
        try {
            return new Date(fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return fecha;
        }
    },

    /**
     * Formatea fecha a formato corto
     * @param {string|Date} fecha - Fecha a formatear
     * @returns {string} - Ej: "25/11/2025"
     */
    fechaCorta: (fecha) => {
        if (!fecha) return 'Sin fecha';
        try {
            return new Date(fecha).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            return fecha;
        }
    },

    /**
     * Formatea hora desde formato HH:MM:SS a HH:MM
     * @param {string} hora - Hora en formato HH:MM:SS
     * @returns {string} - Ej: "14:30"
     */
    hora: (hora) => {
        if (!hora) return '';
        return hora.substring(0, 5);
    },

    /**
     * Formatea monto a moneda colombiana
     * @param {number} monto - Monto a formatear
     * @returns {string} - Ej: "$25.000"
     */
    moneda: (monto) => {
        if (monto === null || monto === undefined) return '$0';
        try {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(monto);
        } catch (error) {
            return `$${monto}`;
        }
    },

    /**
     * Formatea número de teléfono colombiano
     * @param {string} telefono - Número de teléfono
     * @returns {string} - Ej: "(321) 456-7890"
     */
    telefono: (telefono) => {
        if (!telefono) return '';
        const cleaned = telefono.toString().replace(/\D/g, '');
        
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return telefono;
    },

    /**
     * Formatea cédula con puntos
     * @param {string} cedula - Número de cédula
     * @returns {string} - Ej: "1.234.567"
     */
    cedula: (cedula) => {
        if (!cedula) return '';
        return cedula.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    /**
     * Capitaliza primera letra de cada palabra
     * @param {string} text - Texto a capitalizar
     * @returns {string} - Ej: "juan pérez" -> "Juan Pérez"
     */
    capitalize: (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },

    /**
     * Trunca texto largo
     * @param {string} text - Texto a truncar
     * @param {number} maxLength - Longitud máxima
     * @returns {string} - Texto truncado con "..."
     */
    truncate: (text, maxLength = 50) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
};

// ==================== VALIDATORS ====================

/**
 * Validadores de datos
 */
export const validators = {
    /**
     * Valida email
     * @param {string} email - Email a validar
     * @returns {boolean}
     */
    isEmail: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Valida teléfono colombiano (10 dígitos)
     * @param {string} telefono - Teléfono a validar
     * @returns {boolean}
     */
    isTelefono: (telefono) => {
        const cleaned = telefono.toString().replace(/\D/g, '');
        return cleaned.length === 10;
    },

    /**
     * Valida cédula colombiana (7-10 dígitos)
     * @param {string} cedula - Cédula a validar
     * @returns {boolean}
     */
    isCedula: (cedula) => {
        const cleaned = cedula.toString().replace(/\D/g, '');
        return cleaned.length >= 7 && cleaned.length <= 10;
    },

    /**
     * Valida contraseña (mínimo 6 caracteres)
     * @param {string} password - Contraseña a validar
     * @returns {object} - { isValid, message }
     */
    isPassword: (password) => {
        if (!password || password.length < 6) {
            return { isValid: false, message: 'La contraseña debe tener mínimo 6 caracteres' };
        }
        if (password.length < 8) {
            return { isValid: true, message: 'Contraseña aceptable, pero recomendamos 8+ caracteres' };
        }
        return { isValid: true, message: 'Contraseña segura' };
    },

    /**
     * Valida fecha no sea en el pasado
     * @param {string} fecha - Fecha a validar (YYYY-MM-DD)
     * @returns {boolean}
     */
    isFutureDate: (fecha) => {
        const selected = new Date(fecha + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
    },

    /**
     * Valida hora no haya pasado (para citas de hoy)
     * @param {string} fecha - Fecha de la cita
     * @param {string} hora - Hora de la cita (HH:MM)
     * @param {number} bufferMinutes - Minutos de anticipación requeridos
     * @returns {boolean}
     */
    isValidAppointmentTime: (fecha, hora, bufferMinutes = 30) => {
        const now = new Date();
        const appointmentDate = new Date(fecha + 'T00:00:00');
        
        // Si no es hoy, es válido
        if (appointmentDate.toDateString() !== now.toDateString()) {
            return true;
        }
        
        // Si es hoy, verificar que la hora no haya pasado
        const [hours, minutes] = hora.split(':').map(Number);
        const appointmentTime = new Date();
        appointmentTime.setHours(hours, minutes, 0, 0);
        
        const requiredTime = new Date(now.getTime() + bufferMinutes * 60000);
        
        return appointmentTime >= requiredTime;
    }
};

// ==================== DATE UTILITIES ====================

/**
 * Utilidades para fechas
 */
export const dateUtils = {
    /**
     * Obtiene fecha actual en formato YYYY-MM-DD
     * @returns {string}
     */
    today: () => {
        return new Date().toISOString().split('T')[0];
    },

    /**
     * Obtiene fecha de mañana en formato YYYY-MM-DD
     * @returns {string}
     */
    tomorrow: () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    },

    /**
     * Agrega días a una fecha
     * @param {string|Date} fecha - Fecha base
     * @param {number} days - Días a agregar
     * @returns {string} - Formato YYYY-MM-DD
     */
    addDays: (fecha, days) => {
        const date = new Date(fecha);
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    },

    /**
     * Calcula diferencia de días entre dos fechas
     * @param {string|Date} fecha1 
     * @param {string|Date} fecha2 
     * @returns {number} - Días de diferencia
     */
    daysBetween: (fecha1, fecha2) => {
        const date1 = new Date(fecha1);
        const date2 = new Date(fecha2);
        const diffTime = Math.abs(date2 - date1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    /**
     * Verifica si una fecha es hoy
     * @param {string|Date} fecha 
     * @returns {boolean}
     */
    isToday: (fecha) => {
        const date = new Date(fecha);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    },

    /**
     * Obtiene día de la semana en español
     * @param {string|Date} fecha 
     * @returns {string} - Ej: "Lunes"
     */
    getDayName: (fecha) => {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const date = new Date(fecha);
        return days[date.getDay()];
    },

    /**
     * Obtiene nombre del mes en español
     * @param {string|Date} fecha 
     * @returns {string} - Ej: "Noviembre"
     */
    getMonthName: (fecha) => {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const date = new Date(fecha);
        return months[date.getMonth()];
    }
};

// ==================== ARRAY UTILITIES ====================

/**
 * Utilidades para arrays
 */
export const arrayUtils = {
    /**
     * Ordena array por campo
     * @param {Array} array - Array a ordenar
     * @param {string} field - Campo por el cual ordenar
     * @param {string} order - 'asc' o 'desc'
     * @returns {Array} - Array ordenado
     */
    sortBy: (array, field, order = 'asc') => {
        return [...array].sort((a, b) => {
            const valueA = a[field];
            const valueB = b[field];
            
            if (order === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    },

    /**
     * Agrupa array por campo
     * @param {Array} array - Array a agrupar
     * @param {string} key - Campo por el cual agrupar
     * @returns {Object} - Objeto con arrays agrupados
     */
    groupBy: (array, key) => {
        return array.reduce((result, item) => {
            const groupKey = item[key];
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(item);
            return result;
        }, {});
    },

    /**
     * Elimina duplicados de array
     * @param {Array} array - Array con posibles duplicados
     * @param {string} key - Campo único para comparar
     * @returns {Array} - Array sin duplicados
     */
    unique: (array, key) => {
        if (!key) {
            return [...new Set(array)];
        }
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }
};

// ==================== STRING UTILITIES ====================

/**
 * Utilidades para strings
 */
export const stringUtils = {
    /**
     * Slugify string (para URLs)
     * @param {string} text - Texto a convertir
     * @returns {string} - Slug
     */
    slugify: (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    },

    /**
     * Genera ID aleatorio
     * @param {number} length - Longitud del ID
     * @returns {string} - ID aleatorio
     */
    randomId: (length = 8) => {
        return Math.random().toString(36).substring(2, 2 + length);
    },

    /**
     * Ofusca email para privacidad
     * @param {string} email - Email a ofuscar
     * @returns {string} - Ej: "j***@example.com"
     */
    obfuscateEmail: (email) => {
        if (!email) return '';
        const [username, domain] = email.split('@');
        return `${username[0]}***@${domain}`;
    }
};

// ==================== EXPORT DEFAULT ====================

export default {
    formatters,
    validators,
    dateUtils,
    arrayUtils,
    stringUtils
};
