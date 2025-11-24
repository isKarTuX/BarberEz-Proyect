import React, { useState } from 'react';
import { DollarSign, CreditCard, Smartphone, Building2, X, CheckCircle } from 'lucide-react';

export default function ModalRegistrarPago({ cita, onClose, onPagoRegistrado }) {
    const [formPago, setFormPago] = useState({
        metodoPago: '',
        referenciaTransferencia: '',
        bancoOrigen: '',
        ultimos4Digitos: '',
        tipoTarjeta: '',
        notas: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const metodosPago = [
        { value: 'efectivo', label: 'Efectivo', icon: DollarSign, color: 'green' },
        { value: 'tarjeta', label: 'Tarjeta', icon: CreditCard, color: 'blue' },
        { value: 'transferencia', label: 'Transferencia', icon: Building2, color: 'purple' }
    ];

    const bancos = [
        'Bancolombia',
        'Banco de Bogotá',
        'Davivienda',
        'BBVA',
        'Banco Av Villas',
        'Banco Popular',
        'Scotiabank Colpatria',
        'Banco Caja Social',
        'Nequi',
        'Daviplata',
        'Otro'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormPago(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleMetodoPagoChange = (metodo) => {
        setFormPago({
            metodoPago: metodo,
            referenciaTransferencia: '',
            bancoOrigen: '',
            ultimos4Digitos: '',
            tipoTarjeta: '',
            notas: ''
        });
        setError('');
    };

    const validarFormulario = () => {
        if (!formPago.metodoPago) {
            setError('Debe seleccionar un método de pago');
            return false;
        }

        if (formPago.metodoPago === 'transferencia') {
            if (!formPago.referenciaTransferencia.trim()) {
                setError('La referencia de transferencia es obligatoria');
                return false;
            }
            if (!formPago.bancoOrigen) {
                setError('Debe seleccionar el banco de origen');
                return false;
            }
        }

        if (formPago.metodoPago === 'tarjeta') {
            if (!formPago.ultimos4Digitos || formPago.ultimos4Digitos.length !== 4) {
                setError('Debe ingresar los últimos 4 dígitos de la tarjeta');
                return false;
            }
            if (!/^\d{4}$/.test(formPago.ultimos4Digitos)) {
                setError('Los últimos 4 dígitos deben ser numéricos');
                return false;
            }
            if (!formPago.tipoTarjeta) {
                setError('Debe seleccionar el tipo de tarjeta');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/pagos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    citaId: cita.id || cita.idCita,
                    ...formPago
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar el pago');
            }

            if (onPagoRegistrado) {
                onPagoRegistrado(data.data);
            }

            alert('✅ Pago registrado exitosamente');
            onClose();
        } catch (err) {
            setError(err.message || 'Error al registrar el pago');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-3">
                            <DollarSign className="w-8 h-8" />
                            <div>
                                <h2 className="text-2xl font-bold">Registrar Pago</h2>
                                <p className="text-sm text-white/80">
                                    Cita #{cita.id || cita.idCita} - Total: ${cita.total?.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {/* Información de la Cita */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <h3 className="font-bold text-gray-800">Detalles de la Cita</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-600">Cliente:</p>
                            <p className="font-semibold">{cita.nombreCliente}</p>
                            <p className="text-gray-600">Barbero:</p>
                            <p className="font-semibold">{cita.nombreBarbero}</p>
                            <p className="text-gray-600">Fecha:</p>
                            <p className="font-semibold">
                                {new Date(cita.fecha).toLocaleDateString('es-CO')}
                            </p>
                            <p className="text-gray-600">Servicios:</p>
                            <p className="font-semibold">{cita.servicios}</p>
                        </div>
                    </div>

                    {/* Selección de Método de Pago */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            Método de Pago *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {metodosPago.map((metodo) => {
                                const Icon = metodo.icon;
                                return (
                                    <button
                                        key={metodo.value}
                                        type="button"
                                        onClick={() => handleMetodoPagoChange(metodo.value)}
                                        className={`relative p-4 rounded-xl border-2 transition-all ${
                                            formPago.metodoPago === metodo.value
                                                ? `border-${metodo.color}-500 bg-${metodo.color}-50`
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon
                                            className={`w-8 h-8 mx-auto mb-2 ${
                                                formPago.metodoPago === metodo.value
                                                    ? `text-${metodo.color}-600`
                                                    : 'text-gray-400'
                                            }`}
                                        />
                                        <p className="text-sm font-semibold text-center">
                                            {metodo.label}
                                        </p>
                                        {formPago.metodoPago === metodo.value && (
                                            <div className="absolute top-2 right-2">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Campos específicos por método de pago */}
                    {formPago.metodoPago === 'transferencia' && (
                        <div className="space-y-4 bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                            <h4 className="font-bold text-purple-800 flex items-center space-x-2">
                                <Building2 className="w-5 h-5" />
                                <span>Información de la Transferencia</span>
                            </h4>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Referencia de Transferencia *
                                </label>
                                <input
                                    type="text"
                                    name="referenciaTransferencia"
                                    value={formPago.referenciaTransferencia}
                                    onChange={handleChange}
                                    placeholder="Ej: 123456789"
                                    className="input-field"
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Banco de Origen *
                                </label>
                                <select
                                    name="bancoOrigen"
                                    value={formPago.bancoOrigen}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="">Seleccione un banco</option>
                                    {bancos.map(banco => (
                                        <option key={banco} value={banco}>{banco}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {formPago.metodoPago === 'tarjeta' && (
                        <div className="space-y-4 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                            <h4 className="font-bold text-blue-800 flex items-center space-x-2">
                                <CreditCard className="w-5 h-5" />
                                <span>Información de la Tarjeta</span>
                            </h4>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Últimos 4 Dígitos *
                                </label>
                                <input
                                    type="text"
                                    name="ultimos4Digitos"
                                    value={formPago.ultimos4Digitos}
                                    onChange={handleChange}
                                    placeholder="1234"
                                    className="input-field"
                                    maxLength={4}
                                    pattern="\d{4}"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tipo de Tarjeta *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormPago({...formPago, tipoTarjeta: 'debito'})}
                                        className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                                            formPago.tipoTarjeta === 'debito'
                                                ? 'border-blue-500 bg-blue-100 text-blue-700'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        Débito
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormPago({...formPago, tipoTarjeta: 'credito'})}
                                        className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                                            formPago.tipoTarjeta === 'credito'
                                                ? 'border-blue-500 bg-blue-100 text-blue-700'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        Crédito
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {formPago.metodoPago === 'efectivo' && (
                        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                            <div className="flex items-center space-x-3">
                                <DollarSign className="w-6 h-6 text-green-600" />
                                <div>
                                    <h4 className="font-bold text-green-800">Pago en Efectivo</h4>
                                    <p className="text-sm text-green-700">
                                        El pago se registrará como efectivo recibido
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notas */}
                    {formPago.metodoPago && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Notas (Opcional)
                            </label>
                            <textarea
                                name="notas"
                                value={formPago.notas}
                                onChange={handleChange}
                                placeholder="Agregar notas adicionales sobre el pago..."
                                rows={3}
                                className="input-field resize-none"
                            />
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex items-center space-x-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formPago.metodoPago}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Procesando...</span>
                                </div>
                            ) : (
                                `Registrar Pago - $${cita.total?.toLocaleString()}`
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

