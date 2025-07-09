// src/Auth/Auth.jsx - Versión en Español con Cognito
import { Alert, Button, Snackbar, Box, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { getCognitoUrls } from "../util/cognitoConfig";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const cognitoAuth = useAuth();
  const [openSnackBar, setOpenSnackBar] = useState(false);

  useEffect(() => {
    if (auth.success || auth.error) setOpenSnackBar(true);
  }, [auth.success, auth.error]);

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  // Si ya está autenticado con Cognito, redirigir al home
  useEffect(() => {
    if (cognitoAuth.isAuthenticated) {
      navigate('/');
    }
  }, [cognitoAuth.isAuthenticated, navigate]);

  const handleCognitoLogin = () => {
    cognitoAuth.signinRedirect();
  };

  const handleCognitoSignup = () => {
    const urls = getCognitoUrls();
    window.location.href = urls.signup;
  };

  if (cognitoAuth.isAuthenticated) {
    return null;
  }

  return (
    <Box 
      sx={{ 
        minHeight: '95vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 2
      }}
    >
      <Paper 
        elevation={8} 
        sx={{ 
          padding: 4, 
          borderRadius: 3,
          maxWidth: 450,
          width: '100%',
          textAlign: 'center'
        }}
      >
        {/* Logo o Título Principal */}
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            marginBottom: 1
          }}
        >
          Salon Beauty
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: 'text.secondary',
            marginBottom: 4
          }}
        >
          Plataforma de Gestión de Salones de Belleza
        </Typography>

        {/* Sección de Iniciar Sesión */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 'medium',
              marginBottom: 2,
              color: 'text.primary'
            }}
          >
            ¿Ya tienes una cuenta?
          </Typography>
          
          <Button
            onClick={handleCognitoLogin}
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'medium',
              marginBottom: 2
            }}
          >
            Iniciar Sesión
          </Button>
          
          <Typography 
            variant="body2" 
            sx={{ color: 'text.secondary' }}
          >
            Accede con tu cuenta existente
          </Typography>
        </Box>

        {/* Divisor */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '24px 0'
          }}
        >
          <Box sx={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
          <Typography 
            variant="body2" 
            sx={{ 
              padding: '0 16px', 
              color: 'text.secondary',
              fontWeight: 'medium'
            }}
          >
            O
          </Typography>
          <Box sx={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
        </Box>

        {/* Sección de Crear Cuenta */}
        <Box>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 'medium',
              marginBottom: 2,
              color: 'text.primary'
            }}
          >
            ¿Eres nuevo aquí?
          </Typography>
          
          <Button
            onClick={handleCognitoSignup}
            fullWidth
            variant="outlined"
            color="primary"
            size="large"
            sx={{ 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'medium',
              marginBottom: 2
            }}
          >
            Crear Cuenta Nueva
          </Button>
          
          <Typography 
            variant="body2" 
            sx={{ color: 'text.secondary' }}
          >
            Únete a nuestra plataforma gratuitamente
          </Typography>
        </Box>

        {/* Información adicional */}
        <Box 
          sx={{ 
            marginTop: 4,
            padding: 2,
            backgroundColor: '#f8f9fa',
            borderRadius: 2
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              lineHeight: 1.6
            }}
          >
            🏪 <strong>Dueños de Salón:</strong> Gestiona tu negocio<br/>
            👤 <strong>Clientes:</strong> Reserva citas fácilmente<br/>
            ⚙️ <strong>Administradores:</strong> Control total del sistema
          </Typography>
        </Box>
      </Paper>

      {/* Snackbar para errores */}
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={auth.error ? "error" : "success"}
          variant="filled"
        >
          {auth.error 
            ? "Error en la autenticación. Inténtalo de nuevo." 
            : "¡Autenticación exitosa!"
          }
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Auth;