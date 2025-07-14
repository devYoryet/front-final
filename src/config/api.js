// src/config/api.js - SOLUCIÓN MIXED CONTENT
import axios from 'axios';

// 🚨 PROBLEMA: Vercel (HTTPS) no puede conectar a EC2 (HTTP)
// 🔧 SOLUCIÓN TEMPORAL: Usar un proxy HTTPS o configurar HTTPS en EC2

// 🌐 DETECTAR ENTORNO
const isDevelopment = window.location.hostname === 'localhost';
const isHTTPS = window.location.protocol === 'https:';

console.log('🌐 Environment detected:');
console.log('  - Hostname:', window.location.hostname);
console.log('  - Protocol:', window.location.protocol);
console.log('  - isDevelopment:', isDevelopment);
console.log('  - isHTTPS:', isHTTPS);

// 🚀 CONFIGURACIÓN DE API SEGÚN ENTORNO
let API_BASE_URL;

if (isDevelopment) {
  // Desarrollo local - usar HTTP
  API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
} else if (isHTTPS) {
  // PRODUCCIÓN VERCEL - NECESITA HTTPS
  // 🔧 OPCIONES PARA SOLUCIONAR MIXED CONTENT:
  
  // OPCIÓN 1: Usar proxy HTTPS (RECOMENDADO)
  // API_BASE_URL = 'https://tu-proxy-https.com'; // Proxy que redirija a tu EC2
  
  // OPCIÓN 2: Usar CORS proxy temporal (SOLO PARA TESTING)
  API_BASE_URL = `https://cors-anywhere.herokuapp.com/http://34.203.37.29:5000`;
  
  // OPCIÓN 3: Configurar HTTPS en tu EC2 (MEJOR SOLUCIÓN)
  // API_BASE_URL = 'https://34.203.37.29:5000'; // Cuando configures HTTPS
  
  console.log('🚨 MIXED CONTENT WORKAROUND ACTIVATED');
  console.log('🔧 Using CORS proxy for HTTPS compatibility');
} else {
  // Fallback
  API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
}

console.log('🔗 Final API_BASE_URL:', API_BASE_URL);

// 🚀 CREAR INSTANCIA DE AXIOS
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // Más tiempo para el proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔧 INTERCEPTOR PARA REQUESTS
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    
    // Agregar token si existe
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Headers adicionales para CORS proxy
    if (API_BASE_URL.includes('cors-anywhere')) {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    
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
    console.log('📥 API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      code: error.code
    });
    
    // Detectar errores específicos
    if (error.code === 'ERR_NETWORK' && isHTTPS) {
      console.error('🚨 MIXED CONTENT ERROR DETECTED!');
      console.error('💡 SOLUTION: Configure HTTPS on your backend or use a proxy');
    }
    
    if (error.response?.status === 401) {
      console.warn('🔐 Token expirado o inválido');
    }
    
    return Promise.reject(error);
  }
);

// 🚀 EXPORTAR
export { API_BASE_URL };
export default api;

// 🔍 WARNING PARA DESARROLLADORES
if (isHTTPS && API_BASE_URL.includes('cors-anywhere')) {
  console.warn('⚠️  USANDO CORS PROXY TEMPORAL');
  console.warn('📋 PARA PRODUCCIÓN, CONFIGURA:');
  console.warn('   1. HTTPS en tu servidor EC2, O');
  console.warn('   2. Un proxy HTTPS dedicado, O');
  console.warn('   3. API Gateway de AWS con HTTPS');
}