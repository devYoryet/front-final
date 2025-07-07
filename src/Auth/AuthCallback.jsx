// src/Auth/AuthCallback.jsx - Corregido
import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate, useLocation } from 'react-router-dom'; // ⭐ Agregar useLocation
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { setCognitoUser } from '../Redux/Auth/action';
import { createSalonOnly } from '../Redux/Salon/action'; // ⭐ Agregar import

const AuthCallback = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ⭐ Hook correcto de React Router
  const dispatch = useDispatch();
  const pendingSalonData = localStorage.getItem('pendingSalonData');
  useEffect(() => {
    const handleCallback = async () => {
      if (auth.isAuthenticated && auth.user) {
        console.log('Usuario autenticado:', auth.user);
        console.log('Access token:', auth.user.access_token);
        
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
          return; // No redirigir aún, esperar a que se cree el salón
        }
        
        // Redirigir según el rol
        if (userRole === 'SALON_OWNER' || userRole === 'ROLE_SALON_OWNER') {
          // Si es salon owner pero no hay datos pendientes, ir a dashboard
          navigate('/salon-dashboard');
        } else if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        // También verificar si tiene rol personalizado en Cognito
        const cognitoRole = auth.user.profile['custom:role'];
        if (cognitoRole) {
          userRole = cognitoRole;
        }

        // Convertir usuario de Cognito a formato de tu app
        const userData = {
          id: auth.user.profile.sub,
          email: auth.user.profile.email || 'sin-email@example.com',
          fullName: auth.user.profile.name || auth.user.profile.email || 'Usuario',
          role: userRole,
        };

        console.log('userData convertido:', userData);
        console.log('Guardando JWT en localStorage:', auth.user.access_token);

        // ⭐ IMPORTANTE: Guardar el JWT de Cognito
        localStorage.setItem("jwt", auth.user.access_token);

        // Guardar en Redux
        dispatch(setCognitoUser(userData, auth.user.access_token));
        
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

    // Dar tiempo para que se complete la autenticación
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