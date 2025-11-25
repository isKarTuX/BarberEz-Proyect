import React, { memo, useMemo, useCallback } from 'react';
import { FaGripVertical, FaThLarge, FaTh, FaListUl } from 'react-icons/fa';

const LayoutControl = memo(function LayoutControl({ 
    columns, 
    onColumnsChange, 
    size, 
    onSizeChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems
}) {
    // Memoizar opciones estáticas
    const columnOptions = useMemo(() => [
        { value: 1, label: '1', icon: FaGripVertical },
        { value: 2, label: '2', icon: FaThLarge },
        { value: 3, label: '3', icon: FaTh }
    ], []);

    const sizeOptions = useMemo(() => [
        { value: 'compact', label: 'Compacto' },
        { value: 'normal', label: 'Normal' },
        { value: 'comfortable', label: 'Cómodo' }
    ], []);

    const itemsPerPageOptions = useMemo(() => [10, 20, 30, 50, 100], []);

    // Callbacks memoizados
    const handleSizeChange = useCallback((e) => {
        onSizeChange(e.target.value);
    }, [onSizeChange]);

    const handleItemsPerPageChange = useCallback((e) => {
        const value = e.target.value === 'auto' ? null : parseInt(e.target.value);
        onItemsPerPageChange(value);
    }, [onItemsPerPageChange]);

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
                                    title={`${option.label} columna${option.value > 1 ? 's' : ''}`}
                                    aria-label={`${option.label} columna${option.value > 1 ? 's' : ''}`}
                                    aria-pressed={columns === option.value}
                                >
                                    <Icon size={14} aria-hidden="true" />
                                    <span className="text-sm font-medium hidden sm:inline">{option.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selector de Tamaño */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-700 hidden sm:inline">Tamaño:</span>
                    <select
                        value={size}
                        onChange={handleSizeChange}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                        aria-label="Tamaño de tarjetas"
                    >
                        {sizeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selector de Items por Página */}
                {onItemsPerPageChange && (
                    <div className="flex items-center space-x-2 ml-auto">
                        <FaListUl className="text-primary hidden sm:inline" size={14} aria-hidden="true" />
                        <span className="text-sm font-semibold text-gray-700 hidden sm:inline">
                            Items por página:
                        </span>
                        <select
                            value={itemsPerPage || 'auto'}
                            onChange={handleItemsPerPageChange}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary focus:border-transparent font-semibold"
                            aria-label="Items por página"
                        >
                            <option value="auto">Auto</option>
                            {itemsPerPageOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {totalItems > 0 && (
                            <span className="text-xs text-gray-500 hidden md:inline whitespace-nowrap">
                                de {totalItems} total
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Solo re-renderizar si cambian props relevantes
    return prevProps.columns === nextProps.columns &&
           prevProps.size === nextProps.size &&
           prevProps.itemsPerPage === nextProps.itemsPerPage &&
           prevProps.totalItems === nextProps.totalItems;
});

export default LayoutControl;

