import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

/**
 * Hook para persistir estado en localStorage
 * 
 * @param {string} key - Clave en localStorage
 * @param {any} initialValue - Valor inicial si no existe en localStorage
 * @returns {[any, function]} - [valor, setter]
 * 
 * @example
 * const [theme, setTheme] = usePersistentState('app-theme', 'light');
 */
export function usePersistentState(key, initialValue) {
    const [state, setState] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : initialValue;
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    }, [key, state]);

    return [state, setState];
}

/**
 * Hook para paginación de arrays
 * 
 * @param {Array} items - Array de items a paginar
 * @param {number} itemsPerPage - Número de items por página
 * @returns {object} - Objeto con utilidades de paginación
 * 
 * @example
 * const { paginatedItems, currentPage, setCurrentPage, totalPages } = usePagination(citas, 10);
 */
export function usePagination(items, itemsPerPage = 12) {
    const [currentPage, setCurrentPage] = useState(1);

    // Calcular items paginados
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return items.slice(start, end);
    }, [items, currentPage, itemsPerPage]);

    // Calcular total de páginas
    const totalPages = useMemo(() => {
        return Math.ceil(items.length / itemsPerPage) || 1;
    }, [items.length, itemsPerPage]);

    // Resetear a página 1 cuando cambian los items
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    // Funciones de navegación
    const goToPage = useCallback((page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, [totalPages]);

    const nextPage = useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    }, [currentPage, totalPages]);

    const prevPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    }, [currentPage]);

    return {
        paginatedItems,
        currentPage,
        setCurrentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
        totalItems: items.length,
        startIndex: (currentPage - 1) * itemsPerPage + 1,
        endIndex: Math.min(currentPage * itemsPerPage, items.length)
    };
}

/**
 * Hook para debounce de valores
 * 
 * @param {any} value - Valor a debouncear
 * @param {number} delay - Delay en milisegundos
 * @returns {any} - Valor debounceado
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // Esta búsqueda solo se ejecuta 500ms después de que el usuario deje de escribir
 *   buscarEnAPI(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook para llamadas a API con loading y error states
 * 
 * @param {function} apiFunction - Función que hace la llamada a la API
 * @returns {object} - { data, loading, error, execute, reset }
 * 
 * @example
 * const { data, loading, error, execute } = useApi(() => citasAPI.getCitasCliente(userId));
 * 
 * useEffect(() => {
 *   execute();
 * }, []);
 */
export function useApi(apiFunction) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiFunction(...args);
            setData(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error en la operación';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, loading, error, execute, reset };
}

/**
 * Hook para detectar clicks fuera de un elemento
 * 
 * @param {function} callback - Función a ejecutar cuando se clickea fuera
 * @returns {ref} - Ref para adjuntar al elemento
 * 
 * @example
 * const ref = useClickOutside(() => setMenuOpen(false));
 * return <div ref={ref}>Menu</div>;
 */
export function useClickOutside(callback) {
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [callback]);

    return ref;
}

/**
 * Hook para copiar texto al portapapeles
 * 
 * @returns {[function, boolean]} - [copyToClipboard, copied]
 * 
 * @example
 * const [copyToClipboard, copied] = useClipboard();
 * 
 * <button onClick={() => copyToClipboard('Texto a copiar')}>
 *   {copied ? 'Copiado!' : 'Copiar'}
 * </button>
 */
export function useClipboard(resetDelay = 2000) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = useCallback(async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), resetDelay);
            return true;
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            setCopied(false);
            return false;
        }
    }, [resetDelay]);

    return [copyToClipboard, copied];
}

/**
 * Hook para manejar filtros con debounce
 * 
 * @param {object} initialFilters - Filtros iniciales
 * @param {number} debounceDelay - Delay del debounce
 * @returns {object} - { filters, debouncedFilters, setFilters, resetFilters }
 * 
 * @example
 * const { filters, debouncedFilters, setFilters, resetFilters } = useFilters({
 *   busqueda: '',
 *   estado: ''
 * }, 500);
 */
export function useFilters(initialFilters = {}, debounceDelay = 500) {
    const [filters, setFilters] = useState(initialFilters);
    const debouncedFilters = useDebounce(filters, debounceDelay);

    const updateFilter = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const countActiveFilters = useCallback((excludeKeys = []) => {
        return Object.entries(filters).filter(
            ([key, value]) => !excludeKeys.includes(key) && value !== '' && value !== null && value !== undefined
        ).length;
    }, [filters]);

    return {
        filters,
        debouncedFilters,
        setFilters,
        updateFilter,
        updateFilters,
        resetFilters,
        countActiveFilters
    };
}

/**
 * Hook para manejar modales
 * 
 * @param {boolean} initialState - Estado inicial del modal
 * @returns {object} - { isOpen, open, close, toggle }
 * 
 * @example
 * const modal = useModal();
 * 
 * <button onClick={modal.open}>Abrir Modal</button>
 * {modal.isOpen && <Modal onClose={modal.close}>Contenido</Modal>}
 */
export function useModal(initialState = false) {
    const [isOpen, setIsOpen] = useState(initialState);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen(prev => !prev), []);

    return { isOpen, open, close, toggle };
}

/**
 * Hook para manejar intervalos de forma segura
 * 
 * @param {function} callback - Función a ejecutar en cada intervalo
 * @param {number} delay - Delay en milisegundos (null para pausar)
 * 
 * @example
 * useInterval(() => {
 *   console.log('Ejecuta cada segundo');
 * }, 1000);
 */
export function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay !== null) {
            const interval = setInterval(() => savedCallback.current(), delay);
            return () => clearInterval(interval);
        }
    }, [delay]);
}

/**
 * Hook para detectar viewport size
 * 
 * @returns {object} - { width, height, isMobile, isTablet, isDesktop }
 * 
 * @example
 * const { isMobile, isDesktop } = useViewport();
 */
export function useViewport() {
    const [viewport, setViewport] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        ...viewport,
        isMobile: viewport.width < 768,
        isTablet: viewport.width >= 768 && viewport.width < 1024,
        isDesktop: viewport.width >= 1024
    };
}
