// src/salon/pages/Become Partner/SalonForm.jsx - Flujo inteligente
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

const steps = ["Owner Details", "Salon Details", "Salon Address"];

const SalonForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [userScenario, setUserScenario] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cognitoAuth = useAuth();
  const { auth } = useSelector((store) => store);

  // Determinar el escenario del usuario al cargar
  useEffect(() => {
    analyzeUserScenario();
  }, [cognitoAuth.isAuthenticated, auth.user]);

  const analyzeUserScenario = () => {
    if (cognitoAuth.isAuthenticated || auth.user) {
      // Usuario ya logueado
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
      // Usuario nuevo
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
        // Crear usuario en Cognito + salón
        createUserAndSalon(values);
        break;
      case 'EXISTING_CUSTOMER':
        // Solo crear salón (usuario ya existe)
        createSalonForExistingUser(values);
        break;
      case 'EXISTING_SALON_OWNER':
        // Crear segundo salón o redirigir a dashboard
        createAdditionalSalon(values);
        break;
      default:
        console.error('Escenario no reconocido');
    }
  };

  const createUserAndSalon = (values) => {
    console.log("Crear usuario nuevo + salón");
    
    // Guardar datos del salón temporalmente
    const salonData = {
      salonDetails: {
        ...values.salonDetails,
        openTime: getLocalTime(values.salonDetails.openTime),
        closeTime: getLocalTime(values.salonDetails.closeTime),
      },
      salonAddress: values.salonAddress
    };
    
    localStorage.setItem('pendingSalonData', JSON.stringify(salonData));
    
    // Redirigir a Cognito
    redirectToCognito(values);
  };

  const createSalonForExistingUser = (values) => {
    console.log("Crear salón para usuario existente");
    
    const salonDetails = {
      name: values.salonDetails.name,
      address: values.salonAddress.address,
      city: values.salonAddress.city,
      phone: values.salonAddress.phoneNumber,
      email: values.salonAddress.email,
      openTime: getLocalTime(values.salonDetails.openTime),
      closeTime: getLocalTime(values.salonDetails.closeTime),
      images: values.salonDetails.images.length > 0 ? values.salonDetails.images : [
        "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=600"
      ],
    };

    dispatch(createSalonOnly({ salonDetails, navigate }));
  };

  const createAdditionalSalon = (values) => {
    console.log("Crear salón adicional para salon owner existente");
    // Misma lógica que createSalonForExistingUser
    createSalonForExistingUser(values);
  };

  const redirectToCognito = (values) => {
    const redirectUri = encodeURIComponent("http://localhost:3000/auth/callback");
    const state = encodeURIComponent(JSON.stringify({ 
      role: 'SALON_OWNER',
      returnTo: 'create-salon'
    }));
    
    // Usar signinRedirect del contexto de auth
    cognitoAuth.signinRedirect({
      extraQueryParams: {
        state: state
      }
    });
  };

  const getLocalTime = (time) => {
    if (!time) return "09:00:00";
    if (typeof time === 'string') return time + ":00";
    
    let hour = time.$H || 9;
    let minute = time.$m || 0;
    let second = time.$s || 0;

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
  };

  const handleDialogAction = (action) => {
    setShowDialog(false);
    
    switch (action) {
      case 'CONTINUE_SALON_CREATION':
        // Continuar con la creación del salón
        if (userScenario === 'EXISTING_CUSTOMER' || userScenario === 'EXISTING_SALON_OWNER') {
          setActiveStep(1); // Saltar paso de datos de usuario
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
      {/* Mostrar alert según el escenario */}
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
          // Marcar como completado si el usuario ya existe
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

      {/* Dialog para manejar diferentes escenarios */}
      {renderUserScenarioDialog()}
    </div>
  );
};

export default SalonForm;