import React, { memo, useMemo, useEffect, useCallback } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';

const ConfirmModal = memo(function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Confirmar', 
    cancelText = 'Cancelar', 
    type = 'warning' 
}) {
    // Manejar tecla Escape
    const handleEscapeKey = useCallback((event) => {
        if (event.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEscapeKey]);

    // Memoizar estilos por tipo
    const typeStyles = useMemo(() => ({
        warning: {
            icon: <FaExclamationTriangle className="w-12 h-12 text-yellow-500" aria-hidden="true" />,
            headerBg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
            confirmBtn: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
        },
        danger: {
            icon: <FaExclamationTriangle className="w-12 h-12 text-red-500" aria-hidden="true" />,
            headerBg: 'bg-gradient-to-r from-red-500 to-red-600',
            confirmBtn: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
        },
        success: {
            icon: <FaCheckCircle className="w-12 h-12 text-green-500" aria-hidden="true" />,
            headerBg: 'bg-gradient-to-r from-green-500 to-green-600',
            confirmBtn: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
        }
    }), []);

    const style = typeStyles[type] || typeStyles.warning;

    const handleConfirm = useCallback(() => {
        onConfirm();
        onClose();
    }, [onConfirm, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn" role="dialog" aria-modal="true">
            {/* Overlay con opacidad */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
                role="button"
                aria-label="Cerrar modal"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onClose()}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slideInRight">
                {/* Header */}
                <div className={`${style.headerBg} text-white px-6 py-4 rounded-t-2xl flex items-center justify-between`}>
                    <h3 id="confirm-modal-title" className="text-xl font-bold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <FaTimes className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="flex flex-col items-center text-center mb-6">
                        {style.icon}
                        <p className="text-gray-700 text-lg mt-4">
                            {message}
                        </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`flex-1 px-4 py-3 text-white font-semibold rounded-lg transition-all shadow-md ${style.confirmBtn}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Solo re-renderizar si cambian props relevantes
    return prevProps.isOpen === nextProps.isOpen &&
           prevProps.type === nextProps.type &&
           prevProps.message === nextProps.message;
});

export default ConfirmModal;

