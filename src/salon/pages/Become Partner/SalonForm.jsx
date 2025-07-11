// =============================================================================
// BECOME PARTNER - SalonForm.jsx CORREGIDO
// Verificar rol real de la BD antes de mostrar formulario
// =============================================================================
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
  Card,
  CardContent,
  Typography
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

const steps = ["Owner Details", "Salon Details", "Salon Address"];

const SalonForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cognitoAuth = useAuth();
  const { auth } = useSelector((store) => store);

  // 🚀 VERIFICAR ROL REAL AL CARGAR
  useEffect(() => {
    checkUserRole();
  }, [cognitoAuth.isAuthenticated, auth.user]);

  /**
   * 🔍 VERIFICAR ROL REAL DESDE LA BD
   */
  const checkUserRole = async () => {
    try {
      setLoading(true);

      // Si no está autenticado, es nuevo usuario
      if (!cognitoAuth.isAuthenticated && !auth.user) {
        console.log('👤 Usuario no autenticado - nuevo usuario');
        setUserRole('NEW_USER');
        setLoading(false);
        return;
      }

      // 🚀 LLAMAR AL BACKEND PARA OBTENER ROL REAL
      const token = localStorage.getItem('jwt');
      if (!token) {
        setUserRole('NEW_USER');
        setLoading(false);
        return;
      }

      console.log('🔄 Verificando rol del usuario en BD...');
      
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Datos del usuario obtenidos:', userData);
        
        const role = userData.role;
        setUserRole(role);

        // 🚀 MOSTRAR DIALOG SEGÚN EL ROL
        if (role === 'SALON_OWNER' || role === 'ROLE_SALON_OWNER') {
          setShowDialog(true);
        } else if (role === 'CUSTOMER') {
          setShowDialog(true); // Preguntar si quiere ser salon owner
        }
      } else {
        console.log('⚠️ Usuario no encontrado en BD');
        setUserRole('NEW_USER');
      }
    } catch (error) {
      console.error('❌ Error verificando rol:', error);
      setUserRole('NEW_USER');
    } finally {
      setLoading(false);
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
    if (userRole === 'NEW_USER') {
      createUserAndSalon(values);
    } else {
      createSalonForExistingUser(values);
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
    
    if (!values.salonDetails.name || !values.salonAddress.address || !values.salonAddress.city) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    const userEmail = cognitoAuth.user?.profile?.email || auth.user?.email;
    
    const salonDetails = {
      name: values.salonDetails.name.trim(),
      address: values.salonAddress.address.trim(),
      city: values.salonAddress.city.trim(),
      phone: values.salonAddress.phoneNumber?.trim() || "",
      phoneNumber: values.salonAddress.phoneNumber?.trim() || "",
      email: userEmail.trim(),
      openTime: getLocalTime(values.salonDetails.openTime),
      closeTime: getLocalTime(values.salonDetails.closeTime),
      images: values.salonDetails.images?.length > 0 
        ? values.salonDetails.images 
        : ["https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=600"],
    };

    console.log("🚀 Enviando datos al backend...");
    dispatch(createSalonOnly({ salonDetails, navigate }));
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
      case 'CREATE_ADDITIONAL_SALON':
        // Permitir crear salón adicional
        console.log('✅ Permitiendo crear salón adicional');
        setActiveStep(1); // Saltar detalles del owner
        break;
      case 'GO_TO_DASHBOARD':
        navigate('/salon-dashboard');
        break;
      case 'BECOME_SALON_OWNER':
        // Cliente quiere convertirse en salon owner
        console.log('✅ Cliente quiere ser salon owner');
        setActiveStep(1); // Saltar detalles del owner
        break;
      case 'LOGOUT_AND_REGISTER':
        cognitoAuth.removeUser();
        localStorage.removeItem('jwt');
        setUserRole('NEW_USER');
        break;
      default:
        navigate('/');
    }
  };

  /**
   * 🎯 RENDER DIALOG SEGÚN ROL
   */
  const renderUserDialog = () => {
    const currentUser = cognitoAuth.user?.profile || auth.user;
    
    if (userRole === 'SALON_OWNER' || userRole === 'ROLE_SALON_OWNER') {
      return (
        <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
          <DialogTitle>⚠️ Ya eres propietario de salón</DialogTitle>
          <DialogContent>
            <Typography paragraph>
              Hola <strong>{currentUser?.name || currentUser?.fullName}</strong>, 
              ya tienes una cuenta como propietario de salón.
            </Typography>
            <Typography paragraph>
              Actualmente <strong>no permitimos múltiples salones</strong> por usuario. 
              ¿Te gustaría ir a tu dashboard actual?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogAction('GO_TO_DASHBOARD')} variant="contained">
              Ir a mi Dashboard
            </Button>
            <Button onClick={() => handleDialogAction('CANCEL')}>
              Volver al inicio
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    
    if (userRole === 'CUSTOMER') {
      return (
        <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
          <DialogTitle>🏪 ¡Conviértete en propietario de salón!</DialogTitle>
          <DialogContent>
            <Typography paragraph>
              Hola <strong>{currentUser?.name || currentUser?.fullName}</strong>, 
              tienes una cuenta como cliente.
            </Typography>
            <Typography paragraph>
              ¿Te gustaría crear un salón y convertirte en propietario?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogAction('CANCEL')}>
              No, gracias
            </Button>
            <Button onClick={() => handleDialogAction('BECOME_SALON_OWNER')} variant="contained">
              Sí, crear mi salón
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    
    return null;
  };

  // 🔄 LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <CircularProgress size={60} className="mb-4" />
            <Typography variant="h6">Verificando tu perfil...</Typography>
            <Typography variant="body2" color="textSecondary">
              Consultando rol actual en base de datos
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <div className="w-full">
      {/* 🚀 MOSTRAR ALERT SEGÚN ROL */}
      {userRole === 'CUSTOMER' && (
        <Alert severity="info" className="mb-4">
          Como ya tienes una cuenta, solo necesitas completar los datos de tu salón.
        </Alert>
      )}
      
      {userRole === 'SALON_OWNER' && (
        <Alert severity="warning" className="mb-4">
          Ya eres propietario de salón. Actualmente no permitimos múltiples salones.
        </Alert>
      )}

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const isCompleted = (userRole !== 'NEW_USER' && index === 0);
          return (
            <Step key={label} completed={isCompleted}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      
      <div className="mt-20 space-y-10">
        <div>
          {activeStep === 0 && userRole === 'NEW_USER' ? (
            <BecomePartnerFormStep1 formik={formik} />
          ) : activeStep === 0 || activeStep === 1 ? (
            <BecomePartnerFormStep2 formik={formik} />
          ) : (
            <BecomePartnerFormStep3 formik={formik} />
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button
            disabled={activeStep === 0 || (userRole !== 'NEW_USER' && activeStep === 1)}
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
              userRole === 'NEW_USER' ? "Crear Cuenta y Salón" : "Crear Salón"
            ) : (
              "Continuar"
            )}
          </Button>
        </div>
      </div>

      {renderUserDialog()}
    </div>
  );
};

export default SalonForm;