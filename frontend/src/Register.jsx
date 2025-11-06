import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    businessCategory: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Peluquería y Barbería',
    'Belleza y Bienestar',
    'Talleres y Clases',
    'Reparaciones',
    'Entrenamiento Personal',
    'Tatuajes y Piercing',
    'Fotografía',
    'Otro'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.businessName || formData.businessName.length < 2) {
      newErrors.businessName = 'El nombre del negocio debe tener al menos 2 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos un número';
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos un carácter especial (!@#$%^&*)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);

    const result = await register(formData);

    if (result.success) {
      navigate('/dashboard');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Crear Cuenta
        </h1>
        <p className="text-gray-600">
          Empieza a gestionar tus citas en minutos
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div>
            <label 
              htmlFor="businessName" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Nombre del Negocio *
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className={`input ${errors.businessName ? 'input-error' : ''}`}
              placeholder="Ej: Salón Carmen"
              disabled={isSubmitting}
            />
            {errors.businessName && (
              <p className="mt-2 text-sm text-error">{errors.businessName}</p>
            )}
          </div>

          {/* Business Category */}
          <div>
            <label 
              htmlFor="businessCategory" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Categoría del Negocio
            </label>
            <select
              id="businessCategory"
              name="businessCategory"
              value={formData.businessCategory}
              onChange={handleChange}
              className="input"
              disabled={isSubmitting}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email *
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

          {/* Password */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Contraseña *
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
            <p className="mt-2 text-xs text-gray-500">
              Mínimo 8 caracteres, con al menos un número y un carácter especial
            </p>
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
                Creando cuenta...
              </span>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
