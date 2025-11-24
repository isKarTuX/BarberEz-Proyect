import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Scissors, Eye, EyeOff, User } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({
        correo: '',
        contrasena: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

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
        setLoading(true);

        try {
            const response = await authAPI.login(formData.correo, formData.contrasena);

            if (response.data.success) {
                login(response.data.data);

                // Redirigir según el rol
                const rol = response.data.data.rol;
                if (rol === 'admin') {
                    navigate('/admin');
                } else if (rol === 'barbero') {
                    navigate('/barbero');
                } else {
                    navigate('/cliente');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary-dark flex items-center justify-center p-4 bg-barber-pattern">
            {/* Decoración de fondo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Card principal */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-primary/20">
                    {/* Logo y Título */}
                    <div className="text-center mb-8">
                        <div className="mx-auto mb-4 animate-fadeIn">
                            <img
                                src="/images/logo.png"
                                alt="BarberEz Logo"
                                className="w-24 h-24 mx-auto rounded-full shadow-2xl border-4 border-white object-cover"
                            />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                            BarberEz
                        </h1>
                        <p className="text-gray-600 font-medium">Sistema de Gestión Profesional</p>
                        <div className="flex items-center justify-center mt-3 space-x-2">
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-primary"></div>
                            <Scissors className="w-4 h-4 text-primary" />
                            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-primary"></div>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg animate-fadeIn">
                                <p className="font-medium">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="correo@ejemplo.com"
                                    required
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
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
                                    autoComplete="current-password"
                                    data-lpignore="true"
                                    data-form-type="other"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors z-10"
                                    tabIndex="-1"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Iniciando sesión...</span>
                                </div>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    {/* Registro */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" className="text-primary font-bold hover:text-secondary transition-colors">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>

                    {/* Usuarios de prueba */}
                    <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                        <p className="text-xs font-bold text-gray-700 mb-2 text-center">👤 Usuarios de prueba:</p>
                        <div className="space-y-1 text-xs text-gray-600">
                            <p><span className="font-semibold">Admin:</span> admin@barberez.com / admin123</p>
                            <p><span className="font-semibold">Cliente:</span> juan@email.com / cliente123</p>
                            <p><span className="font-semibold">Barbero:</span> carlos@barberez.com / barbero123</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center mt-6 text-white/80 text-sm">
                    © 2025 BarberEz - Sistema Profesional de Gestión
                </p>
            </div>
        </div>
    );
}

