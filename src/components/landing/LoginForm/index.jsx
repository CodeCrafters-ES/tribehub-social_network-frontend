import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoginMode, setIsLoginMode] = useState(true);

    const { login, register, isLoading, error, clearError } = useAuth();
    const navigate = useNavigate();

    // Validación de email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validación de contraseña
    const validatePassword = (password) => {
        return password.length >= 6;
    };

    // Validación del formulario
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'El email es requerido';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Ingresa un email válido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Limpiar errores cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }

        // Limpiar error del contexto
        if (error) {
            clearError();
        }
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            let result;

            if (isLoginMode) {
                result = await login(formData);
            } else {
                // Para registro, necesitamos el username también
                const registerData = {
                    ...formData,
                    username: formData.email.split('@')[0], // Usar parte del email como username por defecto
                };
                result = await register(registerData);
            }

            if (result.success) {
                if (isLoginMode) {
                    navigate('/dashboard');
                } else {
                    // Mostrar mensaje de éxito para registro
                    alert('¡Registro exitoso! Por favor, confirma tu email antes de iniciar sesión.');
                    setIsLoginMode(true);
                    setFormData({ email: '', password: '' });
                }
            }
        } catch (error) {
            console.error('Error en autenticación:', error);
        }
    };

    // Cambiar entre modo login y registro
    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setFormData({ email: '', password: '' });
        setErrors({});
        clearError();
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    className={`input-text ${errors.email ? 'error' : ''}`}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
                <input
                    className={`input-text ${errors.password ? 'error' : ''}`}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {error && (
                <div className="error-message global-error">
                    {error.message}
                </div>
            )}

            <button
                className="btn-form-base btn-form-login"
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? 'Cargando...' : (isLoginMode ? 'Iniciar sesión' : 'Registrarse')}
            </button>

            <a href="#" className="text-primary hover:underline" onClick={(e) => {
                e.preventDefault();
                alert('Función de recuperación de contraseña próximamente');
            }}>
                ¿Has olvidado la contraseña?
            </a>

            <hr className="w-full border-t-2 border-gray-25 rounded-full" />

            <button
                className="btn-form-base btn-form-signup"
                type="button"
                onClick={toggleMode}
                disabled={isLoading}
            >
                {isLoginMode ? 'Crear cuenta' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
        </form>
    );
};

export default LoginForm;