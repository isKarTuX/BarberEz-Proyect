import React from 'react';

/**
 * Error Boundary Component
 * 
 * Captura errores de React en componentes hijos y muestra una UI de fallback.
 * Previene que toda la aplicación crashee por un error en un componente específico.
 * 
 * Uso:
 * <ErrorBoundary>
 *   <ComponenteQuePuedeFallar />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Actualiza el estado para que el siguiente render muestre la UI de fallback
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Registra el error en un servicio de logging (ej: Sentry, LogRocket)
        console.error('Error capturado por ErrorBoundary:', error, errorInfo);
        
        this.setState({
            error,
            errorInfo
        });

        // TODO: Enviar a servicio de logging en producción
        // if (process.env.NODE_ENV === 'production') {
        //     Sentry.captureException(error, { extra: errorInfo });
        // }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8">
                        {/* Icono de error */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-red-100 rounded-full p-4">
                                <svg
                                    className="w-16 h-16 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Título y descripción */}
                        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
                            ¡Algo salió mal!
                        </h1>
                        <p className="text-gray-600 text-center mb-6">
                            Lo sentimos, ha ocurrido un error inesperado. 
                            Nuestro equipo ha sido notificado y está trabajando en una solución.
                        </p>

                        {/* Detalles del error (solo en desarrollo) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                                    Detalles técnicos del error
                                </summary>
                                <div className="mt-2 space-y-2">
                                    <div className="text-xs font-mono text-red-600 bg-red-50 p-2 rounded">
                                        {this.state.error.toString()}
                                    </div>
                                    {this.state.errorInfo && (
                                        <div className="text-xs font-mono text-gray-700 bg-white p-2 rounded border max-h-48 overflow-auto">
                                            {this.state.errorInfo.componentStack}
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => {
                                    this.handleReset();
                                    window.location.reload();
                                }}
                                className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                <span>Recargar página</span>
                            </button>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                <span>Ir al inicio</span>
                            </button>
                        </div>

                        {/* Información de contacto */}
                        <p className="text-center text-sm text-gray-500 mt-6">
                            Si el problema persiste, contáctanos en{' '}
                            <a
                                href="mailto:soporte@barberez.com"
                                className="text-primary hover:underline font-semibold"
                            >
                                soporte@barberez.com
                            </a>
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
