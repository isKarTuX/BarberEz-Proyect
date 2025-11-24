import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    totalItems
}) {
    const pages = [];
    const maxVisiblePages = 5;

    // Calcular el rango de páginas a mostrar
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (totalPages === 0) return null;

    return (
        <div className="bg-white rounded-lg shadow-sm p-3 mt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Info de items */}
                <div className="text-sm text-gray-600">
                    Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} items
                </div>

                {/* Controles de paginación */}
                <div className="flex items-center space-x-1">
                    {/* Botón Anterior */}
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-1"
                    >
                        <FaChevronLeft size={12} />
                        <span className="hidden sm:inline">Anterior</span>
                    </button>

                    {/* Primera página */}
                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                1
                            </button>
                            {startPage > 2 && (
                                <span className="px-2 text-gray-400">...</span>
                            )}
                        </>
                    )}

                    {/* Páginas numeradas */}
                    {pages.map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1.5 rounded-lg border transition-all ${
                                currentPage === page
                                    ? 'bg-primary text-white border-primary font-semibold'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Última página */}
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && (
                                <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    {/* Botón Siguiente */}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-1"
                    >
                        <span className="hidden sm:inline">Siguiente</span>
                        <FaChevronRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}

