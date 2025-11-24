import React from 'react';
import { FaGripVertical, FaThLarge, FaTh } from 'react-icons/fa';

export default function LayoutControl({ columns, onColumnsChange, size, onSizeChange }) {
    const columnOptions = [
        { value: 1, label: '1', icon: FaGripVertical },
        { value: 2, label: '2', icon: FaThLarge },
        { value: 3, label: '3', icon: FaTh }
    ];

    const sizeOptions = [
        { value: 'compact', label: 'Compacto' },
        { value: 'normal', label: 'Normal' },
        { value: 'comfortable', label: 'Cómodo' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-3 mb-4">
            <div className="flex flex-wrap items-center gap-4">
                {/* Selector de Columnas */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-700">Columnas:</span>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {columnOptions.map(option => {
                            const Icon = option.icon;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => onColumnsChange(option.value)}
                                    className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1 ${
                                        columns === option.value
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <Icon size={14} />
                                    <span className="text-sm font-medium">{option.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selector de Tamaño */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-700">Tamaño:</span>
                    <select
                        value={size}
                        onChange={(e) => onSizeChange(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        {sizeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

