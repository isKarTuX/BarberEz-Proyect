import React, { memo, useEffect, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = memo(function Modal({ isOpen, onClose, title, children }) {
    // Manejar escape key para cerrar modal
    const handleEscapeKey = useCallback((event) => {
        if (event.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            // Prevenir scroll en el body cuando el modal está abierto
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEscapeKey]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
                role="button"
                aria-label="Cerrar modal"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onClose()}
            ></div>

            {/* Modal */}
            <div 
                className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-fadeIn"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-t-2xl flex items-center justify-between">
                    <h2 id="modal-title" className="text-2xl font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <FaTimes size={24} aria-hidden="true" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Solo re-renderizar si cambian isOpen o title
    return prevProps.isOpen === nextProps.isOpen &&
           prevProps.title === nextProps.title;
});

export default Modal;
