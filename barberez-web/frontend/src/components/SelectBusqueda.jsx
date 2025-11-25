import React, { useState, useRef, useEffect, memo, useMemo, useCallback } from 'react';
import { FaSearch, FaChevronDown, FaCheck } from 'react-icons/fa';

const SelectBusqueda = memo(function SelectBusqueda({ 
    value, 
    onChange, 
    options = [], 
    placeholder = "Seleccionar...",
    valueKey = "value",
    labelKey = "label",
    className = ""
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);

    // Memoizar opciones filtradas
    const filteredOptions = useMemo(() => 
        options.filter(option => 
            option[labelKey].toLowerCase().includes(searchTerm.toLowerCase())
        ), 
        [options, searchTerm, labelKey]
    );

    // Memoizar opción seleccionada
    const selectedOption = useMemo(() => 
        options.find(opt => opt[valueKey] === value),
        [options, value, valueKey]
    );

    // Callbacks memoizados
    const handleSelect = useCallback((optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    }, [onChange]);

    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Botón principal */}
            <button
                type="button"
                onClick={toggleOpen}
                className="input-field flex items-center justify-between w-full text-left"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={value ? 'text-gray-800' : 'text-gray-400'}>
                    {selectedOption ? selectedOption[labelKey] : placeholder}
                </span>
                <FaChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border-2 border-primary/20 max-h-80 overflow-hidden animate-fadeIn">
                    {/* Barra de búsqueda */}
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Lista de opciones */}
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {/* Opción "Todos" */}
                        <button
                            type="button"
                            onClick={() => handleSelect('')}
                            className={`w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex items-center justify-between ${
                                !value ? 'bg-primary/5' : ''
                            }`}
                        >
                            <span className="text-gray-700 font-medium">Todos</span>
                            {!value && <FaCheck className="w-4 h-4 text-primary" />}
                        </button>

                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                No se encontraron resultados
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option[valueKey]}
                                    type="button"
                                    onClick={() => handleSelect(option[valueKey])}
                                    className={`w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex items-center justify-between ${
                                        value === option[valueKey] ? 'bg-primary/5' : ''
                                    }`}
                                >
                                    <span className="text-gray-700">{option[labelKey]}</span>
                                    {value === option[valueKey] && (
                                        <FaCheck className="w-4 h-4 text-primary" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}, (prevProps, nextProps) => {
    // Solo re-renderizar si cambian props relevantes
    return prevProps.value === nextProps.value &&
           prevProps.options === nextProps.options;
});

export default SelectBusqueda;
