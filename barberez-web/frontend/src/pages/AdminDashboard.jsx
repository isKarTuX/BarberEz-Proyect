import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, authAPI, barberosAPI, serviciosAPI } from '../services/api';
import { Scissors, LogOut, Users, TrendingUp, Calendar, UserPlus } from 'lucide-react';
import {
    FaSearch, FaFilter, FaDownload, FaSync, FaDatabase, FaTimes,
    FaMoneyBillWave, FaClock, FaCheckCircle, FaTimesCircle,
    FaUserFriends, FaChartLine, FaCut, FaCalendarCheck,
    FaHourglassHalf, FaBan, FaUserTie, FaEdit, FaKey, FaTrash,
    FaPhone, FaEnvelope, FaIdCard, FaPercent, FaCogs, FaUser
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SelectBusqueda from '../components/SelectBusqueda';
import ToggleSwitch from '../components/ToggleSwitch';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import LayoutControl from '../components/LayoutControl';
import CitaCardSkeleton from '../components/CitaCardSkeleton';
import Pagination from '../components/Pagination';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('estadisticas');

    const [estadisticas, setEstadisticas] = useState(null);
    const [estadisticasBarberos, setEstadisticasBarberos] = useState([]);
    const [ingresos, setIngresos] = useState(null);
    const [ingresosPorBarbero, setIngresosPorBarbero] = useState([]);
    const [todasLasCitas, setTodasLasCitas] = useState([]);
    const [estadisticasCitas, setEstadisticasCitas] = useState(null);
    const [barberos, setBarberos] = useState([]);

    // Layout y paginación
    const [layoutColumns, setLayoutColumns] = useState(() => {
        const saved = localStorage.getItem('adminLayoutColumns');
        return saved ? parseInt(saved) : 2;
    });
    const [layoutSize, setLayoutSize] = useState(() => {
        return localStorage.getItem('adminLayoutSize') || 'normal';
    });
    const [currentPageCitas, setCurrentPageCitas] = useState(1);
    const [currentPageClientes, setCurrentPageClientes] = useState(1);
    const [currentPageBarberos, setCurrentPageBarberos] = useState(1);
    const [currentPageServicios, setCurrentPageServicios] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [customItemsPerPage, setCustomItemsPerPage] = useState(() => {
        const saved = localStorage.getItem('adminItemsPerPage');
        return saved ? parseInt(saved) : null;
    });

    // Estados para gestión de servicios
    const [servicios, setServicios] = useState([]);
    const [loadingServicios, setLoadingServicios] = useState(false);
    const [modalServicio, setModalServicio] = useState(false);
    const [servicioEditar, setServicioEditar] = useState(null);
    const [formServicio, setFormServicio] = useState({
        nombre: '',
        duracion: '',
        precio: ''
    });
    const [busquedaServicio, setBusquedaServicio] = useState('');

    // Estados de filtros
    const [filtros, setFiltros] = useState(() => {
        const saved = localStorage.getItem('adminFiltrosCitas');
        return saved ? JSON.parse(saved) : {
            busqueda: '',
            estado: '',
            idBarbero: '',
            fechaInicio: '',
            fechaFin: '',
            metodoPago: ''
        };
    });

    const [buscando, setBuscando] = useState(false);
    const [loadingCitas, setLoadingCitas] = useState(false);
    const [loadingGestion, setLoadingGestion] = useState(false);
    const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
    const [timerBusqueda, setTimerBusqueda] = useState(null);

    // Formulario crear cuenta
    const [formCuenta, setFormCuenta] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        contrasena: '',
        cedula: '',
        rol: 'cliente',
        comision: 0
    });

    const [loading, setLoading] = useState(false);

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

    // Estados para gestión técnica de usuarios
    const [vistaGestion, setVistaGestion] = useState('left'); // 'left' = Clientes, 'right' = Barberos
    const [clientes, setClientes] = useState([]);
    const [barberosGestion, setBarberosGestion] = useState([]);
    const [filtroGestion, setFiltroGestion] = useState('');
    const [ordenClientes, setOrdenClientes] = useState('gastado'); // 'gastado', 'citas', 'reciente'
    const [ordenBarberos, setOrdenBarberos] = useState('citas'); // 'citas', 'ingresos', 'comision'
    const [modalEditar, setModalEditar] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState(null);
    const [modalPassword, setModalPassword] = useState(false);
    const [nuevaPassword, setNuevaPassword] = useState('');

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
        localStorage.setItem('adminLayoutColumns', layoutColumns.toString());
    }, [layoutColumns]);

    useEffect(() => {
        localStorage.setItem('adminLayoutSize', layoutSize);
    }, [layoutSize]);

    useEffect(() => {
        if (customItemsPerPage) {
            localStorage.setItem('adminItemsPerPage', customItemsPerPage.toString());
        }
    }, [customItemsPerPage]);

    // Persistir filtros
    useEffect(() => {
        localStorage.setItem('adminFiltrosCitas', JSON.stringify(filtros));
    }, [filtros]);

    // Búsqueda con debounce automático
    useEffect(() => {
        if (activeTab === 'citas') {
            if (timerBusqueda) {
                clearTimeout(timerBusqueda);
            }
            
            const timer = setTimeout(() => {
                buscarCitas();
            }, 800);
            
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

    const getCitasPaginadas = () => paginate(todasLasCitas, currentPageCitas);

    const filtrarYOrdenarClientes = () => {
        let resultado = [...clientes];
        // Filtrar por búsqueda
        if (filtroGestion) {
            const busqueda = filtroGestion.toLowerCase();
            resultado = resultado.filter(c =>
                c.nombre?.toLowerCase().includes(busqueda) ||
                c.correo?.toLowerCase().includes(busqueda) ||
                c.cedula?.includes(busqueda) ||
                c.telefono?.includes(busqueda)
            );
        }
        // Ordenar
        if (ordenClientes === 'gastado') {
            resultado.sort((a, b) => (b.totalGastado || 0) - (a.totalGastado || 0));
        } else if (ordenClientes === 'citas') {
            resultado.sort((a, b) => (b.totalCitas || 0) - (a.totalCitas || 0));
        } else if (ordenClientes === 'reciente') {
            resultado.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
        }
        return resultado;
    };

    const filtrarYOrdenarBarberos = () => {
        let resultado = [...barberosGestion];
        // Filtrar por búsqueda
        if (filtroGestion) {
            const busqueda = filtroGestion.toLowerCase();
            resultado = resultado.filter(b =>
                b.nombre?.toLowerCase().includes(busqueda) ||
                b.correo?.toLowerCase().includes(busqueda) ||
                b.cedula?.includes(busqueda) ||
                b.telefono?.includes(busqueda)
            );
        }
        // Ordenar
        if (ordenBarberos === 'citas') {
            resultado.sort((a, b) => (b.totalCitas || 0) - (a.totalCitas || 0));
        } else if (ordenBarberos === 'ingresos') {
            resultado.sort((a, b) => (b.totalIngresos || 0) - (a.totalIngresos || 0));
        } else if (ordenBarberos === 'comision') {
            resultado.sort((a, b) => (b.comisionTotal || 0) - (a.comisionTotal || 0));
        }
        return resultado;
    };

    const getClientesPaginados = () => paginate(filtrarYOrdenarClientes(), currentPageClientes);
    const getBarberosPaginados = () => paginate(filtrarYOrdenarBarberos(), currentPageBarberos);

    useEffect(() => {
        if (activeTab === 'estadisticas') {
            cargarEstadisticas();
            cargarEstadisticasBarberos();
            cargarIngresos();
        } else if (activeTab === 'citas') {
            cargarBarberos();
            buscarCitas();
        } else if (activeTab === 'ingresos') {
            cargarIngresosPorBarbero();
        } else if (activeTab === 'gestion') {
            if (vistaGestion === 'left') {
                cargarClientes();
            } else {
                cargarBarberosGestion();
            }
        } else if (activeTab === 'servicios') {
            cargarServicios();
        }
    }, [activeTab, vistaGestion, filtroGestion, ordenClientes, ordenBarberos]);

    const cargarEstadisticas = async () => {
        try {
            const response = await adminAPI.getEstadisticas();
            setEstadisticas(response.data.data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const cargarEstadisticasBarberos = async () => {
        try {
            const response = await adminAPI.getEstadisticasBarberos();
            setEstadisticasBarberos(response.data.data);
        } catch (error) {
            console.error('Error al cargar estadísticas de barberos:', error);
        }
    };

    const cargarIngresos = async () => {
        try {
            const response = await adminAPI.getIngresos();
            setIngresos(response.data.data);
        } catch (error) {
            console.error('Error al cargar ingresos:', error);
        }
    };

    const cargarIngresosPorBarbero = async () => {
        try {
            const response = await adminAPI.getIngresosPorBarbero();
            setIngresosPorBarbero(response.data.data);
        } catch (error) {
            console.error('Error al cargar ingresos por barbero:', error);
        }
    };

    const cargarBarberos = async () => {
        try {
            const response = await barberosAPI.getAll();
            setBarberos(response.data.data);
        } catch (error) {
            console.error('Error al cargar barberos:', error);
        }
    };

    const buscarCitas = async () => {
        setBuscando(true);
        setLoadingCitas(true);
        try {
            const filtrosLimpios = Object.fromEntries(
                Object.entries(filtros).filter(([_, v]) => v !== '')
            );

            const response = await adminAPI.buscarCitas(filtrosLimpios);
            setTodasLasCitas(response.data.data);

            const statsResponse = await adminAPI.getEstadisticasCitas(filtrosLimpios);
            setEstadisticasCitas(statsResponse.data.data);

            console.log('🔍 Búsqueda en BD completada:', response.data.meta);
        } catch (error) {
            console.error('Error al buscar citas:', error);
            showToast('Error al buscar citas', 'error');
        } finally {
            setBuscando(false);
            setLoadingCitas(false);
        }
    };

    const limpiarFiltros = () => {
        setFiltros({
            busqueda: '',
            estado: '',
            idBarbero: '',
            fechaInicio: '',
            fechaFin: '',
            metodoPago: ''
        });
        setCurrentPageCitas(1);
    };

    const handleCrearCuenta = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authAPI.register(formCuenta);
            alert('✅ Cuenta creada exitosamente');
            setFormCuenta({
                nombre: '',
                correo: '',
                telefono: '',
                contrasena: '',
                cedula: '',
                rol: 'cliente',
                comision: 0
            });
        } catch (error) {
            alert(error.response?.data?.message || 'Error al crear cuenta');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // ==================== FUNCIONES DE GESTIÓN ====================

    const cargarClientes = async () => {
        setLoadingGestion(true);
        try {
            const response = await adminAPI.getAllClientes({ busqueda: filtroGestion });
            let clientesOrdenados = [...response.data.data];

            // Aplicar ordenamiento
            switch(ordenClientes) {
                case 'gastado':
                    clientesOrdenados.sort((a, b) => (b.totalGastado || 0) - (a.totalGastado || 0));
                    break;
                case 'citas':
                    clientesOrdenados.sort((a, b) => (b.totalCitas || 0) - (a.totalCitas || 0));
                    break;
                case 'reciente':
                    clientesOrdenados.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
                    break;
            }

            setClientes(clientesOrdenados);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            showToast('Error al cargar clientes', 'error');
        } finally {
            setLoadingGestion(false);
        }
    };

    const cargarBarberosGestion = async () => {
        setLoadingGestion(true);
        try {
            const response = await adminAPI.getAllBarberosGestion({ busqueda: filtroGestion });
            let barberosOrdenados = [...response.data.data];

            // Aplicar ordenamiento
            switch(ordenBarberos) {
                case 'citas':
                    barberosOrdenados.sort((a, b) => (b.totalCitas || 0) - (a.totalCitas || 0));
                    break;
                case 'ingresos':
                    barberosOrdenados.sort((a, b) => (b.ingresoGenerado || 0) - (a.ingresoGenerado || 0));
                    break;
                case 'comision':
                    barberosOrdenados.sort((a, b) => (b.comisionTotal || 0) - (a.comisionTotal || 0));
                    break;
            }

            setBarberosGestion(barberosOrdenados);
        } catch (error) {
            console.error('Error al cargar barberos:', error);
            showToast('Error al cargar barberos', 'error');
        } finally {
            setLoadingGestion(false);
        }
    };

    const handleEditarUsuario = (usuario) => {
        setUsuarioEditar({ ...usuario });
        setModalEditar(true);
    };

    const handleGuardarEdicion = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (vistaGestion === 'left') {
                await adminAPI.updateCliente(usuarioEditar.idUsuario, usuarioEditar);
                showToast('Cliente actualizado exitosamente', 'success');
                cargarClientes();
            } else {
                await adminAPI.updateBarbero(usuarioEditar.idUsuario, usuarioEditar);
                showToast('Barbero actualizado exitosamente', 'success');
                cargarBarberosGestion();
            }
            setModalEditar(false);
            setUsuarioEditar(null);
        } catch (error) {
            console.error('Error al actualizar:', error);
            showToast(error.response?.data?.message || 'Error al actualizar', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!nuevaPassword || nuevaPassword.length < 6) {
            showToast('La contraseña debe tener al menos 6 caracteres', 'warning');
            return;
        }

        setLoading(true);
        try {
            if (vistaGestion === 'left') {
                await adminAPI.resetPasswordCliente(usuarioEditar.idUsuario, nuevaPassword);
            } else {
                await adminAPI.resetPasswordBarbero(usuarioEditar.idUsuario, nuevaPassword);
            }
            showToast('Contraseña actualizada exitosamente', 'success');
            setModalPassword(false);
            setNuevaPassword('');
            setUsuarioEditar(null);
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            showToast(error.response?.data?.message || 'Error al actualizar contraseña', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id, nombre, tipo) => {
        showConfirm(
            `¿Eliminar a ${nombre}?`,
            `Esta acción eliminará permanentemente a ${nombre} del sistema. Solo se puede eliminar si no tiene citas registradas.`,
            async () => {
                setLoading(true);
                try {
                    if (tipo === 'cliente') {
                        await adminAPI.deleteCliente(id);
                        cargarClientes();
                    } else {
                        await adminAPI.deleteBarbero(id);
                        cargarBarberosGestion();
                    }
                    showToast('Eliminado exitosamente', 'success');
                } catch (error) {
                    console.error('Error al eliminar:', error);
                    showToast(error.response?.data?.message || 'Error al eliminar. Verifica que no tenga citas registradas.', 'error');
                } finally {
                    setLoading(false);
                }
            },
            'danger'
        );
    };

    // ==================== FIN FUNCIONES DE GESTIÓN ====================

    // ==================== FUNCIONES DE SERVICIOS ====================

    const cargarServicios = async () => {
        setLoadingServicios(true);
        try {
            const response = await serviciosAPI.getAll();
            setServicios(response.data.data);
        } catch (error) {
            console.error('Error al cargar servicios:', error);
            showToast('Error al cargar servicios', 'error');
        } finally {
            setLoadingServicios(false);
        }
    };

    const filtrarServicios = () => {
        if (!busquedaServicio) return servicios;

        const busqueda = busquedaServicio.toLowerCase();
        return servicios.filter(s =>
            s.nombre?.toLowerCase().includes(busqueda)
        );
    };

    const getServiciosPaginados = () => paginate(filtrarServicios(), currentPageServicios);

    const abrirModalServicio = (servicio = null) => {
        if (servicio) {
            setServicioEditar(servicio);
            setFormServicio({
                nombre: servicio.nombre,
                duracion: servicio.duracion,
                precio: servicio.precio
            });
        } else {
            setServicioEditar(null);
            setFormServicio({
                nombre: '',
                duracion: '',
                precio: ''
            });
        }
        setModalServicio(true);
    };

    const cerrarModalServicio = () => {
        setModalServicio(false);
        setServicioEditar(null);
        setFormServicio({
            nombre: '',
            duracion: '',
            precio: ''
        });
    };

    const handleGuardarServicio = async (e) => {
        e.preventDefault();

        if (!formServicio.nombre || !formServicio.duracion || !formServicio.precio) {
            showToast('Todos los campos son requeridos', 'warning');
            return;
        }

        if (parseInt(formServicio.duracion) < 1) {
            showToast('La duración debe ser mayor a 0', 'warning');
            return;
        }

        if (parseFloat(formServicio.precio) < 0) {
            showToast('El precio debe ser mayor o igual a 0', 'warning');
            return;
        }

        setLoading(true);
        try {
            if (servicioEditar) {
                // Actualizar
                await serviciosAPI.actualizar(servicioEditar.idSer, {
                    ...formServicio,
                    activo: true
                });
                showToast('Servicio actualizado exitosamente', 'success');
            } else {
                // Crear nuevo
                await serviciosAPI.crear(formServicio);
                showToast('Servicio creado exitosamente', 'success');
            }

            cerrarModalServicio();
            cargarServicios();
        } catch (error) {
            console.error('Error al guardar servicio:', error);
            showToast(error.response?.data?.message || 'Error al guardar servicio', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarServicio = async (servicio) => {
        showConfirm(
            `¿Eliminar servicio "${servicio.nombre}"?`,
            'Este servicio dejará de estar disponible para nuevas citas. Las citas existentes no se verán afectadas.',
            async () => {
                setLoading(true);
                try {
                    await serviciosAPI.eliminar(servicio.idSer);
                    showToast('Servicio eliminado exitosamente', 'success');
                    cargarServicios();
                } catch (error) {
                    console.error('Error al eliminar servicio:', error);
                    showToast(error.response?.data?.message || 'Error al eliminar servicio', 'error');
                } finally {
                    setLoading(false);
                }
            },
            'danger'
        );
    };

    // ==================== FIN FUNCIONES DE SERVICIOS ====================

    const exportarDatos = () => {
        const headers = ['ID', 'Fecha', 'Hora', 'Cliente', 'Cédula', 'Barbero', 'Servicios', 'Total', 'Estado', 'Método Pago'];
        const rows = todasLasCitas.map(cita => [
            cita.idCita,
            new Date(cita.fecha).toLocaleDateString('es-CO'),
            cita.horaIn?.substring(0, 5),
            cita.nombreCliente,
            cita.cedulaCliente,
            cita.nombreBarbero,
            cita.servicios,
            cita.total,
            cita.estado,
            cita.metodoPago || 'N/A'
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `citas_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const contarFiltrosActivos = () => {
        return Object.values(filtros).filter(v => v !== '').length;
    };

    // Preparar opciones para el select de barberos
    const barberosOptions = barberos.map(b => ({
        value: b.idBarbero,
        label: b.nombre
    }));

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
                                <p className="text-sm text-white/80">Panel de Administración</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold">{user?.nombre}</p>
                                <p className="text-xs text-white/80">Administrador</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
                            >
                                <LogOut size={18} />
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
                        onClick={() => setActiveTab('estadisticas')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'estadisticas'
                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FaChartLine size={18} />
                        <span>Dashboard</span>
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
                        <span>Citas</span>
                        {contarFiltrosActivos() > 0 && (
                            <span className="bg-gold text-white text-xs font-bold px-2 py-1 rounded-full">
                                {contarFiltrosActivos()}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('ingresos')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'ingresos'
                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FaMoneyBillWave size={18} />
                        <span>Ingresos</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('crear')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'crear'
                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <UserPlus size={18} />
                        <span>Crear Cuenta</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('gestion')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'gestion'
                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FaCogs size={18} />
                        <span>Gestión</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('servicios')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'servicios'
                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FaCut size={18} />
                        <span>Servicios</span>
                    </button>
                </div>

                {/* DASHBOARD/ESTADÍSTICAS */}
                {activeTab === 'estadisticas' && estadisticas && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Cards principales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="stat-card">
                                <div className="flex items-center justify-between mb-3">
                                    <FaUserFriends className="w-10 h-10 text-primary" />
                                    <span className="badge badge-primary">Total</span>
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{estadisticas.totalClientes}</p>
                                <p className="text-sm text-gray-600 mt-1">Clientes Registrados</p>
                            </div>

                            <div className="stat-card border-secondary">
                                <div className="flex items-center justify-between mb-3">
                                    <FaUserTie className="w-10 h-10 text-secondary" />
                                    <span className="badge badge-info">Activos</span>
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{estadisticas.totalBarberos}</p>
                                <p className="text-sm text-gray-600 mt-1">Barberos Disponibles</p>
                            </div>

                            <div className="stat-card border-gold">
                                <div className="flex items-center justify-between mb-3">
                                    <FaClock className="w-10 h-10 text-gold" />
                                    <span className="badge badge-warning">Pendientes</span>
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{estadisticas.citasPendientes}</p>
                                <p className="text-sm text-gray-600 mt-1">Citas por Confirmar</p>
                            </div>

                            <div className="stat-card border-green-500">
                                <div className="flex items-center justify-between mb-3">
                                    <Calendar className="w-10 h-10 text-green-600" />
                                    <span className="badge badge-success">Hoy</span>
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{estadisticas.citasHoy}</p>
                                <p className="text-sm text-gray-600 mt-1">Citas Programadas</p>
                            </div>
                        </div>

                        {/* Ingresos Totales */}
                        {ingresos && (
                            <div className="card-retro">
                                <div className="flex items-center space-x-3 mb-6">
                                    <FaMoneyBillWave className="w-8 h-8 text-gold" />
                                    <h3 className="text-2xl font-bold text-gray-800">Resumen Financiero</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-300">
                                        <p className="text-sm text-green-700 font-semibold mb-2">INGRESOS TOTALES</p>
                                        <p className="text-4xl font-bold text-green-700">
                                            ${ingresos.ingresoTotal?.toLocaleString() || 0}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300">
                                        <p className="text-sm text-blue-700 font-semibold mb-2">CITAS COMPLETADAS</p>
                                        <p className="text-4xl font-bold text-blue-700">{ingresos.totalCitas || 0}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Estadísticas por Barbero */}
                        {estadisticasBarberos.length > 0 && (
                            <div className="card">
                                <div className="flex items-center space-x-3 mb-6">
                                    <FaCut className="w-7 h-7 text-primary" />
                                    <h3 className="text-2xl font-bold text-gray-800">Estadísticas por Barbero</h3>
                                </div>
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="table-retro">
                                        <thead>
                                            <tr>
                                                <th>Barbero</th>
                                                <th className="text-center">Total</th>
                                                <th className="text-center">
                                                    <FaHourglassHalf className="inline w-4 h-4 mr-1" />
                                                    Pendientes
                                                </th>
                                                <th className="text-center">
                                                    <FaCheckCircle className="inline w-4 h-4 mr-1" />
                                                    Confirmadas
                                                </th>
                                                <th className="text-center">
                                                    <FaCheckCircle className="inline w-4 h-4 mr-1 text-green-600" />
                                                    Completadas
                                                </th>
                                                <th className="text-center">
                                                    <FaBan className="inline w-4 h-4 mr-1" />
                                                    Canceladas
                                                </th>
                                                <th className="text-right">Ingresos</th>
                                                <th className="text-right">Comisión</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {estadisticasBarberos.map((barbero) => (
                                                <tr key={barbero.idBarbero}>
                                                    <td className="font-semibold">{barbero.nombreBarbero}</td>
                                                    <td className="text-center font-bold text-primary">
                                                        {barbero.totalCitas}
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge badge-warning">
                                                            {barbero.citasPendientes}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge badge-info">
                                                            {barbero.citasConfirmadas}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge badge-success">
                                                            {barbero.citasCompletadas}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge badge-danger">
                                                            {barbero.citasCanceladas}
                                                        </span>
                                                    </td>
                                                    <td className="text-right font-bold text-green-600">
                                                        ${barbero.ingresoTotal?.toLocaleString() || 0}
                                                    </td>
                                                    <td className="text-right font-semibold text-blue-600">
                                                        ${barbero.comisionTotal?.toLocaleString() || 0}
                                                        <span className="text-xs text-gray-500 ml-1">
                                                            ({barbero.comision}%)
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* CITAS */}
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
                            totalItems={todasLasCitas.length}
                        />

                        {/* Barra de búsqueda */}
                        <div className="card">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={filtros.busqueda}
                                        onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                                        placeholder="Buscar por nombre, cédula, correo..."
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
                                    onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
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
                            {loadingCitas && (
                                <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <span>Buscando en base de datos...</span>
                                </div>
                            )}
                        </div>

                        {/* Panel de filtros avanzados */}
                        {mostrarFiltrosAvanzados && (
                            <div className="filter-container animate-fadeIn">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                                        <FaFilter className="text-primary" />
                                        <span>Filtros Avanzados</span>
                                        <span className="badge badge-primary">{contarFiltrosActivos()} activos</span>
                                    </h3>
                                    <button
                                        onClick={limpiarFiltros}
                                        className="text-sm text-primary hover:text-secondary font-semibold flex items-center space-x-1"
                                    >
                                        <FaTimes size={16} />
                                        <span>Limpiar todo</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Estado */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Estado de Cita
                                        </label>
                                        <select
                                            value={filtros.estado}
                                            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="">Todos los estados</option>
                                            <option value="pendiente">Pendiente</option>
                                            <option value="confirmada">Confirmada</option>
                                            <option value="completada">Completada</option>
                                            <option value="cancelada">Cancelada</option>
                                        </select>
                                    </div>

                                    {/* Barbero con búsqueda */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <FaUserTie className="inline mr-1" />
                                            Barbero
                                        </label>
                                        <SelectBusqueda
                                            value={filtros.idBarbero}
                                            onChange={(value) => setFiltros({ ...filtros, idBarbero: value })}
                                            options={barberosOptions}
                                            valueKey="value"
                                            labelKey="label"
                                            placeholder="Todos los barberos"
                                        />
                                    </div>

                                    {/* Método de pago */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Método de Pago
                                        </label>
                                        <select
                                            value={filtros.metodoPago}
                                            onChange={(e) => setFiltros({ ...filtros, metodoPago: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="">Todos</option>
                                            <option value="efectivo">Efectivo</option>
                                            <option value="tarjeta">Tarjeta</option>
                                            <option value="transferencia">Transferencia</option>
                                        </select>
                                    </div>

                                    {/* Fecha inicio */}
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

                                    {/* Fecha fin */}
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
                                </div>

                                {/* Botón limpiar filtros */}
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        onClick={limpiarFiltros}
                                        className="btn-outline"
                                    >
                                        Limpiar Todos
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Estadísticas de resultados */}
                        {estadisticasCitas && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="bg-white rounded-lg p-4 border-l-4 border-primary">
                                    <p className="text-sm text-gray-600">Total</p>
                                    <p className="text-2xl font-bold text-primary">{estadisticasCitas.totalCitas}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
                                    <p className="text-sm text-gray-600">Pendientes</p>
                                    <p className="text-2xl font-bold text-yellow-600">{estadisticasCitas.pendientes}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                                    <p className="text-sm text-gray-600">Confirmadas</p>
                                    <p className="text-2xl font-bold text-blue-600">{estadisticasCitas.confirmadas}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                                    <p className="text-sm text-gray-600">Completadas</p>
                                    <p className="text-2xl font-bold text-green-600">{estadisticasCitas.completadas}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                                    <p className="text-sm text-gray-600">Canceladas</p>
                                    <p className="text-2xl font-bold text-red-600">{estadisticasCitas.canceladas}</p>
                                </div>
                            </div>
                        )}

                        {/* Tabla de resultados */}
                        <div className="card">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                                    <FaCalendarCheck className="text-primary" />
                                    <span>Resultados ({todasLasCitas.length})</span>
                                </h2>
                                <button
                                    onClick={exportarDatos}
                                    className="btn-gold flex items-center space-x-2"
                                    disabled={todasLasCitas.length === 0}
                                >
                                    <FaDownload />
                                    <span>Exportar CSV</span>
                                </button>
                            </div>

                            {loadingCitas ? (
                                <div className="py-12">
                                    <div className="flex items-center justify-center space-x-3 mb-4">
                                        <FaSync className="animate-spin text-primary w-8 h-8" />
                                        <p className="text-gray-600 text-lg">Cargando citas...</p>
                                    </div>
                                </div>
                            ) : todasLasCitas.length === 0 ? (
                                <div className="text-center py-12">
                                    <FaDatabase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No se encontraron citas con estos filtros</p>
                                    {contarFiltrosActivos() > 0 && (
                                        <button
                                            onClick={limpiarFiltros}
                                            className="mt-4 text-primary hover:text-secondary font-semibold"
                                        >
                                            Limpiar filtros y ver todas
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <table className="table-retro table-optimized">
                                            <thead>
                                                <tr>
                                                    <th className="table-cell-sm">ID</th>
                                                    <th className="table-cell-md">Fecha</th>
                                                    <th className="table-cell-sm">Hora</th>
                                                    <th className="table-cell-lg">Cliente</th>
                                                    <th className="table-cell-lg">Barbero</th>
                                                    <th className="table-cell-xl">Servicios</th>
                                                    <th className="table-cell-md">Método</th>
                                                    <th className="text-right table-cell-md">Total</th>
                                                    <th className="text-center table-cell-md">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getCitasPaginadas().map((cita) => (
                                                <tr key={cita.idCita}>
                                                    <td className="font-mono text-sm table-cell-sm">
                                                        #{cita.idCita}
                                                    </td>
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
                                                    <td className="table-cell-lg table-cell-tooltip" 
                                                        data-tooltip={`${cita.nombreCliente} - ${cita.correoCliente}`}>
                                                        <div className="table-cell-content">
                                                            <p className="font-semibold">{cita.nombreCliente}</p>
                                                            <p className="text-xs text-gray-500">{cita.correoCliente}</p>
                                                        </div>
                                                    </td>
                                                    <td className="table-cell-lg table-cell-tooltip" 
                                                        data-tooltip={cita.nombreBarbero}>
                                                        <span className="table-cell-content">{cita.nombreBarbero}</span>
                                                    </td>
                                                    <td className="table-cell-xl table-cell-tooltip"
                                                        data-tooltip={cita.servicios}>
                                                        <span className="text-sm text-gray-600 table-cell-content">
                                                            {cita.servicios}
                                                        </span>
                                                    </td>
                                                    <td className="table-cell-md">
                                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                            {cita.metodoPago || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="text-right font-bold text-primary table-cell-md">
                                                        ${cita.total?.toLocaleString()}
                                                    </td>
                                                    <td className="text-center table-cell-md">
                                                        <span className={`badge whitespace-nowrap ${
                                                            cita.estado === 'completada' ? 'badge-success' :
                                                            cita.estado === 'confirmada' ? 'badge-info' :
                                                            cita.estado === 'cancelada' ? 'badge-danger' :
                                                            'badge-warning'
                                                        }`}>
                                                            {cita.estado === 'completada' && <FaCheckCircle className="inline w-3 h-3 mr-1" />}
                                                            {cita.estado === 'cancelada' && <FaTimesCircle className="inline w-3 h-3 mr-1" />}
                                                            {cita.estado === 'pendiente' && <FaClock className="inline w-3 h-3 mr-1" />}
                                                            {cita.estado}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Paginación */}
                                {todasLasCitas.length > itemsPerPage && (
                                    <div className="mt-6">
                                        <Pagination
                                            currentPage={currentPageCitas}
                                            totalPages={getTotalPages(todasLasCitas.length)}
                                            onPageChange={setCurrentPageCitas}
                                            itemsPerPage={itemsPerPage}
                                            totalItems={todasLasCitas.length}
                                        />
                                    </div>
                                )}
                            </>
                            )}
                        </div>
                    </div>
                )}

                {/* INGRESOS */}
                {activeTab === 'ingresos' && (
                    <div className="card animate-fadeIn">
                        <div className="flex items-center space-x-3 mb-6">
                            <FaMoneyBillWave className="w-7 h-7 text-gold" />
                            <h2 className="text-2xl font-bold text-gray-800">Ingresos por Barbero</h2>
                        </div>
                        {ingresosPorBarbero.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No hay ingresos registrados</p>
                        ) : (
                            <div className="grid gap-4">
                                {ingresosPorBarbero.map((barbero, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                                            <FaUserTie className="text-primary" />
                                            <span>{barbero.nombreBarbero}</span>
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Total Citas</p>
                                                <p className="text-xl font-semibold text-gray-800">{barbero.totalCitas}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Ingresos</p>
                                                <p className="text-xl font-semibold text-green-600">
                                                    ${barbero.ingresoTotal?.toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Comisión ({barbero.comision}%)</p>
                                                <p className="text-xl font-semibold text-blue-600">
                                                    ${barbero.comisionTotal?.toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Ganancia Neta</p>
                                                <p className="text-xl font-semibold text-primary">
                                                    ${((barbero.ingresoTotal || 0) - (barbero.comisionTotal || 0)).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* CREAR CUENTA */}
                {activeTab === 'crear' && (
                    <div className="card animate-fadeIn">
                        <div className="flex items-center space-x-3 mb-6">
                            <UserPlus className="w-7 h-7 text-primary" />
                            <h2 className="text-2xl font-bold text-gray-800">Crear Nueva Cuenta</h2>
                        </div>
                        <form onSubmit={handleCrearCuenta} className="max-w-2xl mx-auto space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={formCuenta.nombre}
                                        onChange={(e) => setFormCuenta({ ...formCuenta, nombre: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Cédula
                                    </label>
                                    <input
                                        type="text"
                                        value={formCuenta.cedula}
                                        onChange={(e) => setFormCuenta({ ...formCuenta, cedula: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        value={formCuenta.correo}
                                        onChange={(e) => setFormCuenta({ ...formCuenta, correo: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        value={formCuenta.telefono}
                                        onChange={(e) => setFormCuenta({ ...formCuenta, telefono: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={formCuenta.contrasena}
                                        onChange={(e) => setFormCuenta({ ...formCuenta, contrasena: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Rol
                                    </label>
                                    <select
                                        value={formCuenta.rol}
                                        onChange={(e) => setFormCuenta({ ...formCuenta, rol: e.target.value })}
                                        className="input-field"
                                        required
                                    >
                                        <option value="cliente">Cliente</option>
                                        <option value="barbero">Barbero</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>

                                {formCuenta.rol === 'barbero' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Comisión (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formCuenta.comision}
                                            onChange={(e) => setFormCuenta({ ...formCuenta, comision: parseFloat(e.target.value) })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3 disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <FaSync className="animate-spin" />
                                        <span>Creando...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={20} />
                                        <span>Crear Cuenta</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* GESTIÓN TÉCNICA */}
                {activeTab === 'gestion' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Switch Clientes/Barberos */}
                        <div className="flex justify-center mb-6">
                            <ToggleSwitch
                                value={vistaGestion}
                                onChange={(value) => setVistaGestion(value)}
                                leftLabel="Clientes"
                                rightLabel="Barberos"
                                leftIcon={FaUserFriends}
                                rightIcon={FaUserTie}
                            />
                        </div>

                        {/* Barra de búsqueda y filtros */}
                        <div className="card">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Búsqueda */}
                                <div className="md:col-span-2 relative">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={filtroGestion}
                                        onChange={(e) => setFiltroGestion(e.target.value)}
                                        placeholder="Buscar por nombre, correo, cédula o teléfono..."
                                        className="input-field pl-10 w-full"
                                    />
                                </div>

                                {/* Filtro de ordenamiento para Clientes */}
                                {vistaGestion === 'left' && (
                                    <div>
                                        <select
                                            value={ordenClientes}
                                            onChange={(e) => setOrdenClientes(e.target.value)}
                                            className="input-field w-full"
                                        >
                                            <option value="gastado">Mayor gastador</option>
                                            <option value="citas">Más citas</option>
                                            <option value="reciente">Más reciente</option>
                                        </select>
                                    </div>
                                )}

                                {/* Filtro de ordenamiento para Barberos */}
                                {vistaGestion === 'right' && (
                                    <div>
                                        <select
                                            value={ordenBarberos}
                                            onChange={(e) => setOrdenBarberos(e.target.value)}
                                            className="input-field w-full"
                                        >
                                            <option value="citas">Más trabajados</option>
                                            <option value="ingresos">Mayores ingresos</option>
                                            <option value="comision">Mayor comisión</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tabla de Clientes */}
                        {vistaGestion === 'left' && (
                            <div className="card">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                                    <FaUserFriends className="text-primary" />
                                    <span>Gestión de Clientes ({filtrarYOrdenarClientes().length})</span>
                                </h2>

                                {loadingGestion ? (
                                    <div className="py-12">
                                        <div className="flex items-center justify-center space-x-3">
                                            <FaSync className="animate-spin text-primary w-8 h-8" />
                                            <p className="text-gray-600 text-lg">Cargando clientes...</p>
                                        </div>
                                    </div>
                                ) : filtrarYOrdenarClientes().length === 0 ? (
                                    <div className="text-center py-12">
                                        <FaUserFriends className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No se encontraron clientes</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto custom-scrollbar">
                                            <table className="table-retro">
                                                <thead>
                                                    <tr>
                                                        <th>Cliente</th>
                                                        <th>Contacto</th>
                                                        <th>Cédula</th>
                                                        <th>Registro</th>
                                                        <th className="text-center">Citas</th>
                                                        <th className="text-right">Gastado</th>
                                                        <th className="text-center">Última Cita</th>
                                                        <th className="text-center">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getClientesPaginados().map((cliente) => (
                                                    <tr key={cliente.idUsuario}>
                                                        <td className="font-semibold">{cliente.nombre}</td>
                                                        <td>
                                                            <div className="space-y-1">
                                                                <p className="text-sm flex items-center space-x-1">
                                                                    <FaEnvelope className="text-gray-400 w-3 h-3" />
                                                                    <span>{cliente.correo}</span>
                                                                </p>
                                                                <p className="text-sm flex items-center space-x-1">
                                                                    <FaPhone className="text-gray-400 w-3 h-3" />
                                                                    <span>{cliente.telefono}</span>
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="font-mono text-sm">{cliente.cedula}</td>
                                                        <td className="text-sm whitespace-nowrap">
                                                            {new Date(cliente.fechaRegistro).toLocaleDateString('es-CO')}
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="space-y-1">
                                                                <p className="font-bold text-primary text-lg">{cliente.totalCitas}</p>
                                                                <div className="flex justify-center space-x-1">
                                                                    <span className="badge badge-success text-xs">{cliente.citasCompletadas}</span>
                                                                    <span className="badge badge-danger text-xs">{cliente.citasCanceladas}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-right font-bold text-green-600 whitespace-nowrap">
                                                            ${cliente.totalGastado?.toLocaleString() || 0}
                                                        </td>
                                                        <td className="text-center text-sm whitespace-nowrap">
                                                            {cliente.ultimaCita ? new Date(cliente.ultimaCita).toLocaleDateString('es-CO') : '-'}
                                                        </td>
                                                        <td>
                                                            <div className="flex items-center justify-center space-x-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEditarUsuario(cliente)}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Editar información"
                                                                >
                                                                    <FaEdit size={16} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setUsuarioEditar(cliente);
                                                                        setModalPassword(true);
                                                                    }}
                                                                    className="p-2 text-gold hover:bg-yellow-50 rounded-lg transition-colors"
                                                                    title="Resetear contraseña"
                                                                >
                                                                    <FaKey size={16} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEliminar(cliente.idUsuario, cliente.nombre, 'cliente')}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Eliminar cliente"
                                                                >
                                                                    <FaTrash size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Paginación */}
                                    {filtrarYOrdenarClientes().length > itemsPerPage && (
                                        <div className="mt-6">
                                            <Pagination
                                                currentPage={currentPageClientes}
                                                totalPages={getTotalPages(filtrarYOrdenarClientes().length)}
                                                onPageChange={setCurrentPageClientes}
                                                itemsPerPage={itemsPerPage}
                                                totalItems={filtrarYOrdenarClientes().length}
                                            />
                                        </div>
                                    )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Tabla de Barberos */}
                        {vistaGestion === 'right' && (
                            <div className="card">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                                    <FaUserTie className="text-primary" />
                                    <span>Gestión de Barberos ({filtrarYOrdenarBarberos().length})</span>
                                </h2>

                                {loadingGestion ? (
                                    <div className="py-12">
                                        <div className="flex items-center justify-center space-x-3">
                                            <FaSync className="animate-spin text-primary w-8 h-8" />
                                            <p className="text-gray-600 text-lg">Cargando barberos...</p>
                                        </div>
                                    </div>
                                ) : filtrarYOrdenarBarberos().length === 0 ? (
                                    <div className="text-center py-12">
                                        <FaUserTie className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No se encontraron barberos</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto custom-scrollbar">
                                            <table className="table-retro">
                                                <thead>
                                                    <tr>
                                                        <th>Barbero</th>
                                                        <th>Contacto</th>
                                                        <th>Cédula</th>
                                                        <th className="text-center">Comisión</th>
                                                        <th className="text-center">Citas</th>
                                                        <th className="text-right">Ingresos</th>
                                                        <th className="text-right">Comisión</th>
                                                        <th className="text-center">Última Cita</th>
                                                        <th className="text-center">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getBarberosPaginados().map((barbero) => (
                                                    <tr key={barbero.idUsuario}>
                                                        <td className="font-semibold">{barbero.nombre}</td>
                                                        <td>
                                                            <div className="space-y-1">
                                                                <p className="text-sm flex items-center space-x-1">
                                                                    <FaEnvelope className="text-gray-400 w-3 h-3" />
                                                                    <span>{barbero.correo}</span>
                                                                </p>
                                                                <p className="text-sm flex items-center space-x-1">
                                                                    <FaPhone className="text-gray-400 w-3 h-3" />
                                                                    <span>{barbero.telefono}</span>
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="font-mono text-sm">{barbero.cedula}</td>
                                                        <td className="text-center">
                                                            <span className="badge badge-primary font-bold">
                                                                <FaPercent className="inline w-3 h-3 mr-1" />
                                                                {barbero.comision}%
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="space-y-1">
                                                                <p className="font-bold text-primary text-lg">{barbero.totalCitas}</p>
                                                                <div className="flex justify-center space-x-1">
                                                                    <span className="badge badge-success text-xs">{barbero.citasCompletadas}</span>
                                                                    <span className="badge badge-warning text-xs">{barbero.citasPendientes}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-right font-bold text-green-600 whitespace-nowrap">
                                                            ${barbero.ingresoGenerado?.toLocaleString() || 0}
                                                        </td>
                                                        <td className="text-right font-bold text-blue-600 whitespace-nowrap">
                                                            ${barbero.comisionTotal?.toLocaleString() || 0}
                                                        </td>
                                                        <td className="text-center text-sm whitespace-nowrap">
                                                            {barbero.ultimaCita ? new Date(barbero.ultimaCita).toLocaleDateString('es-CO') : '-'}
                                                        </td>
                                                        <td>
                                                            <div className="flex items-center justify-center space-x-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEditarUsuario(barbero)}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Editar información y comisión"
                                                                >
                                                                    <FaEdit size={16} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setUsuarioEditar(barbero);
                                                                        setModalPassword(true);
                                                                    }}
                                                                    className="p-2 text-gold hover:bg-yellow-50 rounded-lg transition-colors"
                                                                    title="Resetear contraseña"
                                                                >
                                                                    <FaKey size={16} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEliminar(barbero.idUsuario, barbero.nombre, 'barbero')}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Eliminar barbero"
                                                                >
                                                                    <FaTrash size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Paginación */}
                                    {filtrarYOrdenarBarberos().length > itemsPerPage && (
                                        <div className="mt-6">
                                            <Pagination
                                                currentPage={currentPageBarberos}
                                                totalPages={getTotalPages(filtrarYOrdenarBarberos().length)}
                                                onPageChange={setCurrentPageBarberos}
                                                itemsPerPage={itemsPerPage}
                                                totalItems={filtrarYOrdenarBarberos().length}
                                            />
                                        </div>
                                    )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Modal de Edición */}
                        <Modal
                            isOpen={modalEditar}
                            onClose={() => {
                                setModalEditar(false);
                                setUsuarioEditar(null);
                            }}
                            title={`Editar ${vistaGestion === 'left' ? 'Cliente' : 'Barbero'}`}
                        >
                            {usuarioEditar && (
                                <form onSubmit={handleGuardarEdicion} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                <FaUser className="inline mr-1" />
                                                Nombre Completo
                                            </label>
                                            <input
                                                type="text"
                                                value={usuarioEditar.nombre}
                                                onChange={(e) => setUsuarioEditar({ ...usuarioEditar, nombre: e.target.value })}
                                                className="input-field"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                <FaIdCard className="inline mr-1" />
                                                Cédula
                                            </label>
                                            <input
                                                type="text"
                                                value={usuarioEditar.cedula}
                                                onChange={(e) => setUsuarioEditar({ ...usuarioEditar, cedula: e.target.value })}
                                                className="input-field"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                <FaEnvelope className="inline mr-1" />
                                                Correo Electrónico
                                            </label>
                                            <input
                                                type="email"
                                                value={usuarioEditar.correo}
                                                onChange={(e) => setUsuarioEditar({ ...usuarioEditar, correo: e.target.value })}
                                                className="input-field"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                <FaPhone className="inline mr-1" />
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                value={usuarioEditar.telefono}
                                                onChange={(e) => setUsuarioEditar({ ...usuarioEditar, telefono: e.target.value })}
                                                className="input-field"
                                                required
                                            />
                                        </div>

                                        {vistaGestion === 'right' && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    <FaPercent className="inline mr-1" />
                                                    Porcentaje de Comisión
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    value={usuarioEditar.comision}
                                                    onChange={(e) => setUsuarioEditar({ ...usuarioEditar, comision: parseFloat(e.target.value) })}
                                                    className="input-field"
                                                    required
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Ingresa el porcentaje que gana el barbero por cada servicio completado (0-100%)</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setModalEditar(false);
                                                setUsuarioEditar(null);
                                            }}
                                            className="btn-outline"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary disabled:opacity-50"
                                        >
                                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Modal>

                        {/* Modal de Resetear Contraseña */}
                        <Modal
                            isOpen={modalPassword}
                            onClose={() => {
                                setModalPassword(false);
                                setNuevaPassword('');
                                setUsuarioEditar(null);
                            }}
                            title="Resetear Contraseña"
                        >
                            {usuarioEditar && (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                        <p className="text-sm text-blue-800">
                                            <strong>Usuario:</strong> {usuarioEditar.nombre}
                                        </p>
                                        <p className="text-sm text-blue-800">
                                            <strong>Correo:</strong> {usuarioEditar.correo}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            <FaKey className="inline mr-1" />
                                            Nueva Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={nuevaPassword}
                                            onChange={(e) => setNuevaPassword(e.target.value)}
                                            className="input-field"
                                            placeholder="Mínimo 6 caracteres"
                                            minLength={6}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">La contraseña debe tener al menos 6 caracteres</p>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setModalPassword(false);
                                                setNuevaPassword('');
                                                setUsuarioEditar(null);
                                            }}
                                            className="btn-outline"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleResetPassword}
                                            disabled={loading || !nuevaPassword || nuevaPassword.length < 6}
                                            className="btn-primary disabled:opacity-50"
                                        >
                                            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Modal>
                    </div>
                )}

                {/* SERVICIOS */}
                {activeTab === 'servicios' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Header con búsqueda y botón crear */}
                        <div className="card">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center space-x-3">
                                    <FaCut className="w-7 h-7 text-primary" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">Gestión de Servicios</h2>
                                        <p className="text-sm text-gray-600">Administra los servicios disponibles en la barbería</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => abrirModalServicio()}
                                    className="btn-primary flex items-center space-x-2"
                                >
                                    <FaCut />
                                    <span>Nuevo Servicio</span>
                                </button>
                            </div>

                            {/* Barra de búsqueda */}
                            <div className="mt-4 relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={busquedaServicio}
                                    onChange={(e) => {
                                        setBusquedaServicio(e.target.value);
                                        setCurrentPageServicios(1);
                                    }}
                                    placeholder="Buscar servicio por nombre..."
                                    className="input-field pl-10 pr-10"
                                />
                                {busquedaServicio && (
                                    <button
                                        onClick={() => {
                                            setBusquedaServicio('');
                                            setCurrentPageServicios(1);
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <FaTimes size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tabla de servicios */}
                        <div className="card">
                            {loadingServicios ? (
                                <div className="py-12">
                                    <div className="flex items-center justify-center space-x-3">
                                        <FaSync className="animate-spin text-primary w-8 h-8" />
                                        <p className="text-gray-600 text-lg">Cargando servicios...</p>
                                    </div>
                                </div>
                            ) : filtrarServicios().length === 0 ? (
                                <div className="text-center py-12">
                                    <FaCut className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg mb-2">
                                        {busquedaServicio ? 'No se encontraron servicios' : 'No hay servicios registrados'}
                                    </p>
                                    {busquedaServicio && (
                                        <button
                                            onClick={() => setBusquedaServicio('')}
                                            className="btn-outline mt-4"
                                        >
                                            <FaTimes className="inline mr-2" />
                                            Limpiar búsqueda
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <table className="table-retro">
                                            <thead>
                                                <tr>
                                                    <th>Servicio</th>
                                                    <th className="text-center">Duración (min)</th>
                                                    <th className="text-right">Precio</th>
                                                    <th className="text-center">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getServiciosPaginados().map((servicio) => (
                                                    <tr key={servicio.idSer}>
                                                        <td className="font-semibold">
                                                            <div className="flex items-center space-x-2">
                                                                <FaCut className="text-primary" />
                                                                <span>{servicio.nombre}</span>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <span className="badge badge-info">
                                                                <FaClock className="inline w-3 h-3 mr-1" />
                                                                {servicio.duracion} min
                                                            </span>
                                                        </td>
                                                        <td className="text-right">
                                                            <span className="text-lg font-bold text-primary">
                                                                ${parseFloat(servicio.precio).toLocaleString('es-CO')}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="flex items-center justify-center space-x-2">
                                                                <button
                                                                    onClick={() => abrirModalServicio(servicio)}
                                                                    className="btn-icon btn-icon-primary"
                                                                    title="Editar servicio"
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEliminarServicio(servicio)}
                                                                    className="btn-icon btn-icon-danger"
                                                                    title="Eliminar servicio"
                                                                    disabled={loading}
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Paginación */}
                                    {filtrarServicios().length > itemsPerPage && (
                                        <div className="mt-6">
                                            <Pagination
                                                currentPage={currentPageServicios}
                                                totalPages={getTotalPages(filtrarServicios().length)}
                                                onPageChange={setCurrentPageServicios}
                                                itemsPerPage={itemsPerPage}
                                                totalItems={filtrarServicios().length}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Modal Crear/Editar Servicio */}
                        <Modal
                            isOpen={modalServicio}
                            onClose={cerrarModalServicio}
                            title={servicioEditar ? 'Editar Servicio' : 'Nuevo Servicio'}
                        >
                            <form onSubmit={handleGuardarServicio} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        <FaCut className="inline mr-1" />
                                        Nombre del Servicio
                                    </label>
                                    <input
                                        type="text"
                                        value={formServicio.nombre}
                                        onChange={(e) => setFormServicio({ ...formServicio, nombre: e.target.value })}
                                        className="input-field"
                                        placeholder="Ej: Corte de cabello, Barba, etc."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        <FaClock className="inline mr-1" />
                                        Duración (minutos)
                                    </label>
                                    <input
                                        type="number"
                                        value={formServicio.duracion}
                                        onChange={(e) => setFormServicio({ ...formServicio, duracion: e.target.value })}
                                        className="input-field"
                                        placeholder="Ej: 30, 45, 60"
                                        min="1"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Tiempo estimado del servicio</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        <FaMoneyBillWave className="inline mr-1" />
                                        Precio (COP)
                                    </label>
                                    <input
                                        type="number"
                                        value={formServicio.precio}
                                        onChange={(e) => setFormServicio({ ...formServicio, precio: e.target.value })}
                                        className="input-field"
                                        placeholder="Ej: 15000, 20000"
                                        min="0"
                                        step="1000"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Precio del servicio en pesos colombianos</p>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={cerrarModalServicio}
                                        className="btn-outline"
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <span className="flex items-center space-x-2">
                                                <FaSync className="animate-spin" />
                                                <span>Guardando...</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center space-x-2">
                                                <FaCheckCircle />
                                                <span>{servicioEditar ? 'Actualizar' : 'Crear'} Servicio</span>
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </Modal>
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
