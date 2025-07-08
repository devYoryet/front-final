// src/salon/pages/Become Partner/SalonForm.jsx - Versión corregida
import {
  Button,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import BecomePartnerFormStep1 from "./BecomePartnerFormStep1";
import BecomePartnerFormStep2 from "./BecomePartnerFormStep2";
import BecomePartnerFormStep3 from "./BecomePartnerFormStep3";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { createSalonOnly } from "../../../Redux/Salon/action";
import { setCognitoUser } from "../../../Redux/Auth/action"; // ⭐ IMPORT AGREGADO

const steps = ["Owner Details", "Salon Details", "Salon Address"];

const SalonForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [userScenario, setUserScenario] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cognitoAuth = useAuth();
  const { auth } = useSelector((store) => store);
  const category = useSelector((store) => store.category);
  const salon = useSelector((store) => store.salon);
  const service = useSelector((store) => store.service);
  // Determinar el escenario del usuario al cargar
  useEffect(() => {
    analyzeUserScenario();
  }, [cognitoAuth.isAuthenticated, auth.user]);

  const analyzeUserScenario = () => {
    if (cognitoAuth.isAuthenticated || auth.user) {
      const currentUser = cognitoAuth.user?.profile || auth.user;
      const userRole = currentUser?.['custom:role'] || currentUser?.role || 'CUSTOMER';
      
      if (userRole === 'SALON_OWNER' || userRole === 'ROLE_SALON_OWNER') {
        setUserScenario('EXISTING_SALON_OWNER');
        setShowDialog(true);
      } else {
        setUserScenario('EXISTING_CUSTOMER');
        setShowDialog(true);
      }
    } else {
      setUserScenario('NEW_USER');
    }
  };

  const handleStep = (value) => {
    setActiveStep(activeStep + value);
  };

  const formik = useFormik({
    initialValues: {
      email: cognitoAuth.user?.profile?.email || auth.user?.email || "",
      fullName: cognitoAuth.user?.profile?.name || auth.user?.fullName || "",
      password: "",
      
      salonAddress: {
        phoneNumber: "",
        pincode: "",
        address: "",
        city: "",
        state: "",
        email: cognitoAuth.user?.profile?.email || auth.user?.email || "",
      },
      salonDetails: {
        name: "",
        openTime: "",
        closeTime: "",
        images: []
      },
    },
    onSubmit: (values) => {
      handleFormSubmission(values);
    },
  });

  const handleFormSubmission = (values) => {
    switch (userScenario) {
      case 'NEW_USER':
        createUserAndSalon(values);
        break;
      case 'EXISTING_CUSTOMER':
        createSalonForExistingUser(values);
        break;
      case 'EXISTING_SALON_OWNER':
        createAdditionalSalon(values);
        break;
      default:
        console.error('Escenario no reconocido');
    }
  };

  const createUserAndSalon = (values) => {
    console.log("Crear usuario nuevo + salón");
    
    const salonData = {
      salonDetails: {
        ...values.salonDetails,
        openTime: getLocalTime(values.salonDetails.openTime),
        closeTime: getLocalTime(values.salonDetails.closeTime),
      },
      salonAddress: values.salonAddress
    };
    
    localStorage.setItem('pendingSalonData', JSON.stringify(salonData));
    redirectToCognito(values);
  };

 const createSalonForExistingUser = (values) => {
    console.log("=== CREAR SALÓN PARA USUARIO EXISTENTE ===");
    console.log("Values recibidos:", values);
    console.log("Usuario Cognito:", cognitoAuth.user?.profile);
    console.log("Usuario Redux:", auth.user);
    
    // 🚀 VALIDACIÓN TEMPRANA DE CAMPOS REQUERIDOS
    if (!values.salonDetails.name || !values.salonAddress.address || !values.salonAddress.city) {
        console.error("❌ Faltan campos requeridos");
        alert("Por favor completa todos los campos requeridos: Nombre del salón, Dirección y Ciudad");
        return;
    }
    
    // 🚀 DEBUG MEJORADO DEL JWT
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        try {
            const tokenParts = jwt.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('🔍 JWT EN LOCALSTORAGE (DEBERÍA SER ID TOKEN):', payload);
            console.log('   email en JWT:', payload.email);
            console.log('   name en JWT:', payload.name);
            console.log('   username en JWT:', payload.username);
            console.log('   custom:role en JWT:', payload['custom:role']);
            console.log('   token_use en JWT:', payload.token_use); // Debería ser "id"
        } catch (e) {
            console.error('Error decodificando JWT:', e);
        }
    }

    // 🚀 OBTENER EMAIL DE MÚLTIPLES FUENTES
    let userEmail = values.salonAddress.email;
    if (!userEmail || userEmail === '') {
        // Intentar obtener de Cognito profile
        userEmail = cognitoAuth.user?.profile?.email;
        if (!userEmail) {
            // Intentar obtener del JWT (ID token)
            try {
                const jwt = localStorage.getItem('jwt');
                const payload = JSON.parse(atob(jwt.split('.')[1]));
                userEmail = payload.email;
            } catch (e) {
                console.error('Error obteniendo email del JWT:', e);
            }
        }
        if (!userEmail) {
            // Usar email por defecto basado en usuario ID
            const userId = cognitoAuth.user?.profile?.sub || auth.user?.id;
            userEmail = `${userId.substring(0, 8)}@cognito.temp`;
            console.log('⚠️ Email no encontrado, usando temporal:', userEmail);
        }
    }

    console.log('📧 Email final a usar:', userEmail);

    // Verificar JWT
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) {
        console.error("❌ No hay JWT en localStorage");
        alert("Error de autenticación. Por favor inicia sesión nuevamente.");
        return;
    }

    // 🚀 ACTUALIZAR USUARIO EN REDUX CON EMAIL CORRECTO
    const currentUser = cognitoAuth.user?.profile || auth.user;
    if (currentUser && cognitoAuth.isAuthenticated) {
        const userData = {
            id: currentUser.sub || currentUser.id,
            email: userEmail, // Usar el email que encontramos
            fullName: currentUser.name || userEmail.split('@')[0],
            role: 'SALON_OWNER'
        };

        console.log("Estableciendo usuario en Redux:", userData);
        dispatch(setCognitoUser(userData, jwtToken));
    }

    // 🚀 PREPARAR DATOS DEL SALÓN CON MAPEO CORRECTO
    const salonDetails = {
        name: values.salonDetails.name.trim(),
        address: values.salonAddress.address.trim(),
        city: values.salonAddress.city.trim(),
        phone: values.salonAddress.phoneNumber?.trim() || "", // 🔥 MAPEO CORRECTO
        phoneNumber: values.salonAddress.phoneNumber?.trim() || "", // 🔥 DOBLE MAPEO PARA SEGURIDAD
        email: userEmail.trim(),
        openTime: getLocalTime(values.salonDetails.openTime),
        closeTime: getLocalTime(values.salonDetails.closeTime),
        images: values.salonDetails.images && values.salonDetails.images.length > 0 
            ? values.salonDetails.images 
            : ["https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=600"],
    };

    // 🚀 VALIDACIÓN FINAL DE DATOS
    console.log("📋 Datos del salón preparados:");
    console.log("   name:", `'${salonDetails.name}'`);
    console.log("   address:", `'${salonDetails.address}'`);
    console.log("   city:", `'${salonDetails.city}'`);
    console.log("   phone:", `'${salonDetails.phone}'`);
    console.log("   phoneNumber:", `'${salonDetails.phoneNumber}'`);
    console.log("   email:", `'${salonDetails.email}'`);
    console.log("   openTime:", `'${salonDetails.openTime}'`);
    console.log("   closeTime:", `'${salonDetails.closeTime}'`);
    console.log("   images count:", salonDetails.images.length);

    // Verificación final
    if (!salonDetails.name || !salonDetails.address || !salonDetails.city || !salonDetails.email) {
        console.error("❌ Faltan campos después del procesamiento:", {
            name: salonDetails.name,
            address: salonDetails.address,
            city: salonDetails.city,
            email: salonDetails.email
        });
        alert("Error procesando datos del salón. Verifica que todos los campos estén completos.");
        return;
    }

    console.log("🚀 Enviando datos al backend...");
    console.log("JWT que se enviará:", jwtToken.substring(0, 50) + "...");

    // Enviar al Redux
    dispatch(createSalonOnly({ salonDetails, navigate }));
};

  const createAdditionalSalon = (values) => {
    console.log("Crear salón adicional para salon owner existente");
    createSalonForExistingUser(values);
  };

  const redirectToCognito = (values) => {
    const redirectUri = encodeURIComponent("http://localhost:3000/auth/callback");
    const state = encodeURIComponent(JSON.stringify({ 
      role: 'SALON_OWNER',
      returnTo: 'create-salon'
    }));
    
    cognitoAuth.signinRedirect({
      extraQueryParams: {
        state: state
      }
    });
  };

  const getLocalTime = (time) => {
    if (!time) return "09:00:00";
    if (typeof time === 'string') return time.includes(':') ? time + ":00" : time;
    
    let hour = time.$H || 9;
    let minute = time.$m || 0;
    let second = time.$s || 0;

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
  };

  const handleDialogAction = (action) => {
    setShowDialog(false);
    
    switch (action) {
      case 'CONTINUE_SALON_CREATION':
        if (userScenario === 'EXISTING_CUSTOMER' || userScenario === 'EXISTING_SALON_OWNER') {
          setActiveStep(1);
        }
        break;
      case 'GO_TO_DASHBOARD':
        navigate('/salon-dashboard');
        break;
      case 'LOGOUT_AND_REGISTER':
        cognitoAuth.removeUser();
        localStorage.removeItem('jwt');
        setUserScenario('NEW_USER');
        break;
      default:
        navigate('/');
    }
  };

  const renderUserScenarioDialog = () => {
    const currentUser = cognitoAuth.user?.profile || auth.user;
    
    switch (userScenario) {
      case 'EXISTING_SALON_OWNER':
        return (
          <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
            <DialogTitle>Ya eres propietario de salón</DialogTitle>
            <DialogContent>
              <p>Hola {currentUser?.name || currentUser?.fullName}, ya tienes una cuenta como propietario de salón.</p>
              <p>¿Qué te gustaría hacer?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleDialogAction('GO_TO_DASHBOARD')}>
                Ir a mi Dashboard
              </Button>
              <Button onClick={() => handleDialogAction('CONTINUE_SALON_CREATION')} variant="contained">
                Crear otro salón
              </Button>
            </DialogActions>
          </Dialog>
        );
      
      case 'EXISTING_CUSTOMER':
        return (
          <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
            <DialogTitle>¡Conviértete en propietario de salón!</DialogTitle>
            <DialogContent>
              <p>Hola {currentUser?.name || currentUser?.fullName}, ya tienes una cuenta como cliente.</p>
              <p>¿Te gustaría crear un salón y convertirte en propietario?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleDialogAction('CANCEL')}>
                Cancelar
              </Button>
              <Button onClick={() => handleDialogAction('CONTINUE_SALON_CREATION')} variant="contained">
                Sí, crear mi salón
              </Button>
            </DialogActions>
          </Dialog>
        );
      
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <div className="w-full">
      {userScenario === 'EXISTING_CUSTOMER' && (
        <Alert severity="info" className="mb-4">
          Como ya tienes una cuenta, solo necesitas completar los datos de tu salón.
        </Alert>
      )}
      
      {userScenario === 'EXISTING_SALON_OWNER' && (
        <Alert severity="warning" className="mb-4">
          Ya eres propietario de salón. ¿Quieres crear un salón adicional?
        </Alert>
      )}

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const isCompleted = (userScenario !== 'NEW_USER' && index === 0);
          return (
            <Step key={label} completed={isCompleted}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      
      <div className="mt-20 space-y-10">
        <div>
          {activeStep === 0 && userScenario === 'NEW_USER' ? (
            <BecomePartnerFormStep1 formik={formik} />
          ) : activeStep === 0 || activeStep === 1 ? (
            <BecomePartnerFormStep2 formik={formik} />
          ) : (
            <BecomePartnerFormStep3 formik={formik} />
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button
            disabled={activeStep === 0 || (userScenario !== 'NEW_USER' && activeStep === 1)}
            onClick={() => handleStep(-1)}
            variant="contained"
          >
            Atrás
          </Button>
          <Button
            onClick={
              activeStep === steps.length - 1
                ? handleSubmit
                : () => handleStep(1)
            }
            variant="contained"
          >
            {activeStep === steps.length - 1 ? (
              userScenario === 'NEW_USER' ? "Crear Cuenta y Salón" : "Crear Salón"
            ) : (
              "Continuar"
            )}
          </Button>
        </div>
      </div>

      {renderUserScenarioDialog()}
    </div>
  );
};

export default SalonForm;