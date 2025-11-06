import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Services from './pages/services/Services';
import Calendar from './pages/calendar/Calendar';
import Customers from './pages/customers/Customers';
import Analytics from './pages/analytics/Analytics';
import Settings from './pages/settings/Settings';
import PublicBookingPage from './pages/public/PublicBookingPage';

// Layouts
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
              <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
              <Route path="/verify-email" element={<AuthLayout><VerifyEmail /></AuthLayout>} />
              <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
              <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />
              
              {/* Public Booking Page */}
              <Route path="/:businessSlug" element={<PublicBookingPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
              <Route path="/services" element={<DashboardLayout><Services /></DashboardLayout>} />
              <Route path="/calendar" element={<DashboardLayout><Calendar /></DashboardLayout>} />
              <Route path="/customers" element={<DashboardLayout><Customers /></DashboardLayout>} />
              <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
              <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
              
              {/* Redirect root to login or dashboard */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* 404 Route */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
                    <a href="/dashboard" className="btn btn-primary">
                      Volver al Dashboard
                    </a>
                  </div>
                </div>
              } />
            </Routes>
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#374151',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
