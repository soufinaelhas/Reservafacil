import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">ReservaFácil</h1>
        </div>
        
        <nav className="px-4 space-y-1">
          <a href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            Dashboard
          </a>
          <a href="/calendar" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            Calendario
          </a>
          <a href="/services" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            Servicios
          </a>
          <a href="/customers" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            Clientes
          </a>
          <a href="/analytics" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            Análisis
          </a>
          <a href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            Configuración
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
