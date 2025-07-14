// src/Auth/AuthCallback.jsx - VERSIÓN FINAL SIMPLIFICADA
import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { setCognitoUser } from '../Redux/Auth/action';
import { createSalonOnly } from '../Redux/Salon/action';

const AuthCallback = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      if (auth.isAuthenticated && auth.user) {
        console.log('🔍 Usuario autenticado:', auth.user);
        
        try {
          // 1. Obtener información básica del token ID
          const idTokenPayload = JSON.parse(atob(auth.user.id_token.split('.')[1]));
          const email = idTokenPayload.email || auth.user.profile?.email;
          const name = idTokenPayload.name || auth.user.profile?.name || email;
          const cognitoSub = idTokenPayload.sub;
          
          console.log('📋 Información del token:');
          console.log('   Email:', email);
          console.log('   Name:', name);
          console.log('   Sub:', cognitoSub);
          
          // 2. Guardar ID token en localStorage
          localStorage.setItem("jwt", auth.user.id_token);
          
          // 3. Verificar si hay datos de salón pendientes
          const pendingSalonData = localStorage.getItem('pendingSalonData');
          if (pendingSalonData) {
            console.log('🏢 Datos de salón pendientes encontrados');
            const salonData = JSON.parse(pendingSalonData);
            localStorage.removeItem('pendingSalonData');
            
            const salonDetails = {
              ...salonData.salonDetails,
              ...salonData.salonAddress,
              images: salonData.salonDetails.images?.length > 0 
                ? salonData.salonDetails.images 
                : [
                    "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=600",
                    "https://images.pexels.com/photos/3331488/pexels-photo-3331488.jpeg?auto=compress&cs=tinysrgb&w=600",
                    "https://images.pexels.com/photos/5069455/pexels-photo-5069455.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  ]
            };
            
            console.log('🚀 Creando salón con datos guardados:', salonDetails);
            dispatch(createSalonOnly({ salonDetails, navigate }));
            return;
          }
          
          // 4. 🚀 LLAMAR AL BACKEND usando endpoint específico para Cognito
          console.log('🔄 Consultando backend para obtener/crear usuario desde Cognito...');
          
          // Detectar entorno y usar URL correcta
          const isDevelopment = window.location.hostname === 'localhost';
          const API_BASE_URL = isDevelopment 
            ? 'http://localhost:5000' 
            : 'https://34.203.37.29.sslip.io';
            
          console.log('🔗 Usando API_BASE_URL:', API_BASE_URL);
          
          // 🚀 USAR ENDPOINT CORRECTO BASADO EN EL CÓDIGO REAL
          console.log('🔄 Intentando crear usuario si no existe...');
          
          // Primero crear el usuario en BD usando el endpoint correcto
          const createResponse = await fetch(`${API_BASE_URL}/api/users/create-from-cognito`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${auth.user.id_token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              cognitoUserId: cognitoSub,
              email: email,
              fullName: name,
              role: 'CUSTOMER'
            })
          });
          
          let response;
          if (createResponse.ok) {
            console.log('✅ Usuario creado exitosamente');
            response = createResponse;
          } else {
            console.log('🔄 Usuario ya existe, obteniendo datos...');
            // Si ya existe, obtener por Cognito ID
            response = await fetch(`${API_BASE_URL}/api/users/by-cognito-id/${cognitoSub}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${auth.user.id_token}`,
                'Content-Type': 'application/json'
              }
            });
          }
          
          console.log('📡 Response status:', response.status);
          
          if (response.ok) {
            // 5. Usuario existe o fue creado, obtener rol de la BD
            const userData = await response.json();
            console.log('✅ Usuario obtenido/creado:', userData);
            
            const userForRedux = {
              id: userData.id,
              email: userData.email,
              fullName: userData.fullName,
              role: userData.role, // ⭐ ROL VIENE DE LA BD
            };
            
            // 6. Guardar en Redux
            dispatch(setCognitoUser(userForRedux, auth.user.id_token));
            
            // 7. 🚀 REDIRIGIR SEGÚN EL ROL DE LA BD
            console.log('🔄 Redirigiendo según rol:', userData.role);
            
            if (userData.role === 'SALON_OWNER' || userData.role === 'ROLE_SALON_OWNER') {
              console.log('👨‍💼 Redirigiendo a salon-dashboard');
              navigate('/salon-dashboard');
            } else if (userData.role === 'ADMIN' || userData.role === 'ROLE_ADMIN') {
              console.log('🔧 Redirigiendo a admin');
              navigate('/admin');
            } else {
              console.log('🏠 Redirigiendo a home (customer)');
              navigate('/');
            }
            
          } else {
            // 8. Error obteniendo usuario
            console.error('❌ Error obteniendo usuario del backend:', response.status);
            
            const errorText = await response.text();
            console.error('❌ Contenido del error:', errorText.substring(0, 200));
            
            // Fallback: crear usuario temporal y redirigir a home
            const fallbackUser = {
              id: cognitoSub,
              email: email,
              fullName: name,
              role: 'CUSTOMER' // Rol por defecto
            };
            
            dispatch(setCognitoUser(fallbackUser, auth.user.id_token));
            navigate('/');
          }
          
        } catch (error) {
          console.error('❌ Error procesando callback:', error);
          
          // Fallback en caso de error
          const fallbackUser = {
            id: auth.user.profile.sub,
            email: auth.user.profile.email,
            fullName: auth.user.profile.name || auth.user.profile.email,
            role: 'CUSTOMER'
          };
          
          dispatch(setCognitoUser(fallbackUser, auth.user.id_token));
          navigate('/');
        }
        
      } else if (auth.error) {
        console.error('❌ Error de autenticación:', auth.error);
        navigate('/login?error=auth_failed');
      }
    };

    const timer = setTimeout(handleCallback, 1000);
    return () => clearTimeout(timer);
  }, [auth.isAuthenticated, auth.error, auth.user, navigate, dispatch, location]);

  if (auth.error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Error de Autenticación</h2>
          <p className="mt-2">Error: {auth.error.message}</p>
          <button 
            onClick={() => navigate('/login')} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <CircularProgress size={60} />
        <p className="mt-4 text-lg">Completando autenticación...</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Authenticated: {auth.isAuthenticated ? 'Sí' : 'No'}</p>
          <p>Environment: {window.location.hostname === 'localhost' ? 'Development' : 'Production'}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;