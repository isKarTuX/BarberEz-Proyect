import React, { memo, useMemo, useCallback } from 'react';
import { FaClock, FaUser, FaCut, FaMoneyBillWave, FaCheck, FaBan, FaCheckCircle, FaTrash } from 'react-icons/fa';

const CitaCard = memo(function CitaCard({
    cita,
    size = 'normal',
    onConfirmar,
    onRechazar,
    onCompletar,
    onCancelar,
    loading,
    userComision,
    showActions = true,
    showCancelButton = false
}) {
    const getSizeClasses = () => {
        switch (size) {
            case 'compact':
                return {
                    card: 'p-2',
                    hora: 'text-lg',
                    badge: 'text-xs px-1.5 py-0.5',
                    text: 'text-xs',
                    icon: 10,
                    button: 'px-2 py-1 text-xs',
                    spacing: 'space-y-1'
                };
            case 'comfortable':
                return {
                    card: 'p-5',
                    hora: 'text-3xl',
                    badge: 'text-sm px-3 py-1',
                    text: 'text-base',
                    icon: 16,
                    button: 'px-4 py-2.5 text-sm',
                    spacing: 'space-y-4'
                };
            default: // normal
                return {
                    card: 'p-3',
                    hora: 'text-xl',
                    badge: 'text-xs px-2 py-0.5',
                    text: 'text-sm',
                    icon: 12,
                    button: 'px-3 py-1.5 text-sm',
                    spacing: 'space-y-2'
                };
        }
    };

    const classes = getSizeClasses();

    // Memoizar cálculos de estilo para evitar re-cálculos innecesarios
    const estadoColor = useMemo(() => {
        switch (cita.estado) {
            case 'completada':
                return 'border-green-300 bg-green-50';
            case 'confirmada':
                return 'border-primary/30 bg-primary/5';
            case 'pendiente':
                return 'border-yellow-300 bg-yellow-50';
            default:
                return 'border-gray-200';
        }
    }, [cita.estado]);

    const estadoBadge = useMemo(() => {
        switch (cita.estado) {
            case 'completada':
                return 'badge-success';
            case 'confirmada':
                return 'badge-info';
            case 'pendiente':
                return 'badge-warning';
            default:
                return 'badge-danger';
        }
    }, [cita.estado]);

    // Memoizar comisión calculada
    const comisionCalculada = useMemo(() => {
        if (userComision && cita.estado === 'completada' && cita.total) {
            return (cita.total * userComision / 100).toLocaleString();
        }
        return null;
    }, [userComision, cita.estado, cita.total]);

    // Callbacks memoizados para evitar recreación en cada render
    const handleConfirmar = useCallback(() => {
        if (onConfirmar) onConfirmar(cita.idCita);
    }, [onConfirmar, cita.idCita]);

    const handleRechazar = useCallback(() => {
        if (onRechazar) onRechazar(cita.idCita);
    }, [onRechazar, cita.idCita]);

    const handleCompletar = useCallback(() => {
        if (onCompletar) onCompletar(cita.idCita);
    }, [onCompletar, cita.idCita]);

    const handleCancelar = useCallback(() => {
        if (onCancelar) onCancelar();
    }, [onCancelar]);

    return (
        <div className={`border-2 rounded-lg ${classes.card} ${estadoColor} transition-all hover:shadow-md`}>
            <div className={classes.spacing}>
                {/* Header con hora y estado */}
                <div className="flex items-center justify-between">
                    <span className={`${classes.hora} font-bold text-primary flex items-center`}>
                        <FaClock className="mr-1" size={classes.icon} aria-hidden="true" />
                        {cita.horaIn?.substring(0, 5)}
                    </span>
                    <span className={`badge ${classes.badge} ${estadoBadge}`}>
                        {cita.estado}
                    </span>
                </div>

                {/* Información del cliente y servicios */}
                <div className={`${classes.spacing} ${size === 'compact' ? 'space-y-0.5' : ''}`}>
                    <p className={classes.text}>
                        <FaUser className="inline text-primary mr-1" size={classes.icon - 2} aria-hidden="true" />
                        <span className="font-semibold">{cita.nombreCliente || cita.nombreBarbero || 'N/A'}</span>
                    </p>
                    <p className={`${classes.text} text-gray-600 ${size === 'compact' ? 'truncate' : ''}`}>
                        <FaCut className="inline text-primary mr-1" size={classes.icon - 2} aria-hidden="true" />
                        {cita.servicios || 'Sin servicios'}
                    </p>
                </div>

                {/* Total y comisión */}
                <div className={`flex items-center justify-between border-t pt-${size === 'compact' ? '1' : '2'}`}>
                    <p className={`${size === 'compact' ? 'text-sm' : 'text-base'} font-bold text-primary`}>
                        <FaMoneyBillWave className="inline mr-1" size={classes.icon} aria-hidden="true" />
                        ${cita.total?.toLocaleString() || '0'}
                    </p>
                    {comisionCalculada && (
                        <p className={`${classes.text} text-green-600 font-semibold`}>
                            +${comisionCalculada}
                        </p>
                    )}
                </div>

                {/* Botones de acción */}
                {showActions && (
                    <div className="flex gap-1.5">
                        {showCancelButton && cita.estado === 'pendiente' && (
                            <button
                                onClick={handleCancelar}
                                disabled={loading}
                                aria-label="Cancelar cita"
                                className={`btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white w-full flex items-center justify-center space-x-1 ${classes.button}`}
                            >
                                <FaTrash size={classes.icon - 2} aria-hidden="true" />
                                {size !== 'compact' && <span>Cancelar</span>}
                            </button>
                        )}
                        {!showCancelButton && cita.estado === 'pendiente' && (
                            <>
                                <button
                                    onClick={handleConfirmar}
                                    disabled={loading}
                                    aria-label="Confirmar cita"
                                    className={`btn-primary flex-1 flex items-center justify-center space-x-1 ${classes.button}`}
                                >
                                    <FaCheck size={classes.icon - 2} aria-hidden="true" />
                                    {size !== 'compact' && <span>Confirmar</span>}
                                </button>
                                <button
                                    onClick={handleRechazar}
                                    disabled={loading}
                                    aria-label="Rechazar cita"
                                    className={`btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex-1 flex items-center justify-center space-x-1 ${classes.button}`}
                                >
                                    <FaBan size={classes.icon - 2} aria-hidden="true" />
                                    {size !== 'compact' && <span>Rechazar</span>}
                                </button>
                            </>
                        )}
                        {cita.estado === 'confirmada' && (
                            <button
                                onClick={handleCompletar}
                                disabled={loading}
                                aria-label="Completar cita"
                                className={`btn-gold w-full flex items-center justify-center space-x-1 ${classes.button}`}
                            >
                                <FaCheckCircle size={classes.icon} aria-hidden="true" />
                                <span>Completar</span>
                            </button>
                        )}
                        {cita.estado === 'completada' && (
                            <div className={`bg-green-100 text-green-800 w-full ${classes.button} rounded-lg font-semibold text-center`} role="status">
                                <FaCheckCircle className="inline mr-1" size={classes.icon} aria-hidden="true" />
                                Finalizada
                            </div>
                        )}
                        {cita.estado === 'cancelada' && (
                            <div className={`bg-red-100 text-red-800 w-full ${classes.button} rounded-lg font-semibold text-center`} role="status">
                                <FaBan className="inline mr-1" size={classes.icon} aria-hidden="true" />
                                Cancelada
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison: solo re-renderizar si cambian estos valores
    return prevProps.cita.idCita === nextProps.cita.idCita &&
           prevProps.cita.estado === nextProps.cita.estado &&
           prevProps.cita.total === nextProps.cita.total &&
           prevProps.loading === nextProps.loading &&
           prevProps.size === nextProps.size;
});

export default CitaCard;

