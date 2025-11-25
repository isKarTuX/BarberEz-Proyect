import React, { useEffect, memo, useMemo } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const Toast = memo(function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    // Memoizar estilos por tipo para evitar recreación
    const typeStyles = useMemo(() => ({
        success: {
            bg: 'bg-green-500/95',
            icon: <FaCheckCircle className="w-5 h-5" aria-hidden="true" />,
            border: 'border-green-600'
        },
        error: {
            bg: 'bg-red-500/95',
            icon: <FaTimesCircle className="w-5 h-5" aria-hidden="true" />,
            border: 'border-red-600'
        },
        warning: {
            bg: 'bg-yellow-500/95',
            icon: <FaExclamationTriangle className="w-5 h-5" aria-hidden="true" />,
            border: 'border-yellow-600'
        },
        info: {
            bg: 'bg-blue-500/95',
            icon: <FaInfoCircle className="w-5 h-5" aria-hidden="true" />,
            border: 'border-blue-600'
        }
    }), []);

    const style = typeStyles[type] || typeStyles.success;

    return (
        <div className="fixed top-4 right-4 z-50 animate-slideInRight" role="alert" aria-live="assertive">
            <div className={`${style.bg} ${style.border} border-l-4 text-white px-6 py-4 rounded-lg shadow-2xl backdrop-blur-sm flex items-center space-x-3 min-w-[300px] max-w-md`}>
                <div className="flex-shrink-0">
                    {style.icon}
                </div>
                <p className="flex-1 font-medium">{message}</p>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
                    aria-label="Cerrar notificación"
                >
                    <FaTimesCircle className="w-4 h-4" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Solo re-renderizar si cambian mensaje o tipo
    return prevProps.message === nextProps.message &&
           prevProps.type === nextProps.type;
});

export default Toast;
