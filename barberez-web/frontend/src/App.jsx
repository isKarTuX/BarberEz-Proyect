import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import ClienteDashboard from './pages/ClienteDashboard';
import BarberoDashboard from './pages/BarberoDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
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
      </Router>
    </AuthProvider>
  );
}

export default App;

