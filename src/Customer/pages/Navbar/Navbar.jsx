// src/Customer/pages/Navbar/Navbar.jsx - Con debug
import {
  Avatar,
  Badge,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../Redux/Auth/action";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import useNotificationWebsoket from "../../../util/useNotificationWebsoket";
import { fetchNotificationsByUser } from "../../../Redux/Notifications/action";
import { useTheme } from "@emotion/react";
import { useAuth } from "react-oidc-context";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, notification } = useSelector((store) => store);
  const cognitoAuth = useAuth();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  // Debug: Ver el estado de autenticación
  console.log('Navbar - Auth states:', {
    cognitoAuthenticated: cognitoAuth.isAuthenticated,
    cognitoLoading: cognitoAuth.isLoading,
    cognitoUser: cognitoAuth.user?.profile,
    reduxUser: auth.user,
    reduxJwt: auth.jwt
  });
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (path) => () => {
    if (path === "/logout") {
      // Logout tanto de Cognito como de Redux
      if (cognitoAuth.isAuthenticated) {
        cognitoAuth.removeUser();
      }
      dispatch(logout());
      localStorage.removeItem("jwt");
      navigate("/");
      handleClose();
      return;
    }
    navigate(path);
    handleClose();
  };

  // Determinar qué usuario usar (priorizar Cognito)
  const currentUser = cognitoAuth.isAuthenticated && cognitoAuth.user
    ? {
        id: cognitoAuth.user.profile.sub,
        email: cognitoAuth.user.profile.email,
        fullName: cognitoAuth.user.profile.name || cognitoAuth.user.profile.email,
        role: cognitoAuth.user.profile['custom:role'] || 'CUSTOMER'
      }
    : auth.user;

  const isAuthenticated = cognitoAuth.isAuthenticated || !!auth.user;

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchNotificationsByUser({
        userId: currentUser.id,
        jwt: cognitoAuth.user?.access_token || localStorage.getItem('jwt')
      }));
    }
  }, [currentUser?.id, cognitoAuth.user?.access_token]);

  useNotificationWebsoket(currentUser?.id, "user");

  // Mostrar loading si Cognito está cargando
  if (cognitoAuth.isLoading) {
    return (
      <div className="z-50 px-6 flex items-center justify-between py-2 fixed top-0 left-0 right-0 bg-white">
        <div className="flex items-center gap-10">
          <h1 className="cursor-pointer font-bold lg:text-2xl">Salon Service</h1>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="z-50 px-6 flex items-center justify-between py-2 fixed top-0 left-0 right-0 bg-white shadow-sm">
      <div className="flex items-center gap-10">
        <h1
          onClick={() => navigate("/")}
          className="cursor-pointer font-bold lg:text-2xl text-green-600"
        >
          Salon Service
        </h1>
        <div className="lg:flex items-center gap-5 hidden">
          <h1 
            className="cursor-pointer hover:text-primary-color transition-colors" 
            onClick={() => navigate("/")}
          >
            Home
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        <Button 
          onClick={() => navigate("/become-partner")} 
          variant="outlined"
          size="small"
        >
          Become Partner
        </Button>

        {isAuthenticated && (
          <IconButton onClick={() => navigate("/notifications")}>
            <Badge badgeContent={notification.unreadCount} color="secondary">
              <NotificationsActiveIcon color="primary" />
            </Badge>
          </IconButton>
        )}

        {isAuthenticated ? (
          <div className="flex gap-1 items-center">
            <h1 className="text-lg font-semibold hidden lg:block">
              {currentUser?.fullName || 'Usuario'}
            </h1>

            <IconButton
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                {(currentUser?.fullName && currentUser.fullName[0].toUpperCase()) || 'U'}
              </Avatar>
            </IconButton>
            
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleMenuClick("/bookings")}>
                My Bookings
              </MenuItem>
              {(currentUser?.role === "SALON_OWNER" || currentUser?.role === "ROLE_SALON_OWNER") && (
                <MenuItem onClick={handleMenuClick("/salon-dashboard")}>
                  Dashboard
                </MenuItem>
              )}
              <MenuItem onClick={handleMenuClick("/logout")}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <Button
            onClick={() => navigate("/login")}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AccountCircleIcon />}
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;