import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { citasAPI } from '../services/api';
import {
    FaCut, FaSignOutAlt, FaCalendarDay, FaClipboardList, FaChartLine,
    FaClock, FaMoneyBillWave, FaFilter, FaTimes, FaSearch, FaCheckCircle,
    FaTimesCircle, FaHourglassHalf, FaCheck, FaBan, FaInfoCircle,
    FaCalendarAlt, FaUser, FaDollarSign, FaChevronDown, FaChevronUp, FaSortAmountDown, FaSortAmountUp, FaSync
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import ToggleSwitch from '../components/ToggleSwitch';
import LayoutControl from '../components/LayoutControl';
import CitaCard from '../components/CitaCard';
import CitaCardSkeleton from '../components/CitaCardSkeleton';
import Pagination from '../components/Pagination';

export default function BarberoDashboard() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('hoy');

    const [citasHoy, setCitasHoy] = useState([]);
    const [citasPendientes, setCitasPendientes] = useState([]);
    const [citasConfirmadas, setCitasConfirmadas] = useState([]);
    const [todasCitas, setTodasCitas] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingHoy, setLoadingHoy] = useState(false);
    const [loadingPendientes, setLoadingPendientes] = useState(false);
    const [loadingConfirmadas, setLoadingConfirmadas] = useState(false);
    const [loadingHistorial, setLoadingHistorial] = useState(false);
    const [serviciosDisponibles, setServiciosDisponibles] = useState([]);

    // Layout y visualización
    const [layoutColumns, setLayoutColumns] = useState(() => {
        const saved = localStorage.getItem('barberoLayoutColumns');
        return saved ? parseInt(saved) : 2;
    });
    const [layoutSize, setLayoutSize] = useState(() => {
        return localStorage.getItem('barberoLayoutSize') || 'normal';
    });

    // Paginación
    const [currentPageHoy, setCurrentPageHoy] = useState(1);
    const [currentPagePendientes, setCurrentPagePendientes] = useState(1);
    const [currentPageConfirmadas, setCurrentPageConfirmadas] = useState(1);
    const [currentPageHistorial, setCurrentPageHistorial] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [customItemsPerPage, setCustomItemsPerPage] = useState(() => {
        const saved = localStorage.getItem('barberoItemsPerPage');
        return saved ? parseInt(saved) : null;
    });

    // Filtros para "Hoy"
    const [filtroHoyEstado, setFiltroHoyEstado] = useState('todas'); // 'todas', 'pendiente', 'confirmada', 'completada'
    const [ordenHoy, setOrdenHoy] = useState('asc'); // 'asc' o 'desc'

    // Toast notifications
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({message, type});
    };

    // Confirm modal
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        type: 'warning'
    });

    const showConfirm = (title, message, onConfirm, type = 'warning') => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            onConfirm,
            type
        });
    };

    const closeConfirm = () => {
        setConfirmModal({
            isOpen: false,
            title: '',
            message: '',
            onConfirm: null,
            type: 'warning'
        });
    };

    // Switch para gestión (Pendientes/Confirmadas)
    const [vistaGestion, setVistaGestion] = useState('left'); // 'left' = Pendientes, 'right' = Confirmadas

    // Estados para controlar si las listas de servicios están expandidas
    const [serviciosPendientesExpandido, setServiciosPendientesExpandido] = useState(false);
    const [serviciosConfirmadasExpandido, setServiciosConfirmadasExpandido] = useState(false);

    // Estados para controlar si los paneles de filtros están expandidos
    const [filtrosPendientesExpandido, setFiltrosPendientesExpandido] = useState(false);
    const [filtrosConfirmadasExpandido, setFiltrosConfirmadasExpandido] = useState(false);

    // Filtros para pendientes
    const [filtrosPendientes, setFiltrosPendientes] = useState({
        busqueda: '',
        ordenFecha: 'asc', // 'asc' = más reciente primero, 'desc' = más antigua primero
        servicios: [] // Array de servicios seleccionados
    });

    // Filtros para confirmadas
    const [filtrosConfirmadas, setFiltrosConfirmadas] = useState({
        busqueda: '',
        ordenFecha: 'asc',
        servicios: [] // Array de servicios seleccionados
    });

    // Filtros para historial (mantener los existentes)
    const [filtros, setFiltros] = useState(() => {
        const saved = localStorage.getItem('barberoFiltros');
        return saved ? JSON.parse(saved) : {
            fechaInicio: '',
            fechaFin: '',
            estado: '',
            busqueda: '',
            ordenFecha: 'desc' // desc = más recientes primero
        };
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [timerBusqueda, setTimerBusqueda] = useState(null);

    useEffect(() => {
        if (activeTab === 'hoy') {
            cargarCitasHoy();
        } else if (activeTab === 'pendientes') {
            if (vistaGestion === 'left') {
                cargarCitasPendientes();
            } else {
                cargarCitasConfirmadas();
            }
        } else if (activeTab === 'historial') {
            cargarTodasCitas();
        } else if (activeTab === 'estadisticas') {
            cargarEstadisticas();
        }
    }, [activeTab, vistaGestion]);

    // Extraer servicios únicos de todas las citas
    useEffect(() => {
        const todasLasCitas = [...citasPendientes, ...citasConfirmadas, ...citasHoy];
        const serviciosSet = new Set();

        todasLasCitas.forEach(cita => {
            if (cita.servicios) {
                // Dividir los servicios si están separados por coma
                const serviciosArray = cita.servicios.split(',').map(s => s.trim());
                serviciosArray.forEach(servicio => serviciosSet.add(servicio));
            }
        });

        setServiciosDisponibles(Array.from(serviciosSet).sort());
    }, [citasPendientes, citasConfirmadas, citasHoy]);

    const cargarCitasHoy = async () => {
        setLoadingHoy(true);
        try {
            const hoy = new Date().toISOString().split('T')[0];
            const response = await citasAPI.getCitasBarbero(user.idUsuario, null, hoy);
            setCitasHoy(response.data.data);
        } catch (error) {
            console.error('Error al cargar citas:', error);
            showToast('Error al cargar citas de hoy', 'error');
        } finally {
            setLoadingHoy(false);
        }
    };

    // Función para filtrar y ordenar citas de hoy
    const getCitasHoyFiltradas = () => {
        let citas = [...citasHoy];

        // Filtrar por estado
        if (filtroHoyEstado !== 'todas') {
            citas = citas.filter(c => c.estado === filtroHoyEstado);
        }

        // Ordenar por hora
        citas.sort((a, b) => {
            const horaA = a.horaIn || '00:00';
            const horaB = b.horaIn || '00:00';
            return ordenHoy === 'asc'
                ? horaA.localeCompare(horaB)
                : horaB.localeCompare(horaA);
        });

        return citas;
    };

    // Función para obtener el grid class según las columnas
    const getGridClass = () => {
        switch (layoutColumns) {
            case 1:
                return 'grid-cols-1';
            case 2:
                return 'grid-cols-1 lg:grid-cols-2';
            case 3:
                return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
            default:
                return 'grid-cols-1 lg:grid-cols-2';
        }
    };

    // Ajustar items por página según columnas y tamaño
    useEffect(() => {
        if (customItemsPerPage) {
            setItemsPerPage(customItemsPerPage);
            return;
        }
        
        let items = 12;
        if (layoutColumns === 1) {
            items = layoutSize === 'compact' ? 15 : layoutSize === 'comfortable' ? 8 : 10;
        } else if (layoutColumns === 2) {
            items = layoutSize === 'compact' ? 20 : layoutSize === 'comfortable' ? 12 : 16;
        } else if (layoutColumns === 3) {
            items = layoutSize === 'compact' ? 30 : layoutSize === 'comfortable' ? 18 : 24;
        }

        setItemsPerPage(items);
    }, [layoutColumns, layoutSize, customItemsPerPage]);

    // Persistir configuración de layout
    useEffect(() => {
        localStorage.setItem('barberoLayoutColumns', layoutColumns.toString());
    }, [layoutColumns]);

    useEffect(() => {
        localStorage.setItem('barberoLayoutSize', layoutSize);
    }, [layoutSize]);

    useEffect(() => {
        if (customItemsPerPage) {
            localStorage.setItem('barberoItemsPerPage', customItemsPerPage.toString());
        }
    }, [customItemsPerPage]);

    // Persistir filtros
    useEffect(() => {
        localStorage.setItem('barberoFiltros', JSON.stringify(filtros));
    }, [filtros]);

    // Búsqueda con debounce en historial
    useEffect(() => {
        if (activeTab === 'historial') {
            if (timerBusqueda) {
                clearTimeout(timerBusqueda);
            }
            
            const timer = setTimeout(() => {
                cargarTodasCitas();
            }, 500);
            
            setTimerBusqueda(timer);
            
            return () => clearTimeout(timer);
        }
    }, [filtros, activeTab]);

    // Función de paginación genérica
    const paginate = (items, currentPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    };

    // Obtener items paginados para cada sección
    const getCitasHoyPaginadas = () => paginate(getCitasHoyFiltradas(), currentPageHoy);
    const getCitasPendientesPaginadas = () => paginate(filtrarYOrdenarPendientes(), currentPagePendientes);
    const getCitasConfirmadasPaginadas = () => paginate(filtrarYOrdenarConfirmadas(), currentPageConfirmadas);

    // Función para obtener citas filtradas del historial
    const getCitasHistorialFiltradas = () => {
        let citas = [...todasCitas];

        // Aplicar filtros si existen
        if (filtros?.fechaInicio) {
            citas = citas.filter(c => c.fecha >= filtros.fechaInicio);
        }
        if (filtros?.fechaFin) {
            citas = citas.filter(c => c.fecha <= filtros.fechaFin);
        }
        if (filtros?.estado) {
            citas = citas.filter(c => c.estado === filtros.estado);
        }
        if (filtros?.busqueda) {
            const busqueda = filtros.busqueda.toLowerCase();
            citas = citas.filter(c =>
                c.nombreCliente?.toLowerCase().includes(busqueda) ||
                c.servicios?.toLowerCase().includes(busqueda)
            );
        }

        return citas;
    };

    const getCitasHistorialPaginadas = () => paginate(getCitasHistorialFiltradas(), currentPageHistorial);

    // Calcular total de páginas
    const getTotalPages = (totalItems) => Math.ceil(totalItems / itemsPerPage) || 1;

    const cargarCitasPendientes = async () => {
        setLoadingPendientes(true);
        try {
            const response = await citasAPI.getCitasBarbero(user.idUsuario);
            const pendientes = response.data.data.filter(c => c.estado === 'pendiente');
            setCitasPendientes(pendientes);
        } catch (error) {
            console.error('Error al cargar citas pendientes:', error);
            showToast('Error al cargar citas pendientes', 'error');
        } finally {
            setLoadingPendientes(false);
        }
    };

    const cargarCitasConfirmadas = async () => {
        setLoadingConfirmadas(true);
        try {
            const response = await citasAPI.getCitasBarbero(user.idUsuario);
            const confirmadas = response.data.data.filter(c => c.estado === 'confirmada');
            setCitasConfirmadas(confirmadas);
        } catch (error) {
            console.error('Error al cargar citas confirmadas:', error);
            showToast('Error al cargar citas confirmadas', 'error');
        } finally {
            setLoadingConfirmadas(false);
        }
    };

    const cargarTodasCitas = async () => {
        setLoadingHistorial(true);
        try {
            const response = await citasAPI.getCitasBarbero(user.idUsuario);
            let citas = response.data.data;

            // Aplicar filtros
            if (filtros.fechaInicio) {
                citas = citas.filter(c => c.fecha >= filtros.fechaInicio);
            }
            if (filtros.fechaFin) {
                citas = citas.filter(c => c.fecha <= filtros.fechaFin);
            }
            if (filtros.estado) {
                citas = citas.filter(c => c.estado === filtros.estado);
            }
            if (filtros.busqueda) {
                const busqueda = filtros.busqueda.toLowerCase();
                citas = citas.filter(c =>
                    c.nombreCliente?.toLowerCase().includes(busqueda) ||
                    c.servicios?.toLowerCase().includes(busqueda)
                );
            }

            // Ordenar por fecha
            citas.sort((a, b) => {
                const fechaA = new Date(a.fecha + 'T' + (a.horaIn || '00:00:00'));
                const fechaB = new Date(b.fecha + 'T' + (b.horaIn || '00:00:00'));
                return filtros.ordenFecha === 'desc' ? fechaB - fechaA : fechaA - fechaB;
            });

            setTodasCitas(citas);
        } catch (error) {
            console.error('Error al cargar historial:', error);
            showToast('Error al cargar historial', 'error');
        } finally {
            setLoadingHistorial(false);
        }
    };

    const cargarEstadisticas = async () => {
        try {
            const response = await citasAPI.getCitasBarbero(user.idUsuario);
            const citas = response.data.data;

            const stats = {
                totalCitas: citas.length,
                pendientes: citas.filter(c => c.estado === 'pendiente').length,
                confirmadas: citas.filter(c => c.estado === 'confirmada').length,
                completadas: citas.filter(c => c.estado === 'completada').length,
                canceladas: citas.filter(c => c.estado === 'cancelada').length,
                ingresoTotal: citas
                    .filter(c => c.estado === 'completada')
                    .reduce((sum, c) => sum + (parseFloat(c.total) || 0), 0),
                comisionTotal: citas
                    .filter(c => c.estado === 'completada')
                    .reduce((sum, c) => sum + (parseFloat(c.total) || 0) * (parseFloat(user.comision) || 0) / 100, 0)
            };

            setEstadisticas(stats);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const handleConfirmarCita = async (idCita) => {
        showConfirm(
            '¿Confirmar esta cita?',
            'El cliente será notificado de que has aceptado su solicitud.',
            async () => {
                setLoading(true);
                try {
                    await citasAPI.confirmarCita(idCita);
                    showToast('Cita confirmada exitosamente', 'success');
                    
                    // Actualizar el estado local inmediatamente
                    // Mover la cita de pendientes a confirmadas
                    const citaConfirmada = citasPendientes.find(c => c.idCita === idCita);
                    if (citaConfirmada) {
                        // Actualizar estado de la cita
                        const citaActualizada = { ...citaConfirmada, estado: 'confirmada' };
                        
                        // Remover de pendientes
                        setCitasPendientes(prev => prev.filter(c => c.idCita !== idCita));
                        
                        // Agregar a confirmadas
                        setCitasConfirmadas(prev => [citaActualizada, ...prev]);
                        
                        // Actualizar en citasHoy si existe
                        setCitasHoy(prev => prev.map(c => 
                            c.idCita === idCita ? citaActualizada : c
                        ));
                        
                        // Actualizar estadísticas
                        if (estadisticas) {
                            setEstadisticas(prev => ({
                                ...prev,
                                pendientes: prev.pendientes - 1
                            }));
                        }
                    }
                } catch (error) {
                    console.error('Error al confirmar cita:', error);
                    showToast(error.response?.data?.message || 'Error al confirmar cita', 'error');
                } finally {
                    setLoading(false);
                }
            },
            'success'
        );
    };

    const handleRechazarCita = async (idCita) => {
        showConfirm(
            '¿Rechazar esta cita?',
            'Esta acción cancelará la cita y el cliente será notificado.',
            async () => {
                setLoading(true);
                try {
                    await citasAPI.rechazarCita(idCita);
                    showToast('Cita rechazada', 'success');
                    
                    // Actualizar el estado local inmediatamente
                    // Remover de pendientes o confirmadas según corresponda
                    if (vistaGestion === 'left') {
                        setCitasPendientes(prev => prev.filter(c => c.idCita !== idCita));
                    } else {
                        setCitasConfirmadas(prev => prev.filter(c => c.idCita !== idCita));
                    }
                    
                    // Remover de citasHoy si existe
                    setCitasHoy(prev => prev.filter(c => c.idCita !== idCita));
                    
                    // Actualizar estadísticas
                    if (estadisticas) {
                        setEstadisticas(prev => ({
                            ...prev,
                            canceladas: prev.canceladas + 1,
                            [vistaGestion === 'left' ? 'pendientes' : 'confirmadas']: 
                                prev[vistaGestion === 'left' ? 'pendientes' : 'confirmadas'] - 1
                        }));
                    }
                } catch (error) {
                    console.error('Error al rechazar cita:', error);
                    showToast(error.response?.data?.message || 'Error al rechazar cita', 'error');
                } finally {
                    setLoading(false);
                }
            },
            'danger'
        );
    };

    const handleCompletarCita = async (idCita) => {
        showConfirm(
            '¿Marcar como completada?',
            'Confirma que esta cita se ha realizado exitosamente.',
            async () => {
                setLoading(true);
                try {
                    await citasAPI.completarCita(idCita);
                    showToast('Cita completada exitosamente', 'success');
                    
                    // Actualizar el estado local inmediatamente
                    const citaCompletada = citasConfirmadas.find(c => c.idCita === idCita);
                    if (citaCompletada) {
                        // Actualizar estado de la cita
                        const citaActualizada = { ...citaCompletada, estado: 'completada' };
                        
                        // Remover de confirmadas
                        setCitasConfirmadas(prev => prev.filter(c => c.idCita !== idCita));
                        
                        // Actualizar en citasHoy si existe
                        setCitasHoy(prev => prev.map(c => 
                            c.idCita === idCita ? citaActualizada : c
                        ));
                        
                        // Actualizar estadísticas
                        if (estadisticas) {
                            setEstadisticas(prev => ({
                                ...prev,
                                completadas: prev.completadas + 1,
                                confirmadas: prev.confirmadas - 1
                            }));
                        }
                    }
                } catch (error) {
                    console.error('Error al completar cita:', error);
                    showToast(error.response?.data?.message || 'Error al completar cita', 'error');
                } finally {
                    setLoading(false);
                }
            },
            'success'
        );
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Funciones para manejar selección de servicios
    const toggleServicioPendientes = (servicio) => {
        setFiltrosPendientes(prev => ({
            ...prev,
            servicios: prev.servicios.includes(servicio)
                ? prev.servicios.filter(s => s !== servicio)
                : [...prev.servicios, servicio]
        }));
    };

    const toggleServicioConfirmadas = (servicio) => {
        setFiltrosConfirmadas(prev => ({
            ...prev,
            servicios: prev.servicios.includes(servicio)
                ? prev.servicios.filter(s => s !== servicio)
                : [...prev.servicios, servicio]
        }));
    };

    // Funciones de filtrado para pendientes
    const filtrarYOrdenarPendientes = () => {
        let citasFiltradas = [...citasPendientes];

        // Filtro por búsqueda (nombre o cédula)
        if (filtrosPendientes.busqueda) {
            citasFiltradas = citasFiltradas.filter(c =>
                c.nombreCliente?.toLowerCase().includes(filtrosPendientes.busqueda.toLowerCase()) ||
                c.cedulaCliente?.includes(filtrosPendientes.busqueda) ||
                c.cedula?.includes(filtrosPendientes.busqueda)
            );
        }

        // Filtro por servicios (si hay servicios seleccionados)
        if (filtrosPendientes.servicios.length > 0) {
            citasFiltradas = citasFiltradas.filter(c => {
                const serviciosCita = c.servicios?.split(',').map(s => s.trim()) || [];
                // La cita debe tener al menos uno de los servicios seleccionados
                return filtrosPendientes.servicios.some(servicioSeleccionado =>
                    serviciosCita.some(servicioCita =>
                        servicioCita.toLowerCase().includes(servicioSeleccionado.toLowerCase())
                    )
                );
            });
        }

        // Ordenar por fecha
        citasFiltradas.sort((a, b) => {
            const fechaA = new Date(`${a.fecha} ${a.horaIn}`);
            const fechaB = new Date(`${b.fecha} ${b.horaIn}`);
            return filtrosPendientes.ordenFecha === 'asc' ? fechaA - fechaB : fechaB - fechaA;
        });

        return citasFiltradas;
    };

    // Funciones de filtrado para confirmadas
    const filtrarYOrdenarConfirmadas = () => {
        let citasFiltradas = [...citasConfirmadas];

        // Filtro por búsqueda (nombre o cédula)
        if (filtrosConfirmadas.busqueda) {
            citasFiltradas = citasFiltradas.filter(c =>
                c.nombreCliente?.toLowerCase().includes(filtrosConfirmadas.busqueda.toLowerCase()) ||
                c.cedulaCliente?.includes(filtrosConfirmadas.busqueda) ||
                c.cedula?.includes(filtrosConfirmadas.busqueda)
            );
        }

        // Filtro por servicios (si hay servicios seleccionados)
        if (filtrosConfirmadas.servicios.length > 0) {
            citasFiltradas = citasFiltradas.filter(c => {
                const serviciosCita = c.servicios?.split(',').map(s => s.trim()) || [];
                // La cita debe tener al menos uno de los servicios seleccionados
                return filtrosConfirmadas.servicios.some(servicioSeleccionado =>
                    serviciosCita.some(servicioCita =>
                        servicioCita.toLowerCase().includes(servicioSeleccionado.toLowerCase())
                    )
                );
            });
        }

        // Ordenar por fecha
        citasFiltradas.sort((a, b) => {
            const fechaA = new Date(`${a.fecha} ${a.horaIn}`);
            const fechaB = new Date(`${b.fecha} ${b.horaIn}`);
            return filtrosConfirmadas.ordenFecha === 'asc' ? fechaA - fechaB : fechaB - fechaA;
        });

        return citasFiltradas;
    };

    const limpiarFiltros = () => {
        setFiltros({
            fechaInicio: '',
            fechaFin: '',
            estado: '',
            busqueda: '',
            ordenFecha: 'desc'
        });
    };

    const contarFiltrosActivos = () => {
        // No contar ordenFecha como filtro activo
        const { ordenFecha, ...filtrosParaContar } = filtros;
        return Object.values(filtrosParaContar).filter(v => v !== '').length;
    };

    // Calcular estadísticas del historial filtrado
    const calcularEstadisticasHistorial = () => {
        const completadas = todasCitas.filter(c => c.estado === 'completada').length;
        const canceladas = todasCitas.filter(c => c.estado === 'cancelada').length;
        const ingresoTotal = todasCitas
            .filter(c => c.estado === 'completada')
            .reduce((sum, c) => sum + (parseFloat(c.total) || 0), 0);

        return {completadas, canceladas, ingresoTotal};
    };

    const statsHistorial = activeTab === 'historial' && todasCitas.length > 0
        ? calcularEstadisticasHistorial()
        : null;

        return (
            <div className="min-h-screen bg-barber-pattern">
                {/* Header */}
                <header className="header-retro">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-lg">
                                    <img
                                        src="/images/logo-icon.png"
                                        alt="BarberEz"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">BarberEz</h1>
                                    <p className="text-sm text-white/80">Panel del Barbero</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-semibold">{user?.nombre}</p>
                                    <p className="text-xs text-white/80">
                                        Barbero {user?.comision && `(${user.comision}% comisión)`}
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
                                >
                                    <FaSignOutAlt size={18}/>
                                    <span className="hidden md:inline">Salir</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab('hoy')}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                activeTab === 'hoy'
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <FaCalendarDay size={18}/>
                            <span>Hoy</span>
                            {citasHoy.length > 0 && (
                                <span className="bg-gold text-white text-xs font-bold px-2 py-1 rounded-full">
                                {citasHoy.length}
                            </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('pendientes')}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                activeTab === 'pendientes'
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <FaClipboardList size={18}/>
                            <span>Pendientes</span>
                            {citasPendientes.length > 0 && (
                                <span className="bg-gold text-white text-xs font-bold px-2 py-1 rounded-full">
                                {citasPendientes.length}
                            </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('historial')}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                activeTab === 'historial'
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <FaCalendarAlt size={18}/>
                            <span>Historial</span>
                            {contarFiltrosActivos() > 0 && (
                                <span className="bg-gold text-white text-xs font-bold px-2 py-1 rounded-full">
                                {contarFiltrosActivos()}
                            </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('estadisticas')}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                activeTab === 'estadisticas'
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <FaChartLine size={18}/>
                            <span>Estadísticas</span>
                        </button>
                    </div>

                    {/* CITAS DE HOY */}
                    {activeTab === 'hoy' && (
                        <div className="space-y-4 animate-fadeIn">
                            {/* LayoutControl */}
                            <LayoutControl
                                columns={layoutColumns}
                                onColumnsChange={setLayoutColumns}
                                size={layoutSize}
                                onSizeChange={setLayoutSize}
                                itemsPerPage={customItemsPerPage || itemsPerPage}
                                onItemsPerPageChange={setCustomItemsPerPage}
                                totalItems={getCitasHoyFiltradas().length}
                            />

                            {/* Header */}
                            <div className="card">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <FaCalendarDay className="w-7 h-7 text-primary"/>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Citas de Hoy
                                        </h2>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {new Date().toLocaleDateString('es-CO', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>

                                {/* Filtros Deslizables */}
                                <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* Filtro por Estado */}
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-semibold text-gray-700">Estado:</span>
                                            <div className="flex bg-white rounded-lg shadow-sm overflow-hidden">
                                                <button
                                                    onClick={() => setFiltroHoyEstado('todas')}
                                                    className={`px-3 py-1.5 text-sm font-medium transition-all ${
                                                        filtroHoyEstado === 'todas'
                                                            ? 'bg-gray-600 text-white'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    Todas
                                                </button>
                                                <button
                                                    onClick={() => setFiltroHoyEstado('pendiente')}
                                                    className={`px-3 py-1.5 text-sm font-medium transition-all ${
                                                        filtroHoyEstado === 'pendiente'
                                                            ? 'bg-yellow-500 text-white'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    Pendientes
                                                    <span className="ml-1.5 px-1.5 py-0.5 bg-white bg-opacity-30 rounded text-xs">
                                                        {citasHoy.filter(c => c.estado === 'pendiente').length}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => setFiltroHoyEstado('confirmada')}
                                                    className={`px-3 py-1.5 text-sm font-medium transition-all ${
                                                        filtroHoyEstado === 'confirmada'
                                                            ? 'bg-blue-500 text-white'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    Confirmadas
                                                    <span className="ml-1.5 px-1.5 py-0.5 bg-white bg-opacity-30 rounded text-xs">
                                                        {citasHoy.filter(c => c.estado === 'confirmada').length}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => setFiltroHoyEstado('completada')}
                                                    className={`px-3 py-1.5 text-sm font-medium transition-all ${
                                                        filtroHoyEstado === 'completada'
                                                            ? 'bg-green-500 text-white'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    Completadas
                                                    <span className="ml-1.5 px-1.5 py-0.5 bg-white bg-opacity-30 rounded text-xs">
                                                        {citasHoy.filter(c => c.estado === 'completada').length}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Ordenamiento */}
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-semibold text-gray-700">Orden:</span>
                                            <button
                                                onClick={() => setOrdenHoy(ordenHoy === 'asc' ? 'desc' : 'asc')}
                                                className="flex items-center space-x-1 px-3 py-1.5 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                                            >
                                                {ordenHoy === 'asc' ? (
                                                    <>
                                                        <FaSortAmountDown size={14} />
                                                        <span>Temprano → Tarde</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaSortAmountUp size={14} />
                                                        <span>Tarde → Temprano</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Contador */}
                                        <div className="ml-auto text-sm font-semibold text-gray-700">
                                            {getCitasHoyFiltradas().length} cita{getCitasHoyFiltradas().length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lista de Citas */}
                            <div className="card">
                                {loadingHoy ? (
                                    <div className={`grid ${getGridClass()} gap-3`}>
                                        <CitaCardSkeleton size={layoutSize} count={itemsPerPage} />
                                    </div>
                                ) : getCitasHoyFiltradas().length === 0 ? (
                                    <div className="text-center py-12">
                                        <FaCalendarDay className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                                        <p className="text-gray-500 text-lg">
                                            {filtroHoyEstado === 'todas'
                                                ? 'No tienes citas programadas para hoy'
                                                : `No tienes citas ${filtroHoyEstado}s para hoy`
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`grid ${getGridClass()} gap-3`}>
                                            {getCitasHoyPaginadas().map(cita => (
                                                <CitaCard
                                                    key={cita.idCita}
                                                    cita={cita}
                                                    size={layoutSize}
                                                    onConfirmar={handleConfirmarCita}
                                                    onRechazar={handleRechazarCita}
                                                    onCompletar={handleCompletarCita}
                                                    loading={loading}
                                                    userComision={user.comision}
                                                />
                                            ))}
                                        </div>

                                        {/* Paginación Condicional */}
                                        {getCitasHoyFiltradas().length > itemsPerPage && (
                                            <Pagination
                                                currentPage={currentPageHoy}
                                                totalPages={getTotalPages(getCitasHoyFiltradas().length)}
                                                onPageChange={setCurrentPageHoy}
                                                itemsPerPage={itemsPerPage}
                                                totalItems={getCitasHoyFiltradas().length}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* GESTIÓN DE CITAS - CON SWITCH COMO EN ADMIN */}
                    {activeTab === 'pendientes' && (
                        <div className="animate-fadeIn">
                            {/* Header con ToggleSwitch */}
                            <div className="card mb-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-center space-x-3">
                                        <FaClipboardList className="w-7 h-7 text-primary"/>
                                        <h2 className="text-2xl font-bold text-gray-800">Gestión de Citas</h2>
                                    </div>
                                    <ToggleSwitch
                                        leftLabel="Por Confirmar"
                                        rightLabel="Por Completar"
                                        isRight={vistaGestion === 'right'}
                                        onToggle={isRight => setVistaGestion(isRight ? 'right' : 'left')}
                                    />
                                </div>
                            </div>

                            {/* Vista: Pendientes por confirmar */}
                            {vistaGestion === 'left' && (
                                <div className="space-y-4 animate-slideInLeft">
                                    {/* Control de Layout */}
                                    <LayoutControl
                                        columns={layoutColumns}
                                        onColumnsChange={setLayoutColumns}
                                        size={layoutSize}
                                        onSizeChange={setLayoutSize}
                                        itemsPerPage={customItemsPerPage || itemsPerPage}
                                        onItemsPerPageChange={setCustomItemsPerPage}
                                        totalItems={citasPendientes.length}
                                    />

                                    {/* Panel de Filtros Contraíble - Versión Compacta */}
                                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg shadow-sm">
                                        <button
                                            onClick={() => setFiltrosPendientesExpandido(!filtrosPendientesExpandido)}
                                            className="w-full flex items-center justify-between hover:bg-yellow-100 px-3 py-2 rounded-lg transition-colors"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <FaFilter className="w-4 h-4 text-yellow-600"/>
                                                <span className="text-sm font-bold text-gray-800">Filtros</span>
                                                {(filtrosPendientes.busqueda || filtrosPendientes.servicios.length > 0) && (
                                                    <span className="px-1.5 py-0.5 bg-yellow-500 text-white text-xs rounded-full font-semibold">
                                                        {(filtrosPendientes.busqueda ? 1 : 0) + filtrosPendientes.servicios.length}
                                                    </span>
                                                )}
                                            </div>
                                            {filtrosPendientesExpandido ? (
                                                <FaChevronUp className="w-4 h-4 text-yellow-600" />
                                            ) : (
                                                <FaChevronDown className="w-4 h-4 text-yellow-600" />
                                            )}
                                        </button>

                                        {filtrosPendientesExpandido && (
                                            <div className="px-3 pb-3 pt-2 animate-fadeIn border-t border-yellow-200">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                            <FaSearch className="inline w-3 h-3 mr-1"/> Buscar
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Nombre o cédula..."
                                                            value={filtrosPendientes.busqueda}
                                                            onChange={(e) => setFiltrosPendientes({...filtrosPendientes, busqueda: e.target.value})}
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                            <FaClock className="inline w-3 h-3 mr-1"/> Ordenar
                                                        </label>
                                                        <select
                                                            value={filtrosPendientes.ordenFecha}
                                                            onChange={(e) => setFiltrosPendientes({...filtrosPendientes, ordenFecha: e.target.value})}
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                                        >
                                                            <option value="asc">Más próximas</option>
                                                            <option value="desc">Más lejanas</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                            <FaCut className="inline w-3 h-3 mr-1"/> Servicios
                                                        </label>
                                                        <button
                                                            onClick={() => setServiciosPendientesExpandido(!serviciosPendientesExpandido)}
                                                            className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-2 py-1.5 hover:border-yellow-400 transition-colors"
                                                        >
                                                            <span className="text-xs font-medium text-gray-700 truncate">
                                                                {filtrosPendientes.servicios.length > 0
                                                                    ? `${filtrosPendientes.servicios.length} seleccionado(s)`
                                                                    : 'Seleccionar'}
                                                            </span>
                                                            {serviciosPendientesExpandido ? (
                                                                <FaChevronUp className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1" />
                                                            ) : (
                                                                <FaChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1" />
                                                            )}
                                                        </button>

                                                        {serviciosPendientesExpandido && (
                                                            <div className="mt-1.5 bg-white border border-gray-300 rounded-lg p-2 max-h-40 overflow-y-auto custom-scrollbar shadow-lg animate-fadeIn">
                                                                {serviciosDisponibles.length === 0 ? (
                                                                    <p className="text-xs text-gray-500 italic">No hay servicios</p>
                                                                ) : (
                                                                    <div className="space-y-1">
                                                                        {serviciosDisponibles.map(servicio => (
                                                                            <label key={servicio} className="flex items-center space-x-1.5 cursor-pointer hover:bg-yellow-50 px-1.5 py-1 rounded transition-colors">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={filtrosPendientes.servicios.includes(servicio)}
                                                                                    onChange={() => toggleServicioPendientes(servicio)}
                                                                                    className="w-3.5 h-3.5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                                                                                />
                                                                                <span className="text-xs text-gray-700">{servicio}</span>
                                                                            </label>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {filtrosPendientes.servicios.length > 0 && (
                                                            <button
                                                                onClick={() => setFiltrosPendientes({...filtrosPendientes, servicios: []})}
                                                                className="text-xs text-yellow-600 hover:text-yellow-800 font-semibold mt-1 flex items-center space-x-1"
                                                            >
                                                                <FaTimes className="w-2.5 h-2.5" />
                                                                <span>Limpiar</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Lista de pendientes por confirmar */}
                                    <div className="card">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <FaHourglassHalf className="w-6 h-6 text-yellow-600"/>
                                                <h3 className="text-xl font-bold text-gray-800">Pendientes de Confirmación</h3>
                                            </div>
                                            <span className="badge badge-warning text-base px-3 py-1.5">{filtrarYOrdenarPendientes().length}</span>
                                        </div>
                                        {loadingPendientes ? (
                                            <div className={`grid ${getGridClass()} gap-3`}>
                                                <CitaCardSkeleton size={layoutSize} count={itemsPerPage} />
                                            </div>
                                        ) : filtrarYOrdenarPendientes().length === 0 ? (
                                            <div className="text-center py-12">
                                                <FaClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                                                <p className="text-gray-500 text-lg">
                                                    {citasPendientes.length === 0
                                                        ? 'No hay citas pendientes de confirmación'
                                                        : 'No se encontraron resultados con los filtros aplicados'
                                                    }
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={`grid ${getGridClass()} gap-3`}>
                                                    {getCitasPendientesPaginadas().map(cita => (
                                                        <CitaCard
                                                            key={cita.idCita}
                                                            cita={cita}
                                                            size={layoutSize}
                                                            onConfirmar={handleConfirmarCita}
                                                            onRechazar={handleRechazarCita}
                                                            onCompletar={handleCompletarCita}
                                                            loading={loading}
                                                            userComision={user.comision}
                                                        />
                                                    ))}
                                                </div>

                                                {/* Paginación Condicional */}
                                                {filtrarYOrdenarPendientes().length > itemsPerPage && (
                                                    <Pagination
                                                        currentPage={currentPagePendientes}
                                                        totalPages={getTotalPages(filtrarYOrdenarPendientes().length)}
                                                        onPageChange={setCurrentPagePendientes}
                                                        itemsPerPage={itemsPerPage}
                                                        totalItems={filtrarYOrdenarPendientes().length}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Vista: Pendientes por completar */}
                            {vistaGestion === 'right' && (
                                <div className="space-y-4 animate-slideInRight">
                                    {/* Control de Layout */}
                                    <LayoutControl
                                        columns={layoutColumns}
                                        onColumnsChange={setLayoutColumns}
                                        size={layoutSize}
                                        onSizeChange={setLayoutSize}
                                        itemsPerPage={customItemsPerPage || itemsPerPage}
                                        onItemsPerPageChange={setCustomItemsPerPage}
                                        totalItems={citasConfirmadas.length}
                                    />

                                    {/* Panel de Filtros Contraíble - Versión Compacta */}
                                    <div className="bg-blue-50 border border-blue-300 rounded-lg shadow-sm">
                                        <button
                                            onClick={() => setFiltrosConfirmadasExpandido(!filtrosConfirmadasExpandido)}
                                            className="w-full flex items-center justify-between hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <FaFilter className="w-4 h-4 text-blue-600"/>
                                                <span className="text-sm font-bold text-gray-800">Filtros</span>
                                                {(filtrosConfirmadas.busqueda || filtrosConfirmadas.servicios.length > 0) && (
                                                    <span className="px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full font-semibold">
                                                        {(filtrosConfirmadas.busqueda ? 1 : 0) + filtrosConfirmadas.servicios.length}
                                                    </span>
                                                )}
                                            </div>
                                            {filtrosConfirmadasExpandido ? (
                                                <FaChevronUp className="w-4 h-4 text-blue-600" />
                                            ) : (
                                                <FaChevronDown className="w-4 h-4 text-blue-600" />
                                            )}
                                        </button>

                                        {filtrosConfirmadasExpandido && (
                                            <div className="px-3 pb-3 pt-2 animate-fadeIn border-t border-blue-200">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                            <FaSearch className="inline w-3 h-3 mr-1"/> Buscar
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Nombre o cédula..."
                                                            value={filtrosConfirmadas.busqueda}
                                                            onChange={(e) => setFiltrosConfirmadas({...filtrosConfirmadas, busqueda: e.target.value})}
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                            <FaClock className="inline w-3 h-3 mr-1"/> Ordenar
                                                        </label>
                                                        <select
                                                            value={filtrosConfirmadas.ordenFecha}
                                                            onChange={(e) => setFiltrosConfirmadas({...filtrosConfirmadas, ordenFecha: e.target.value})}
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                                        >
                                                            <option value="asc">Más próximas</option>
                                                            <option value="desc">Más lejanas</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                            <FaCut className="inline w-3 h-3 mr-1"/> Servicios
                                                        </label>
                                                        <button
                                                            onClick={() => setServiciosConfirmadasExpandido(!serviciosConfirmadasExpandido)}
                                                            className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-2 py-1.5 hover:border-blue-400 transition-colors"
                                                        >
                                                            <span className="text-xs font-medium text-gray-700 truncate">
                                                                {filtrosConfirmadas.servicios.length > 0
                                                                    ? `${filtrosConfirmadas.servicios.length} seleccionado(s)`
                                                                    : 'Seleccionar'}
                                                            </span>
                                                            {serviciosConfirmadasExpandido ? (
                                                                <FaChevronUp className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1" />
                                                            ) : (
                                                                <FaChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1" />
                                                            )}
                                                        </button>

                                                        {serviciosConfirmadasExpandido && (
                                                            <div className="mt-1.5 bg-white border border-gray-300 rounded-lg p-2 max-h-40 overflow-y-auto custom-scrollbar shadow-lg animate-fadeIn">
                                                                {serviciosDisponibles.length === 0 ? (
                                                                    <p className="text-xs text-gray-500 italic">No hay servicios</p>
                                                                ) : (
                                                                    <div className="space-y-1">
                                                                        {serviciosDisponibles.map(servicio => (
                                                                            <label key={servicio} className="flex items-center space-x-1.5 cursor-pointer hover:bg-blue-50 px-1.5 py-1 rounded transition-colors">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={filtrosConfirmadas.servicios.includes(servicio)}
                                                                                    onChange={() => toggleServicioConfirmadas(servicio)}
                                                                                    className="w-3.5 h-3.5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                                                                                />
                                                                                <span className="text-xs text-gray-700">{servicio}</span>
                                                                            </label>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {filtrosConfirmadas.servicios.length > 0 && (
                                                            <button
                                                                onClick={() => setFiltrosConfirmadas({...filtrosConfirmadas, servicios: []})}
                                                                className="text-xs text-blue-600 hover:text-blue-800 font-semibold mt-1 flex items-center space-x-1"
                                                            >
                                                                <FaTimes className="w-2.5 h-2.5" />
                                                                <span>Limpiar</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Lista de pendientes por completar */}
                                    <div className="card">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <FaCheckCircle className="w-6 h-6 text-blue-600"/>
                                                <h3 className="text-xl font-bold text-gray-800">Pendientes por Completar</h3>
                                            </div>
                                            <span className="badge badge-info text-base px-3 py-1.5">{filtrarYOrdenarConfirmadas().length}</span>
                                        </div>
                                        {loadingConfirmadas ? (
                                            <div className={`grid ${getGridClass()} gap-3`}>
                                                <CitaCardSkeleton size={layoutSize} count={itemsPerPage} />
                                            </div>
                                        ) : filtrarYOrdenarConfirmadas().length === 0 ? (
                                            <div className="text-center py-12">
                                                <FaCheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                                                <p className="text-gray-500 text-lg">
                                                    {citasConfirmadas.length === 0
                                                        ? 'No hay citas pendientes por completar'
                                                        : 'No se encontraron resultados con los filtros aplicados'
                                                    }
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={`grid ${getGridClass()} gap-3`}>
                                                    {getCitasConfirmadasPaginadas().map(cita => (
                                                        <CitaCard
                                                            key={cita.idCita}
                                                            cita={cita}
                                                            size={layoutSize}
                                                            onConfirmar={handleConfirmarCita}
                                                            onRechazar={handleRechazarCita}
                                                            onCompletar={handleCompletarCita}
                                                            loading={loading}
                                                            userComision={user.comision}
                                                        />
                                                    ))}
                                                </div>

                                                {/* Paginación Condicional */}
                                                {filtrarYOrdenarConfirmadas().length > itemsPerPage && (
                                                    <Pagination
                                                        currentPage={currentPageConfirmadas}
                                                        totalPages={getTotalPages(filtrarYOrdenarConfirmadas().length)}
                                                        onPageChange={setCurrentPageConfirmadas}
                                                        itemsPerPage={itemsPerPage}
                                                        totalItems={filtrarYOrdenarConfirmadas().length}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* HISTORIAL */}
                    {activeTab === 'historial' && (
                        <div className="space-y-6 animate-fadeIn">
                            {/* Control de Layout */}
                            <LayoutControl
                                columns={layoutColumns}
                                onColumnsChange={setLayoutColumns}
                                size={layoutSize}
                                onSizeChange={setLayoutSize}
                                itemsPerPage={customItemsPerPage || itemsPerPage}
                                onItemsPerPageChange={setCustomItemsPerPage}
                                totalItems={getCitasHistorialFiltradas().length}
                            />

                            {/* Barra de búsqueda y filtros */}
                            <div className="card">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <FaSearch
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                        <input
                                            type="text"
                                            value={filtros.busqueda}
                                            onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                                            placeholder="Buscar por cliente o servicio..."
                                            className="input-field pl-10 pr-10"
                                        />
                                        {filtros.busqueda && (
                                            <button
                                                onClick={() => setFiltros({...filtros, busqueda: ''})}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                <FaTimes size={18}/>
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        onClick={cargarTodasCitas}
                                        className="btn-primary flex items-center space-x-2 px-6"
                                    >
                                        <FaSearch/>
                                        <span>Buscar</span>
                                    </button>
                                    <button
                                        onClick={() => setMostrarFiltros(!mostrarFiltros)}
                                        className="btn-secondary flex items-center space-x-2 px-6"
                                    >
                                        <FaFilter/>
                                        <span>Filtros</span>
                                        {contarFiltrosActivos() > 0 && (
                                            <span
                                                className="bg-white text-secondary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                                            {contarFiltrosActivos()}
                                        </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Panel de filtros */}
                            {mostrarFiltros && (
                                <div className="filter-container animate-fadeIn">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                                            <FaFilter className="text-primary"/>
                                            <span>Filtros</span>
                                        </h3>
                                        <button
                                            onClick={limpiarFiltros}
                                            className="text-sm text-primary hover:text-secondary font-semibold flex items-center space-x-1"
                                        >
                                            <FaTimes size={16}/>
                                            <span>Limpiar</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Estado
                                            </label>
                                            <select
                                                value={filtros.estado}
                                                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                                                className="input-field"
                                            >
                                                <option value="">Todos</option>
                                                <option value="pendiente">Pendiente</option>
                                                <option value="confirmada">Confirmada</option>
                                                <option value="completada">Completada</option>
                                                <option value="cancelada">Cancelada</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Desde
                                            </label>
                                            <input
                                                type="date"
                                                value={filtros.fechaInicio}
                                                onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
                                                className="input-field"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Hasta
                                            </label>
                                            <input
                                                type="date"
                                                value={filtros.fechaFin}
                                                onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
                                                className="input-field"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <FaClock className="inline mr-1" />
                                                Ordenar por Fecha
                                            </label>
                                            <select
                                                value={filtros.ordenFecha}
                                                onChange={(e) => setFiltros({...filtros, ordenFecha: e.target.value})}
                                                className="input-field"
                                            >
                                                <option value="desc">Más recientes primero</option>
                                                <option value="asc">Más antiguos primero</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button onClick={limpiarFiltros} className="btn-outline">
                                            Limpiar
                                        </button>
                                        <button onClick={cargarTodasCitas} className="btn-primary">
                                            Aplicar Filtros
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Estadísticas del historial */}
                            {statsHistorial && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                                        <p className="text-sm text-gray-600">Completadas</p>
                                        <p className="text-2xl font-bold text-green-600">{statsHistorial.completadas}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                                        <p className="text-sm text-gray-600">Canceladas</p>
                                        <p className="text-2xl font-bold text-red-600">{statsHistorial.canceladas}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border-l-4 border-primary">
                                        <p className="text-sm text-gray-600">Ingresos Generados</p>
                                        <p className="text-2xl font-bold text-primary">${statsHistorial.ingresoTotal.toLocaleString()}</p>
                                    </div>
                                </div>
                            )}

                            {/* Lista de historial */}
                            <div className="card">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                                        <FaCalendarAlt className="text-primary"/>
                                        <span>Historial de Citas ({todasCitas.length})</span>
                                    </h2>
                                </div>

                                {loadingHistorial ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                        <p className="text-gray-500">Cargando historial...</p>
                                    </div>
                                ) : todasCitas.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                                        <p className="text-gray-500 text-lg">No hay citas en el historial</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <table className="table-retro table-optimized">
                                            <thead>
                                            <tr>
                                                <th className="table-cell-md">Fecha</th>
                                                <th className="table-cell-sm">Hora</th>
                                                <th className="table-cell-lg">Cliente</th>
                                                <th className="table-cell-xl">Servicios</th>
                                                <th className="text-right table-cell-md">Total</th>
                                                <th className="text-right table-cell-md">Tu Comisión</th>
                                                <th className="text-center table-cell-md">Estado</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {todasCitas.map(cita => (
                                                <tr key={cita.idCita}>
                                                    <td className="font-semibold table-cell-md">
                                                        <span className="table-cell-content">
                                                            {new Date(cita.fecha).toLocaleDateString('es-CO', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </td>
                                                    <td className="font-mono table-cell-sm">
                                                        {cita.horaIn?.substring(0, 5)}
                                                    </td>
                                                    <td className="table-cell-lg table-cell-tooltip" data-tooltip={cita.nombreCliente}>
                                                        <span className="table-cell-content">{cita.nombreCliente}</span>
                                                    </td>
                                                    <td className="table-cell-xl table-cell-tooltip" data-tooltip={cita.servicios}>
                                                        <span className="text-sm text-gray-600 table-cell-content">{cita.servicios}</span>
                                                    </td>
                                                    <td className="text-right font-bold text-primary table-cell-md">
                                                        ${cita.total?.toLocaleString()}
                                                    </td>
                                                    <td className="text-right font-semibold text-green-600 table-cell-md">
                                                        {cita.estado === 'completada'
                                                            ? `$${((cita.total * (user.comision || 0) / 100) || 0).toLocaleString()}`
                                                            : '-'
                                                        }
                                                    </td>
                                                    <td className="text-center table-cell-md">
                                                        <span className={`badge whitespace-nowrap ${
                                                            cita.estado === 'completada' ? 'badge-success' :
                                                                cita.estado === 'confirmada' ? 'badge-info' :
                                                                    cita.estado === 'cancelada' ? 'badge-danger' :
                                                                        'badge-warning'
                                                        }`}>
                                                            {cita.estado === 'completada' &&
                                                                <FaCheckCircle className="inline w-3 h-3 mr-1"/>}
                                                            {cita.estado === 'pendiente' &&
                                                                <FaHourglassHalf className="inline w-3 h-3 mr-1"/>}
                                                            {cita.estado === 'cancelada' &&
                                                                <FaTimesCircle className="inline w-3 h-3 mr-1"/>}
                                                            {cita.estado}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ESTADÍSTICAS */}
                    {activeTab === 'estadisticas' && estadisticas && (
                        <div className="space-y-6 animate-fadeIn">
                            {/* Cards principales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="stat-card">
                                    <div className="flex items-center justify-between mb-3">
                                        <FaCalendarAlt className="w-10 h-10 text-primary"/>
                                        <span className="badge badge-primary">Total</span>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-800">{estadisticas.totalCitas}</p>
                                    <p className="text-sm text-gray-600 mt-1">Citas Totales</p>
                                </div>

                                <div className="stat-card border-yellow-500">
                                    <div className="flex items-center justify-between mb-3">
                                        <FaHourglassHalf className="w-10 h-10 text-yellow-600"/>
                                        <span className="badge badge-warning">Pendientes</span>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-800">{estadisticas.pendientes}</p>
                                    <p className="text-sm text-gray-600 mt-1">Por Confirmar</p>
                                </div>

                                <div className="stat-card border-green-500">
                                    <div className="flex items-center justify-between mb-3">
                                        <FaCheckCircle className="w-10 h-10 text-green-600"/>
                                        <span className="badge badge-success">Completadas</span>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-800">{estadisticas.completadas}</p>
                                    <p className="text-sm text-gray-600 mt-1">Finalizadas</p>
                                </div>

                                <div className="stat-card border-red-500">
                                    <div className="flex items-center justify-between mb-3">
                                        <FaTimesCircle className="w-10 h-10 text-red-600"/>
                                        <span className="badge badge-danger">Canceladas</span>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-800">{estadisticas.canceladas}</p>
                                    <p className="text-sm text-gray-600 mt-1">No Realizadas</p>
                                </div>
                            </div>

                            {/* Ingresos y comisiones */}
                            <div className="card-retro">
                                <div className="flex items-center space-x-3 mb-6">
                                    <FaDollarSign className="w-8 h-8 text-gold"/>
                                    <h3 className="text-2xl font-bold text-gray-800">Resumen Financiero</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div
                                        className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-300">
                                        <p className="text-sm text-green-700 font-semibold mb-2">INGRESOS GENERADOS</p>
                                        <p className="text-4xl font-bold text-green-700">
                                            ${estadisticas.ingresoTotal?.toLocaleString() || 0}
                                        </p>
                                        <p className="text-xs text-green-600 mt-2">De {estadisticas.completadas} citas
                                            completadas</p>
                                    </div>
                                    <div
                                        className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300">
                                        <p className="text-sm text-blue-700 font-semibold mb-2">TU COMISIÓN
                                            ({user.comision}%)</p>
                                        <p className="text-4xl font-bold text-blue-700">
                                            ${estadisticas.comisionTotal?.toLocaleString() || 0}
                                        </p>
                                        <p className="text-xs text-blue-600 mt-2">Ganancia personal</p>
                                    </div>
                                </div>
                            </div>

                            {/* Información adicional */}
                            <div className="card">
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                    <p className="text-sm text-blue-800 flex items-start space-x-2">
                                        <FaInfoCircle className="w-5 h-5 mt-0.5 flex-shrink-0"/>
                                        <span>
                                        <strong>Nota:</strong> Las estadísticas incluyen todas tus citas desde el inicio.
                                        Usa los filtros en la sección de Historial para ver períodos específicos.
                                    </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toast Notifications */}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}

                {/* Confirm Modal */}
                <ConfirmModal
                    isOpen={confirmModal.isOpen}
                    onClose={closeConfirm}
                    onConfirm={confirmModal.onConfirm}
                    title={confirmModal.title}
                    message={confirmModal.message}
                    type={confirmModal.type}
                />
            </div>
        );
}

