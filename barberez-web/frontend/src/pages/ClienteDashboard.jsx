import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { citasAPI, barberosAPI, serviciosAPI } from '../services/api';
import {
    FaCut, FaSignOutAlt, FaCalendarPlus, FaCalendarCheck, FaHistory,
    FaUserTie, FaClock, FaMoneyBillWave, FaFilter, FaTimes, FaSearch,
    FaCheckCircle, FaInfoCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SelectBusqueda from '../components/SelectBusqueda';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import LayoutControl from '../components/LayoutControl';
import CitaCard from '../components/CitaCard';
import CitaCardSkeleton from '../components/CitaCardSkeleton';
import Pagination from '../components/Pagination';

export default function ClienteDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('agendar');

    // Estados para agendar cita
    const [barberos, setBarberos] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [formCita, setFormCita] = useState({
        fecha: '',
        horaIn: '',
        idBarbero: '',
        servicios: [],
        metodoPago: 'efectivo'
    });

    // Estados para ver citas
    const [citasPendientes, setCitasPendientes] = useState([]);
    const [historialCitas, setHistorialCitas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingHistorial, setLoadingHistorial] = useState(false);

    // Layout y paginación
    const [layoutColumns, setLayoutColumns] = useState(() => {
        const saved = localStorage.getItem('clienteLayoutColumns');
        return saved ? parseInt(saved) : 2;
    });
    const [layoutSize, setLayoutSize] = useState(() => {
        return localStorage.getItem('clienteLayoutSize') || 'normal';
    });
    const [currentPagePendientes, setCurrentPagePendientes] = useState(1);
    const [currentPageHistorial, setCurrentPageHistorial] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [customItemsPerPage, setCustomItemsPerPage] = useState(() => {
        const saved = localStorage.getItem('clienteItemsPerPage');
        return saved ? parseInt(saved) : null;
    });

    // Toast notifications
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
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

    // Filtros para historial
    const [filtros, setFiltros] = useState(() => {
        const saved = localStorage.getItem('clienteFiltros');
        return saved ? JSON.parse(saved) : {
            fechaInicio: '',
            fechaFin: '',
            estado: '',
            idBarbero: '',
            busqueda: '',
            ordenFecha: 'desc' // desc = más recientes primero, asc = más antiguos primero
        };
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [timerBusqueda, setTimerBusqueda] = useState(null);

    // Ajustar items por página según layout
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
        localStorage.setItem('clienteLayoutColumns', layoutColumns.toString());
    }, [layoutColumns]);

    useEffect(() => {
        localStorage.setItem('clienteLayoutSize', layoutSize);
    }, [layoutSize]);

    useEffect(() => {
        if (customItemsPerPage) {
            localStorage.setItem('clienteItemsPerPage', customItemsPerPage.toString());
        }
    }, [customItemsPerPage]);

    // Persistir filtros
    useEffect(() => {
        localStorage.setItem('clienteFiltros', JSON.stringify(filtros));
    }, [filtros]);

    // Búsqueda con debounce
    useEffect(() => {
        if (activeTab === 'historial') {
            if (timerBusqueda) {
                clearTimeout(timerBusqueda);
            }
            
            const timer = setTimeout(() => {
                cargarHistorial();
            }, 500);
            
            setTimerBusqueda(timer);
            
            return () => clearTimeout(timer);
        }
    }, [filtros, activeTab]);

    // Funciones de paginación
    const paginate = (items, currentPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    };

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

    const getTotalPages = (totalItems) => Math.ceil(totalItems / itemsPerPage) || 1;

    const getCitasPendientesPaginadas = () => paginate(citasPendientes, currentPagePendientes);

    const getHistorialFiltrado = () => {
        let citas = historialCitas.filter(c => c.estado !== 'pendiente');

        if (filtros.fechaInicio) {
            citas = citas.filter(c => c.fecha >= filtros.fechaInicio);
        }
        if (filtros.fechaFin) {
            citas = citas.filter(c => c.fecha <= filtros.fechaFin);
        }
        if (filtros.estado) {
            citas = citas.filter(c => c.estado === filtros.estado);
        }
        if (filtros.idBarbero) {
            citas = citas.filter(c => c.idBarbero === parseInt(filtros.idBarbero));
        }
        if (filtros.busqueda) {
            const busqueda = filtros.busqueda.toLowerCase();
            citas = citas.filter(c =>
                c.nombreBarbero?.toLowerCase().includes(busqueda) ||
                c.servicios?.toLowerCase().includes(busqueda)
            );
        }

        return citas;
    };

    const getHistorialPaginado = () => paginate(getHistorialFiltrado(), currentPageHistorial);

    useEffect(() => {
        cargarBarberos();
        cargarServicios();
        if (activeTab === 'citas') {
            setCurrentPagePendientes(1);
            cargarCitasPendientes();
        } else if (activeTab === 'historial') {
            setCurrentPageHistorial(1);
            cargarHistorial();
        }
    }, [activeTab]);

    // Reset página cuando cambian los filtros
    useEffect(() => {
        setCurrentPageHistorial(1);
    }, [filtros]);

    // Limpiar la hora seleccionada cuando cambia la fecha
    useEffect(() => {
        if (formCita.fecha && formCita.horaIn) {
            // Verificar si la hora seleccionada sigue siendo válida
            const horariosDisponibles = getHorariosDisponibles();
            if (!horariosDisponibles.includes(formCita.horaIn)) {
                setFormCita(prev => ({ ...prev, horaIn: '' }));
            }
        }
    }, [formCita.fecha]);

    const cargarBarberos = async () => {
        try {
            const response = await barberosAPI.getAll();
            setBarberos(response.data.data);
        } catch (error) {
            console.error('Error al cargar barberos:', error);
        }
    };

    const cargarServicios = async () => {
        try {
            const response = await serviciosAPI.getAll();
            setServicios(response.data.data);
        } catch (error) {
            console.error('Error al cargar servicios:', error);
        }
    };

    const cargarCitasPendientes = async () => {
        setLoading(true);
        try {
            const response = await citasAPI.getCitasCliente(user.idUsuario, 'pendiente');
            setCitasPendientes(response.data.data);
        } catch (error) {
            console.error('Error al cargar citas:', error);
            showToast('Error al cargar las citas pendientes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const cargarHistorial = async () => {
        setLoadingHistorial(true);
        try {
            const response = await citasAPI.getCitasCliente(user.idUsuario);
            // Solo mostrar citas completadas o canceladas en el historial
            // Las confirmadas solo si la fecha ya pasó
            let citas = response.data.data.filter(c => {
                if (c.estado === 'completada' || c.estado === 'cancelada') {
                    return true;
                }
                // Si es confirmada, verificar que la fecha ya pasó
                if (c.estado === 'confirmada') {
                    const fechaCita = new Date(c.fecha + 'T' + c.horaIn);
                    return fechaCita < new Date();
                }
                return false;
            });

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
            if (filtros.idBarbero) {
                citas = citas.filter(c => c.idBarbero === parseInt(filtros.idBarbero));
            }
            if (filtros.busqueda) {
                const busqueda = filtros.busqueda.toLowerCase();
                citas = citas.filter(c =>
                    c.nombreBarbero?.toLowerCase().includes(busqueda) ||
                    c.servicios?.toLowerCase().includes(busqueda)
                );
            }

            // Ordenar por fecha
            citas.sort((a, b) => {
                const fechaA = new Date(a.fecha + 'T' + (a.horaIn || '00:00:00'));
                const fechaB = new Date(b.fecha + 'T' + (b.horaIn || '00:00:00'));
                return filtros.ordenFecha === 'desc' ? fechaB - fechaA : fechaA - fechaB;
            });

            setHistorialCitas(citas);
        } catch (error) {
            console.error('Error al cargar historial:', error);
            showToast('Error al cargar el historial', 'error');
        } finally {
            setLoadingHistorial(false);
        }
    };

    const handleServicioChange = (idSer) => {
        setFormCita(prev => ({
            ...prev,
            servicios: prev.servicios.includes(idSer)
                ? prev.servicios.filter(s => s !== idSer)
                : [...prev.servicios, idSer]
        }));
    };

    const calcularTotal = () => {
        return formCita.servicios.reduce((total, idSer) => {
            const servicio = servicios.find(s => s.idSer === idSer);
            return total + (parseFloat(servicio?.precio) || 0);
        }, 0);
    };

    const calcularDuracion = () => {
        return formCita.servicios.reduce((total, idSer) => {
            const servicio = servicios.find(s => s.idSer === idSer);
            return total + (parseInt(servicio?.duracion) || 0);
        }, 0);
    };

    const handleAgendarCita = async (e) => {
        e.preventDefault();

        if (formCita.servicios.length === 0) {
            showToast('Selecciona al menos un servicio', 'warning');
            return;
        }

        // Validar que la hora no sea en el pasado si es el día de hoy
        const fechaSeleccionada = new Date(formCita.fecha + 'T00:00:00');
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaSeleccionada.getTime() === hoy.getTime()) {
            const [horas, minutos] = formCita.horaIn.split(':').map(Number);
            const horarioCitaMinutos = horas * 60 + minutos;
            const horaActual = new Date();
            const horaActualMinutos = horaActual.getHours() * 60 + horaActual.getMinutes();

            if (horarioCitaMinutos <= horaActualMinutos + 30) {
                showToast('No puedes agendar una cita en una hora que ya pasó o está muy próxima. Selecciona una hora con al menos 30 minutos de anticipación.', 'error');
                return;
            }
        }

        setLoading(true);
        try {
            const citaData = {
                ...formCita,
                idCliente: user.idUsuario
            };

            await citasAPI.agendarCita(citaData);
            showToast('¡Cita agendada exitosamente!', 'success');

            // Limpiar formulario
            setFormCita({
                fecha: '',
                horaIn: '',
                idBarbero: '',
                servicios: [],
                metodoPago: 'efectivo'
            });

            setActiveTab('citas');
        } catch (error) {
            showToast(error.response?.data?.message || 'Error al agendar cita', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarCita = async (idCita) => {
        showConfirm(
            '¿Cancelar esta cita?',
            'Esta acción no se puede deshacer. ¿Estás seguro de que quieres cancelar tu cita?',
            async () => {
                try {
                    await citasAPI.cancelarCita(idCita, user.idUsuario, 'cliente');
                    showToast('Cita cancelada exitosamente', 'success');
                    
                    // Actualizar el estado local inmediatamente
                    setCitasPendientes(prev => prev.filter(c => c.idCita !== idCita));
                    
                    // También actualizar el historial si la cita está allí
                    setHistorialCitas(prev => prev.map(c => 
                        c.idCita === idCita ? { ...c, estado: 'cancelada' } : c
                    ));
                } catch (error) {
                    showToast(error.response?.data?.message || 'Error al cancelar cita', 'error');
                }
            },
            'danger'
        );
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const limpiarFiltros = () => {
        setFiltros({
            fechaInicio: '',
            fechaFin: '',
            estado: '',
            idBarbero: '',
            busqueda: '',
            ordenFecha: 'desc'
        });
        setCurrentPageHistorial(1);
    };

    const contarFiltrosActivos = () => {
        // No contar ordenFecha como filtro activo
        const { ordenFecha, ...filtrosParaContar } = filtros;
        return Object.values(filtrosParaContar).filter(v => v !== '').length;
    };

    // Generar horarios disponibles
    const horarios = [];
    for (let i = 8; i <= 18; i++) {
        horarios.push(`${i.toString().padStart(2, '0')}:00:00`);
        if (i < 18) horarios.push(`${i.toString().padStart(2, '0')}:30:00`);
    }

    // Filtrar horarios según la fecha seleccionada
    const getHorariosDisponibles = () => {
        if (!formCita.fecha) {
            return []; // No mostrar horarios hasta que se seleccione una fecha
        }

        const fechaSeleccionada = new Date(formCita.fecha + 'T00:00:00');
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Si la fecha seleccionada no es hoy, mostrar todos los horarios
        if (fechaSeleccionada.getTime() !== hoy.getTime()) {
            return horarios;
        }

        // Si es hoy, filtrar horarios pasados
        const horaActual = new Date();
        const horaActualMinutos = horaActual.getHours() * 60 + horaActual.getMinutes();

        return horarios.filter(hora => {
            const [horas, minutos] = hora.split(':').map(Number);
            const horarioMinutos = horas * 60 + minutos;
            // Agregar un margen de 30 minutos para preparación
            return horarioMinutos > horaActualMinutos + 30;
        });
    };

    const barberosOptions = barberos.map(b => ({
        value: b.idBarbero,
        label: b.nombre
    }));

    // Calcular estadísticas del historial
    const calcularEstadisticas = () => {
        const completadas = historialCitas.filter(c => c.estado === 'completada').length;
        const canceladas = historialCitas.filter(c => c.estado === 'cancelada').length;
        const totalGastado = historialCitas
            .filter(c => c.estado === 'completada')
            .reduce((sum, c) => sum + (parseFloat(c.total) || 0), 0);

        return { completadas, canceladas, totalGastado };
    };

    const stats = activeTab === 'historial' ? calcularEstadisticas() : null;

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
                                <p className="text-sm text-white/80">Portal del Cliente</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold">{user?.nombre}</p>
                                <p className="text-xs text-white/80">Cliente</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
                            >
                                <FaSignOutAlt size={18} />
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
                        onClick={() => setActiveTab('agendar')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'agendar'
                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FaCalendarPlus size={18} />
                        <span>Agendar Cita</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('citas')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'citas'
                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FaCalendarCheck size={18} />
                        <span>Mis Citas</span>
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
                        <FaHistory size={18} />
                        <span>Historial</span>
                        {contarFiltrosActivos() > 0 && (
                            <span className="bg-gold text-white text-xs font-bold px-2 py-1 rounded-full">
                                {contarFiltrosActivos()}
                            </span>
                        )}
                    </button>
                </div>

                {/* AGENDAR CITA */}
                {activeTab === 'agendar' && (
                    <form onSubmit={handleAgendarCita} className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
                        <div className="card-retro">
                            <div className="flex items-center space-x-3 mb-6">
                                <FaCalendarPlus className="w-7 h-7 text-primary" />
                                <h2 className="text-2xl font-bold text-gray-800">Agendar Nueva Cita</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Fecha */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        <FaClock className="inline mr-2" />
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        value={formCita.fecha}
                                        onChange={(e) => setFormCita({ ...formCita, fecha: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                {/* Hora */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        <FaClock className="inline mr-2" />
                                        Hora
                                    </label>
                                    <select
                                        value={formCita.horaIn}
                                        onChange={(e) => setFormCita({ ...formCita, horaIn: e.target.value })}
                                        className="input-field"
                                        required
                                        disabled={!formCita.fecha}
                                    >
                                        <option value="">
                                            {!formCita.fecha 
                                                ? 'Primero selecciona una fecha' 
                                                : getHorariosDisponibles().length === 0
                                                    ? 'No hay horarios disponibles para hoy'
                                                    : 'Seleccionar hora'
                                            }
                                        </option>
                                        {getHorariosDisponibles().map(hora => (
                                            <option key={hora} value={hora}>
                                                {hora.substring(0, 5)}
                                            </option>
                                        ))}
                                    </select>
                                    {!formCita.fecha && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            * Selecciona primero una fecha para ver las horas disponibles
                                        </p>
                                    )}
                                    {formCita.fecha && getHorariosDisponibles().length === 0 && (
                                        <p className="text-xs text-amber-600 mt-1 flex items-center">
                                            <FaClock className="inline w-3 h-3 mr-1" />
                                            No hay horarios disponibles. Por favor selecciona otro día.
                                        </p>
                                    )}
                                </div>

                                {/* Barbero con búsqueda */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        <FaUserTie className="inline mr-2" />
                                        Barbero
                                    </label>
                                    <SelectBusqueda
                                        value={formCita.idBarbero}
                                        onChange={(value) => setFormCita({ ...formCita, idBarbero: parseInt(value) || '' })}
                                        options={barberosOptions}
                                        placeholder="Seleccionar barbero"
                                    />
                                </div>

                                {/* Servicios */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        <FaCut className="inline mr-2" />
                                        Servicios
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {servicios.map(servicio => (
                                            <label
                                                key={servicio.idSer}
                                                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                    formCita.servicios.includes(servicio.idSer)
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={formCita.servicios.includes(servicio.idSer)}
                                                        onChange={() => handleServicioChange(servicio.idSer)}
                                                        className="w-5 h-5 text-primary focus:ring-primary rounded"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{servicio.nombre}</p>
                                                        <p className="text-xs text-gray-500">
                                                            <FaClock className="inline w-3 h-3 mr-1" />
                                                            {servicio.duracion} min
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-primary font-bold text-lg">
                                                    ${servicio.precio.toLocaleString()}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Método de Pago */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        <FaMoneyBillWave className="inline mr-2" />
                                        Método de Pago
                                    </label>
                                    <select
                                        value={formCita.metodoPago}
                                        onChange={(e) => setFormCita({ ...formCita, metodoPago: e.target.value })}
                                        className="input-field"
                                        required
                                    >
                                        <option value="efectivo">💵 Efectivo</option>
                                        <option value="tarjeta">💳 Tarjeta</option>
                                        <option value="transferencia">🏦 Transferencia</option>
                                    </select>
                                </div>
                            </div>

                            {/* Resumen */}
                            {formCita.servicios.length > 0 && (
                                <div className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border-2 border-primary/20">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Resumen de tu Cita</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Servicios</p>
                                            <p className="font-semibold">{formCita.servicios.length}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Duración total</p>
                                            <p className="font-semibold">{calcularDuracion()} min</p>
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <p className="text-sm text-gray-600">Total a pagar</p>
                                            <p className="text-2xl font-bold text-primary">
                                                ${calcularTotal().toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                        <p className="text-sm text-blue-800 flex items-start space-x-2">
                                            <FaInfoCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>Tu cita será confirmada por el barbero. Te notificaremos cuando sea confirmada.</span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || formCita.servicios.length === 0}
                                className="w-full btn-primary py-4 text-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <FaClock className="animate-spin" />
                                        <span>Agendando...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center space-x-2">
                                        <FaCheckCircle />
                                        <span>Confirmar y Agendar Cita</span>
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* MIS CITAS PENDIENTES */}
                {activeTab === 'citas' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* LayoutControl */}
                        <LayoutControl
                            columns={layoutColumns}
                            onColumnsChange={setLayoutColumns}
                            size={layoutSize}
                            onSizeChange={setLayoutSize}
                            itemsPerPage={customItemsPerPage || itemsPerPage}
                            onItemsPerPageChange={setCustomItemsPerPage}
                            totalItems={citasPendientes.length}
                        />

                        <div className="card">
                            <div className="flex items-center space-x-3 mb-6">
                                <FaCalendarCheck className="w-7 h-7 text-primary" />
                                <h2 className="text-2xl font-bold text-gray-800">Mis Citas Pendientes</h2>
                                <span className="badge badge-warning text-base">{citasPendientes.length}</span>
                            </div>
                            
                            {loading ? (
                                <div className={`grid ${getGridClass()} gap-3`}>
                                    <CitaCardSkeleton size={layoutSize} count={itemsPerPage} />
                                </div>
                            ) : citasPendientes.length === 0 ? (
                                <div className="text-center py-12">
                                    <FaCalendarCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg mb-4">No tienes citas pendientes</p>
                                    <button
                                        onClick={() => setActiveTab('agendar')}
                                        className="btn-primary"
                                    >
                                        <FaCalendarPlus className="inline mr-2" />
                                        Agendar Nueva Cita
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className={`grid ${getGridClass()} gap-3`}>
                                        {getCitasPendientesPaginadas().map(cita => (
                                            <CitaCard
                                                key={cita.idCita}
                                                cita={cita}
                                                size={layoutSize}
                                                onCancelar={() => handleCancelarCita(cita.idCita)}
                                                loading={loading}
                                                showCancelButton={true}
                                            />
                                        ))}
                                    </div>

                                    {/* Paginación - Siempre visible para citas pendientes */}
                                    {citasPendientes.length > itemsPerPage && (
                                        <div className="mt-6">
                                            <Pagination
                                                currentPage={currentPagePendientes}
                                                totalPages={getTotalPages(citasPendientes.length)}
                                                onPageChange={setCurrentPagePendientes}
                                                itemsPerPage={itemsPerPage}
                                                totalItems={citasPendientes.length}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* HISTORIAL */}
                {activeTab === 'historial' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* LayoutControl */}
                        <LayoutControl
                            columns={layoutColumns}
                            onColumnsChange={setLayoutColumns}
                            size={layoutSize}
                            onSizeChange={setLayoutSize}
                            itemsPerPage={customItemsPerPage || itemsPerPage}
                            onItemsPerPageChange={setCustomItemsPerPage}
                            totalItems={getHistorialFiltrado().length}
                        />

                        {/* Barra de búsqueda y filtros */}
                        <div className="card">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={filtros.busqueda}
                                        onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                                        placeholder="Buscar por barbero o servicio..."
                                        className="input-field pl-10 pr-10"
                                    />
                                    {filtros.busqueda && (
                                        <button
                                            onClick={() => setFiltros({ ...filtros, busqueda: '' })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <FaTimes size={18} />
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                                    className="btn-secondary flex items-center space-x-2 px-6"
                                >
                                    <FaFilter />
                                    <span>Filtros</span>
                                    {contarFiltrosActivos() > 0 && (
                                        <span className="bg-white text-secondary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                                            {contarFiltrosActivos()}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Indicador de búsqueda en progreso */}
                            {loadingHistorial && (
                                <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <span>Buscando...</span>
                                </div>
                            )}
                        </div>

                        {/* Panel de filtros */}
                        {mostrarFiltros && (
                            <div className="filter-container animate-fadeIn">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                                        <FaFilter className="text-primary" />
                                        <span>Filtros</span>
                                    </h3>
                                    <button
                                        onClick={limpiarFiltros}
                                        className="text-sm text-primary hover:text-secondary font-semibold flex items-center space-x-1"
                                    >
                                        <FaTimes size={16} />
                                        <span>Limpiar</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Estado
                                        </label>
                                        <select
                                            value={filtros.estado}
                                            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="">Todos</option>
                                            <option value="confirmada">Confirmada</option>
                                            <option value="completada">Completada</option>
                                            <option value="cancelada">Cancelada</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Barbero
                                        </label>
                                        <SelectBusqueda
                                            value={filtros.idBarbero}
                                            onChange={(value) => setFiltros({ ...filtros, idBarbero: value })}
                                            options={barberosOptions}
                                            placeholder="Todos"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Desde
                                        </label>
                                        <input
                                            type="date"
                                            value={filtros.fechaInicio}
                                            onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
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
                                            onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
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
                                            onChange={(e) => setFiltros({ ...filtros, ordenFecha: e.target.value })}
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
                                </div>
                            </div>
                        )}

                        {/* Estadísticas */}
                        {stats && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                                    <p className="text-sm text-gray-600">Completadas</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.completadas}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                                    <p className="text-sm text-gray-600">Canceladas</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.canceladas}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 border-l-4 border-primary">
                                    <p className="text-sm text-gray-600">Total Gastado</p>
                                    <p className="text-2xl font-bold text-primary">${stats.totalGastado.toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        {/* Lista de historial */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                                    <FaHistory className="text-primary" />
                                    <span>Historial</span>
                                </h2>
                                <span className="badge badge-info text-base">{getHistorialFiltrado().length} citas</span>
                            </div>

                            {loadingHistorial ? (
                                <div className={`grid ${getGridClass()} gap-3`}>
                                    <CitaCardSkeleton size={layoutSize} count={itemsPerPage} />
                                </div>
                            ) : getHistorialFiltrado().length === 0 ? (
                                <div className="text-center py-12">
                                    <FaHistory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No hay citas en el historial</p>
                                    {contarFiltrosActivos() > 0 && (
                                        <button
                                            onClick={limpiarFiltros}
                                            className="mt-4 btn-outline"
                                        >
                                            <FaTimes className="inline mr-2" />
                                            Limpiar Filtros
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className={`grid ${getGridClass()} gap-3`}>
                                        {getHistorialPaginado().map(cita => (
                                            <CitaCard
                                                key={cita.idCita}
                                                cita={cita}
                                                size={layoutSize}
                                                loading={false}
                                                showCancelButton={false}
                                            />
                                        ))}
                                    </div>

                                    {/* Paginación - Siempre visible para historial */}
                                    {getHistorialFiltrado().length > itemsPerPage && (
                                        <div className="mt-6">
                                            <Pagination
                                                currentPage={currentPageHistorial}
                                                totalPages={getTotalPages(getHistorialFiltrado().length)}
                                                onPageChange={setCurrentPageHistorial}
                                                itemsPerPage={itemsPerPage}
                                                totalItems={getHistorialFiltrado().length}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
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
