import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loading de páginas para mejorar el rendimiento inicial
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ClienteDashboard = lazy(() => import('./pages/ClienteDashboard'));
const BarberoDashboard = lazy(() => import('./pages/BarberoDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Loading fallback con diseño coherente
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4" role="status" aria-label="Cargando">
        <span className="sr-only">Cargando...</span>
      </div>
      <p className="text-white text-xl font-semibold">Cargando...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rutas protegidas - Cliente */}
              <Route
                path="/cliente"
                element={
                  <ProtectedRoute allowedRoles={['cliente']}>
                    <ClienteDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Rutas protegidas - Barbero */}
              <Route
                path="/barbero"
                element={
                  <ProtectedRoute allowedRoles={['barbero']}>
                    <BarberoDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Rutas protegidas - Admin */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Redireccionamiento */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

