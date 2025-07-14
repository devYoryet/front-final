import { ThemeProvider } from "@mui/material";

import greenTheme from "./Theme/greenTheme";
import { Route, Routes, useNavigate } from "react-router-dom";

import SalonDashboard from "./salon/pages/SellerDashboard/SalonDashboard";
import Auth from "./Auth/Auth";
import AuthCallback from "./Auth/AuthCallback";
import CompleteSalonProfile from "./salon/pages/CompleteSalonProfile"; // ⭐ Agregar import
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./Redux/Auth/action";
import BecomePartner from "./salon/pages/Become Partner/BecomePartnerForm";
import CustomerRoutes from "./routes/CustomerRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AdminDashboard from "./Admin/pages/Dashboard/Dashboard";
import { useAuth } from "react-oidc-context";
import redTheme from "./Theme/redTheme";
import SimpleSearch from './Customer/pages/Salon/SimpleSearch';


function App() {
  const { auth } = useSelector((store) => store);
  const cognitoAuth = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Solo usar el sistema anterior si no hay autenticación de Cognito
    if (!cognitoAuth.isAuthenticated && (auth.jwt || localStorage.getItem("jwt"))) {
      dispatch(getUser(auth.jwt || localStorage.getItem("jwt")));
    }
  }, [auth.jwt, cognitoAuth.isAuthenticated]);

  useEffect(()=>{
    if(auth.user?.role==="SALON_OWNER" || auth.user?.role==="ROLE_SALON_OWNER"){
      navigate("/salon-dashboard");
    }
  },[auth.user?.role])

  return (
    <ThemeProvider theme={greenTheme}>
      <div className="relative">
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/complete-salon-profile" element={<CompleteSalonProfile />} /> {/* ⭐ Agregar ruta */}
          <Route path="/salon-dashboard/*" element={<SalonDashboard />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/become-partner" element={<BecomePartner />} />
          <Route path="/admin/*" element={<AdminDashboard/>} />
          <Route path="/buscar" element={<SimpleSearch />} />

          <Route path="*" element={<CustomerRoutes />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;