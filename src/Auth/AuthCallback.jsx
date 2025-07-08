// src/Auth/AuthCallback.jsx - Versión simplificada que funciona
import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { setCognitoUser } from '../Redux/Auth/action';
import { createSalonOnly } from '../Redux/Salon/action';

const AuthCallback = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

 useEffect(() => {
  const handleCallback = async () => {
    if (auth.isAuthenticated && auth.user) {
      console.log('=== AUTH CALLBACK ===');
      console.log('Usuario autenticado:', auth.user);
      console.log('Access token disponible:', auth.user.access_token ? 'SÍ' : 'NO');
      
      // ⭐ CRÍTICO: Guardar JWT inmediatamente
      if (auth.user.access_token) {
        localStorage.setItem("jwt", auth.user.access_token);
        console.log('JWT guardado en localStorage');
      }
      
      try {
        const email = auth.user.profile.email;
        const fullName = auth.user.profile.name || auth.user.profile.email;
        const userSub = auth.user.profile.sub;
        
        // Extraer rol
        let userRole = auth.user.profile['custom:customrole'] || 'CUSTOMER';
        console.log('User role from Cognito:', userRole);
        
        // Verificar datos de salón pendientes
        const pendingSalonData = localStorage.getItem('pendingSalonData');
        
        if (pendingSalonData) {
          console.log('Hay datos de salón pendientes');
          userRole = 'SALON_OWNER';
          
          const salonData = JSON.parse(pendingSalonData);
          localStorage.removeItem('pendingSalonData');
          
          // ⭐ Establecer usuario en Redux ANTES de crear salón
          const userData = {
            id: userSub,
            email: email,
            fullName: fullName,
            role: userRole,
          };
          
          dispatch(setCognitoUser(userData, auth.user.access_token));
          
          const salonDetails = {
            name: salonData.salonDetails.name,
            address: salonData.salonAddress.address,
            city: salonData.salonAddress.city,
            phone: salonData.salonAddress.phoneNumber,
            email: salonData.salonAddress.email,
            openTime: getLocalTime(salonData.salonDetails.openTime),
            closeTime: getLocalTime(salonData.salonDetails.closeTime),
            images: salonData.salonDetails.images.length > 0 ? salonData.salonDetails.images : [
              "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=600"
            ],
          };
          
          console.log('Creando salón con datos:', salonDetails);
          
          // ⭐ Pasar JWT directamente
          dispatch(createSalonOnly({ 
            salonDetails, 
            navigate,
            jwt: auth.user.access_token
          }));
          return;
        }
        
        // Flujo normal
        const userData = {
          id: userSub,
          email: email,
          fullName: fullName,
          role: userRole,
        };

        dispatch(setCognitoUser(userData, auth.user.access_token));
        
        // Redirigir según rol
        if (userRole === 'SALON_OWNER') {
          navigate('/salon-dashboard');
        } else if (userRole === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        
      } catch (error) {
        console.error('Error en AuthCallback:', error);
        navigate('/login?error=callback_failed');
      }
    }
  };

  const timer = setTimeout(handleCallback, 1000);
  return () => clearTimeout(timer);
}, [auth.isAuthenticated, auth.error, auth.user, navigate, dispatch]);

  // Función auxiliar para formatear tiempo
  const getLocalTime = (time) => {
    if (!time) return "09:00:00";
    if (typeof time === 'string') return time.includes(':') ? time + ":00" : time;
    
    let hour = time.$H || 9;
    let minute = time.$m || 0;
    let second = time.$s || 0;

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
  };

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