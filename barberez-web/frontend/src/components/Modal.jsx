import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-fadeIn">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-t-2xl flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
