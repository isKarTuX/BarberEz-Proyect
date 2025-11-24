import React from 'react';
import { FaClock, FaUser, FaCut, FaMoneyBillWave, FaCheck, FaBan, FaCheckCircle } from 'react-icons/fa';

export default function CitaCard({ cita, size = 'normal', onConfirmar, onRechazar, onCompletar, loading, userComision }) {
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

    const getEstadoColor = () => {
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
    };

    const getEstadoBadge = () => {
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
    };

    return (
        <div className={`border-2 rounded-lg ${classes.card} ${getEstadoColor()} transition-all hover:shadow-md`}>
            <div className={classes.spacing}>
                {/* Header con hora y estado */}
                <div className="flex items-center justify-between">
                    <span className={`${classes.hora} font-bold text-primary flex items-center`}>
                        <FaClock className="mr-1" size={classes.icon} />
                        {cita.horaIn?.substring(0, 5)}
                    </span>
                    <span className={`badge ${classes.badge} ${getEstadoBadge()}`}>
                        {cita.estado}
                    </span>
                </div>

                {/* Información del cliente y servicios */}
                <div className={`${classes.spacing} ${size === 'compact' ? 'space-y-0.5' : ''}`}>
                    <p className={classes.text}>
                        <FaUser className="inline text-primary mr-1" size={classes.icon - 2} />
                        <span className="font-semibold">{cita.nombreCliente}</span>
                    </p>
                    <p className={`${classes.text} text-gray-600 ${size === 'compact' ? 'truncate' : ''}`}>
                        <FaCut className="inline text-primary mr-1" size={classes.icon - 2} />
                        {cita.servicios}
                    </p>
                </div>

                {/* Total y comisión */}
                <div className={`flex items-center justify-between border-t pt-${size === 'compact' ? '1' : '2'}`}>
                    <p className={`${size === 'compact' ? 'text-sm' : 'text-base'} font-bold text-primary`}>
                        <FaMoneyBillWave className="inline mr-1" size={classes.icon} />
                        ${cita.total?.toLocaleString()}
                    </p>
                    {userComision && cita.estado === 'completada' && (
                        <p className={`${classes.text} text-green-600 font-semibold`}>
                            +${((cita.total * userComision / 100) || 0).toLocaleString()}
                        </p>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-1.5">
                    {cita.estado === 'pendiente' && (
                        <>
                            <button
                                onClick={() => onConfirmar(cita.idCita)}
                                disabled={loading}
                                className={`btn-primary flex-1 flex items-center justify-center space-x-1 ${classes.button}`}
                            >
                                <FaCheck size={classes.icon - 2} />
                                {size !== 'compact' && <span>Confirmar</span>}
                            </button>
                            <button
                                onClick={() => onRechazar(cita.idCita)}
                                disabled={loading}
                                className={`btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex-1 flex items-center justify-center space-x-1 ${classes.button}`}
                            >
                                <FaBan size={classes.icon - 2} />
                                {size !== 'compact' && <span>Rechazar</span>}
                            </button>
                        </>
                    )}
                    {cita.estado === 'confirmada' && (
                        <button
                            onClick={() => onCompletar(cita.idCita)}
                            disabled={loading}
                            className={`btn-gold w-full flex items-center justify-center space-x-1 ${classes.button}`}
                        >
                            <FaCheckCircle size={classes.icon} />
                            <span>Completar</span>
                        </button>
                    )}
                    {cita.estado === 'completada' && (
                        <div className={`bg-green-100 text-green-800 w-full ${classes.button} rounded-lg font-semibold text-center`}>
                            <FaCheckCircle className="inline mr-1" size={classes.icon} />
                            Finalizada
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

