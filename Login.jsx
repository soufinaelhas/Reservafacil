import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);

    const result = await login(
      formData.email, 
      formData.password, 
      formData.rememberMe
    );

    if (result.success) {
      navigate('/dashboard');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-gray-600">
          Accede a tu cuenta de ReservaFácil
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="tu@email.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-error">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input ${errors.password ? 'input-error' : ''}`}
              placeholder="••••••••"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-error">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label 
                htmlFor="rememberMe" 
                className="ml-2 block text-sm text-gray-700"
              >
                Recuérdame
              </label>
            </div>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="spinner w-5 h-5 mr-2"></div>
                Iniciando sesión...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
