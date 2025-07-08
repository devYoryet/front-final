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
  const pendingSalonData = localStorage.getItem('pendingSalonData');

  useEffect(() => {
    const handleCallback = async () => {
      if (auth.isAuthenticated && auth.user) {
        console.log('Usuario autenticado:', auth.user);
        
        // 🚀 DEBUG: COMPARAR AMBOS TOKENS
        console.log('🔍 COMPARANDO TOKENS:');
        
        try {
          // Decodificar ACCESS TOKEN
          const accessPayload = JSON.parse(atob(auth.user.access_token.split('.')[1]));
          console.log('📱 ACCESS TOKEN:', accessPayload);
          console.log('   email en access:', accessPayload.email);
          
          // Decodificar ID TOKEN
          const idPayload = JSON.parse(atob(auth.user.id_token.split('.')[1]));
          console.log('🆔 ID TOKEN:', idPayload);
          console.log('   email en id:', idPayload.email);
          console.log('   name en id:', idPayload.name);
          console.log('   custom:role en id:', idPayload['custom:role']);
          
        } catch (e) {
          console.error('Error decodificando tokens:', e);
        }
        
        // Obtener el rol del state si viene del become-partner
        let userRole = 'CUSTOMER';
        try {
          const urlParams = new URLSearchParams(location.search);
          const state = urlParams.get('state');
          if (state) {
            const stateData = JSON.parse(decodeURIComponent(state));
            userRole = stateData.role || 'CUSTOMER';
          }
        } catch (e) {
          console.log('No state data found, using default role');
        }

        // 🚀 USAR ID TOKEN PARA OBTENER EMAIL
        const idTokenPayload = JSON.parse(atob(auth.user.id_token.split('.')[1]));
        const email = idTokenPayload.email || auth.user.profile?.email;
        const name = idTokenPayload.name || auth.user.profile?.name || email;

        if (pendingSalonData && userRole === 'SALON_OWNER') {
          // Hay datos del salón pendientes, crear el salón
          const salonData = JSON.parse(pendingSalonData);
          localStorage.removeItem('pendingSalonData');
          
          // Crear el salón con los datos guardados
          const salonDetails = {
            ...salonData.salonDetails,
            ...salonData.salonAddress,
            images: salonData.salonDetails.images.length > 0 ? salonData.salonDetails.images : [
              "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=600"
            ],
          };
          
          console.log('Creando salón con datos guardados:', salonDetails);
          dispatch(createSalonOnly({ salonDetails, navigate }));
          return;
        }
        
        // También verificar si tiene rol personalizado en Cognito
        const cognitoRole = idTokenPayload['custom:role'] || userRole;

        // 🚀 IMPORTANTE: GUARDAR ID TOKEN EN LUGAR DE ACCESS TOKEN
        console.log('🔑 Guardando ID TOKEN en localStorage');
        localStorage.setItem("jwt", auth.user.id_token);

        // Convertir usuario de Cognito a formato de tu app
        const userData = {
          id: auth.user.profile.sub,
          email: email,
          fullName: name || email,
          role: cognitoRole,
        };

        console.log('userData convertido:', userData);

        // Guardar en Redux
        dispatch(setCognitoUser(userData, auth.user.id_token));
        
        // Redirigir según el rol
        if (userRole === 'SALON_OWNER' || userRole === 'ROLE_SALON_OWNER') {
          console.log('Redirigiendo a complete-salon-profile');
          navigate('/complete-salon-profile');
        } else if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
          navigate('/admin');
        } else {
          console.log('Redirigiendo a home');
          navigate('/');
        }
      } else if (auth.error) {
        console.error('Authentication error:', auth.error);
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
          <p>Loading: {auth.isLoading ? 'Sí' : 'No'}</p>
          <p>Authenticated: {auth.isAuthenticated ? 'Sí' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;