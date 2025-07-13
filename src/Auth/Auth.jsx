import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Container,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useAuth } from "react-oidc-context";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Auth = () => {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const cognitoAuth = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleCloseSnackBar = () => setOpenSnackBar(false);

  // Efectos originales
  useEffect(() => {
    if (auth.success || auth.error) setOpenSnackBar(true);
  }, [auth.success, auth.error]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (cognitoAuth.isAuthenticated) {
      navigate("/");
    }
  }, [cognitoAuth.isAuthenticated, navigate]);

  // Manejar login con Cognito (método original)
  const handleCognitoLogin = () => {
    cognitoAuth.signinRedirect();
  };

  // Manejar registro con Cognito (método original)
  const handleCognitoSignup = () => {
    //const redirectUri = encodeURIComponent("http://localhost:3000/auth/callback");
    const redirectUri = encodeURIComponent("https://front-final-nine.vercel.app/auth/callback");
    
    const { cognitoDomain, clientId } = require("../util/cognitoConfig");
    const signupUrl = `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${redirectUri}`;
    window.location.href = signupUrl;
  };

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (cognitoAuth.isAuthenticated) {
      navigate("/");
    }
  }, [cognitoAuth.isAuthenticated, navigate]);

  // Mostrar loading si está cargando (solo de Cognito)
  if (cognitoAuth.isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f8f9fa"
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={60} color="primary" />
          <Typography variant="h6" color="textSecondary">
            Cargando...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={20}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              minHeight: { xs: "auto", md: "600px" },
            }}
          >
            {/* Panel Izquierdo - Branding */}
            <Box
              sx={{
                flex: 1,
                background: "linear-gradient(135deg, #019031 0%, #0c7a2b 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 4,
                color: "white",
                textAlign: "center",
              }}
            >
              {/* Logo */}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 2,
                  fontSize: { xs: "2rem", md: "3rem" },
                }}
              >
                <span style={{ color: "#ffffff" }}>Urban</span>
                <span style={{ color: "#c8e6c9" }}>Glow</span>
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h6"
                sx={{
                  marginBottom: 3,
                  opacity: 0.9,
                  fontWeight: "light",
                }}
              >
                Tu plataforma de belleza y bienestar
              </Typography>

              {/* Features */}
              <Box sx={{ width: "100%", maxWidth: 400 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <BusinessIcon sx={{ mr: 2, color: "#c8e6c9" }} />
                  <Typography variant="body1">
                    Gestión completa de salones
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PersonIcon sx={{ mr: 2, color: "#c8e6c9" }} />
                  <Typography variant="body1">
                    Reservas fáciles y rápidas
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AdminPanelSettingsIcon sx={{ mr: 2, color: "#c8e6c9" }} />
                  <Typography variant="body1">
                    Administración avanzada
                  </Typography>
                </Box>
              </Box>

              {/* Decorative image */}
              <Box
                sx={{
                  width: "100%",
                  height: 200,
                  backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                  marginTop: 3,
                  opacity: 0.8,
                }}
              />
            </Box>

            {/* Panel Derecho - Formulario */}
            <Box
              sx={{
                flex: 1,
                padding: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: "white",
              }}
            >
              {/* Header */}
              <Box sx={{ textAlign: "center", marginBottom: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#2c3e50",
                    marginBottom: 1,
                  }}
                >
                  Bienvenido
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#7f8c8d",
                    fontSize: "1.1rem",
                  }}
                >
                  Accede a tu cuenta o crea una nueva
                </Typography>
              </Box>

              {/* Login Section */}
              <Card
                sx={{
                  marginBottom: 3,
                  border: "2px solid #019031",
                  borderRadius: 3,
                  boxShadow: "0 8px 16px rgba(1, 144, 49, 0.1)",
                }}
              >
                <CardContent sx={{ padding: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <LoginIcon sx={{ mr: 2, color: "#019031" }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#2c3e50",
                      }}
                    >
                      Iniciar Sesión
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#7f8c8d",
                      marginBottom: 2,
                    }}
                  >
                    Accede con tu cuenta existente
                  </Typography>

                  <Button
                    onClick={handleCognitoLogin}
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "#019031",
                      "&:hover": {
                        backgroundColor: "#0c7a2b",
                      },
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(1, 144, 49, 0.3)",
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                </CardContent>
              </Card>

              {/* Divider */}
              <Box sx={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
                <Divider sx={{ flex: 1, backgroundColor: "#bdc3c7" }} />
                <Typography
                  variant="body2"
                  sx={{
                    padding: "0 20px",
                    color: "#7f8c8d",
                    fontWeight: "medium",
                    backgroundColor: "white",
                  }}
                >
                  O
                </Typography>
                <Divider sx={{ flex: 1, backgroundColor: "#bdc3c7" }} />
              </Box>

              {/* Register Section */}
              <Card
                sx={{
                  border: "2px solid #e8f5e8",
                  borderRadius: 3,
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)",
                }}
              >
                <CardContent sx={{ padding: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PersonAddIcon sx={{ mr: 2, color: "#019031" }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#2c3e50",
                      }}
                    >
                      ¿Eres nuevo aquí?
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#7f8c8d",
                      marginBottom: 2,
                    }}
                  >
                    Únete a nuestra plataforma gratuitamente
                  </Typography>

                  <Button
                    onClick={handleCognitoSignup}
                    fullWidth
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: "#019031",
                      color: "#019031",
                      "&:hover": {
                        borderColor: "#0c7a2b",
                        backgroundColor: "rgba(1, 144, 49, 0.04)",
                      },
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      borderRadius: 2,
                      borderWidth: 2,
                    }}
                  >
                    Crear Cuenta Nueva
                  </Button>
                </CardContent>
              </Card>

              {/* Info Section */}
              <Box
                sx={{
                  marginTop: 4,
                  padding: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                  border: "1px solid #e9ecef",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6c757d",
                    lineHeight: 1.6,
                    textAlign: "center",
                  }}
                >
                  🏪 <strong>Dueños de Salón:</strong> Gestiona tu negocio
                  <br />
                  👤 <strong>Clientes:</strong> Reserva citas fácilmente
                  <br />
                  ⚙️ <strong>Administradores:</strong> Control total del sistema
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Snackbar para errores */}
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={auth.error ? "error" : "success"}
          variant="filled"
          sx={{
            "& .MuiAlert-filledError": {
              backgroundColor: "#f44336",
            },
            "& .MuiAlert-filledSuccess": {
              backgroundColor: "#019031",
            },
          }}
        >
          {auth.error
            ? "Error en la autenticación. Inténtalo de nuevo."
            : "¡Autenticación exitosa!"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Auth;