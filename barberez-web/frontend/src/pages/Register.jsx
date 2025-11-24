import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        contrasena: '',
        confirmarContrasena: '',
        cedula: '',
        rol: 'cliente'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (formData.contrasena !== formData.confirmarContrasena) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.contrasena.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const userData = {
                nombre: formData.nombre,
                correo: formData.correo,
                telefono: formData.telefono,
                contrasena: formData.contrasena,
                cedula: formData.cedula,
                rol: formData.rol,
                comision: 0
            };

            const response = await authAPI.register(userData);

            if (response.data.success) {
                alert('¡Registro exitoso! Ahora puedes iniciar sesión');
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                {/* Logo y Título */}
                <div className="text-center mb-8">
                    <div className="mb-4">
                        <img
                            src="/images/logo.png"
                            alt="BarberEz Logo"
                            className="w-20 h-20 mx-auto rounded-full shadow-2xl border-4 border-white object-cover"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Crear Cuenta</h1>
                    <p className="text-gray-600 mt-2">Únete a BarberEz</p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Juan Pérez"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cédula
                        </label>
                        <input
                            type="text"
                            name="cedula"
                            value={formData.cedula}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="1234567890"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="3001234567"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="contrasena"
                                value={formData.contrasena}
                                onChange={handleChange}
                                className="input-field pr-10"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                data-lpignore="true"
                                data-form-type="other"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                                tabIndex="-1"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar Contraseña
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmarContrasena"
                            value={formData.confirmarContrasena}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            data-lpignore="true"
                            data-form-type="other"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registrando...' : 'Crear Cuenta'}
                    </button>
                </form>

                {/* Login */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

