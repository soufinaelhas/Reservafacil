import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to load user:', error);
          // Token is invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const register = async (data) => {
    try {
      const response = await axios.post('/api/auth/register', data);
      const { user, token: newToken } = response.data;
      
      setUser(user);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      
      toast.success('¡Registro exitoso! Verifica tu email.');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.error || 'Error en el registro';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await axios.post('/api/auth/login', { 
        email, 
        password, 
        rememberMe 
      });
      const { user, token: newToken } = response.data;
      
      setUser(user);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      
      toast.success('¡Bienvenido de nuevo!');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.error || 'Error en el inicio de sesión';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Sesión cerrada correctamente');
  };

  const verifyEmail = async (verificationToken) => {
    try {
      await axios.post('/api/auth/verify-email', { token: verificationToken });
      toast.success('¡Email verificado correctamente!');
      
      // Reload user data
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Error al verificar email';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await axios.post('/api/auth/forgot-password', { email });
      toast.success('Si existe una cuenta con este email, recibirás un enlace de recuperación');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Error al solicitar recuperación';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const resetPassword = async (resetToken, newPassword) => {
    try {
      await axios.post('/api/auth/reset-password', { 
        token: resetToken, 
        newPassword 
      });
      toast.success('¡Contraseña actualizada correctamente!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Error al restablecer contraseña';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
