// src/config/api.js - VERSIÓN FINAL SIMPLE
import axios from 'axios';

// 🚀 USAR VARIABLE DE ENTORNO con fallback a localhost
const LOCALHOST = process.env.REACT_APP_API_URL || 'http://localhost:5000';

console.log("🔗 REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
console.log("🔗 API_BASE_URL final:", LOCALHOST);

export const API_BASE_URL = LOCALHOST;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos timeout
});

console.log("📦 API instance created with baseURL:", API_BASE_URL);

// Headers por defecto
api.defaults.headers.post['Content-Type'] = 'application/json';

// 🔧 INTERCEPTOR para agregar token automáticamente
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

// 🔧 INTERCEPTOR para debug de respuestas
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;