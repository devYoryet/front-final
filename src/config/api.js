// src/config/api.js - VERSIÓN FINAL SIMPLIFICADA
import axios from 'axios';

// 🚀 DETECTAR ENTORNO
const isDevelopment = window.location.hostname === 'localhost';

// 🔗 CONFIGURAR URL SEGÚN ENTORNO
const API_BASE_URL = isDevelopment 
    ? 'http://localhost:5000'           // Desarrollo local
    : 'https://34.203.37.29';           // Producción con HTTPS

console.log('🌐 Entorno:', isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION');
console.log('🔗 API_BASE_URL:', API_BASE_URL);

// 🚀 CREAR INSTANCIA DE AXIOS
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 🔧 INTERCEPTOR PARA REQUESTS
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 🔧 INTERCEPTOR PARA RESPONSES
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      code: error.code
    });
    
    if (error.response?.status === 401) {
      console.warn('🔐 Token expirado o inválido');
    }
    
    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default api;