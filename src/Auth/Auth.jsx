// src/Auth/Auth.jsx - Solo Cognito
import { Alert, Button, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { cognitoDomain, clientId } from "../util/cognitoConfig";

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

  // Si ya está autenticado con Cognito, redirigir
  if (cognitoAuth.isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleCognitoLogin = () => {
    cognitoAuth.signinRedirect();
  };

  const handleCognitoSignup = () => {
    const redirectUri = encodeURIComponent("http://localhost:3000/auth/callback");
    window.location.href = `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=openid+email+phone+profile&redirect_uri=${redirectUri}`;
  };

  return (
    <div className="flex justify-center items-center h-[95vh]">
      <div className="shadow-xl p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
          {location.pathname === "/register" ? "Create Account" : "Sign In"}
        </h2>
        
        <div className="space-y-4">
          {location.pathname === "/register" ? (
            <>
              <Button
                onClick={handleCognitoSignup}
                fullWidth
                variant="contained"
                color="primary"
                sx={{ py: 1.5 }}
              >
                Sign Up with AWS Cognito
              </Button>
              <div className="text-center mt-4">
                <span className="text-gray-600">Already have an account? </span>
                <Button 
                  onClick={() => navigate("/login")}
                  color="primary"
                >
                  Sign In
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                onClick={handleCognitoLogin}
                fullWidth
                variant="contained"
                color="primary"
                sx={{ py: 1.5 }}
              >
                Sign In with AWS Cognito
              </Button>
              <div className="text-center mt-4">
                <span className="text-gray-600">Don't have an account? </span>
                <Button 
                  onClick={() => navigate("/register")}
                  color="primary"
                >
                  Sign Up
                </Button>
              </div>
            </>
          )}

          <div className="mt-6 pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Want to become a salon owner?</p>
              <Button
                onClick={() => navigate("/become-partner")}
                variant="outlined"
                color="secondary"
                fullWidth
              >
                Become a Partner
              </Button>
            </div>
          </div>
        </div>

        <Snackbar
          sx={{ zIndex: 50 }}
          open={openSnackBar}
          autoHideDuration={3000}
          onClose={handleCloseSnackBar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={auth.error ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {auth.success ||
              auth.error?.response?.data?.message ||
              auth.error?.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Auth;