import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Registro de usuario
  async register(userData) {
    try {
      const response = await api.post('/auth/register', {
        email: userData.email,
        username: userData.username,
        password: userData.password,
      });

      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Usuario registrado exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || {
          code: 'REGISTRATION_ERROR',
          message: 'Error al registrar usuario',
        },
      };
    }
  },

  // Login de usuario
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.data.success && response.data.data?.session?.access_token) {
        const { access_token, user } = response.data.data.session;

        // Guardar token y datos del usuario
        localStorage.setItem('authToken', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        return {
          success: true,
          data: {
            token: access_token,
            user: user,
          },
          message: response.data.message || 'Login exitoso',
        };
      } else {
        return {
          success: false,
          error: {
            code: 'INVALID_RESPONSE',
            message: 'Respuesta inválida del servidor',
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || {
          code: 'LOGIN_ERROR',
          message: 'Error al iniciar sesión',
        },
      };
    }
  },

  // Obtener perfil del usuario
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || {
          code: 'PROFILE_ERROR',
          message: 'Error al obtener perfil',
        },
      };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return { success: true };
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  // Obtener token actual
  getToken() {
    return localStorage.getItem('authToken');
  },

  // Obtener datos del usuario
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;