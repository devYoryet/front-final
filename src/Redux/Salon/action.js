// =============================================================================
// SALON ACTION - Actualizar TODAS las funciones para Cognito
// src/Redux/Salon/action.js
// =============================================================================
import axios from "axios";
import {
  CREATE_SALON_REQUEST,
  CREATE_SALON_SUCCESS,
  CREATE_SALON_FAILURE,
  UPDATE_SALON_REQUEST,
  UPDATE_SALON_SUCCESS,
  UPDATE_SALON_FAILURE,
  FETCH_SALONS_REQUEST,
  FETCH_SALONS_SUCCESS,
  FETCH_SALONS_FAILURE,
  FETCH_SALON_BY_ID_REQUEST,
  FETCH_SALON_BY_ID_SUCCESS,
  FETCH_SALON_BY_ID_FAILURE,
  FETCH_SALON_BY_OWNER_REQUEST,
  FETCH_SALON_BY_OWNER_SUCCESS,
  FETCH_SALON_BY_OWNER_FAILURE,
  SEARCH_SALONS_REQUEST,
  SEARCH_SALONS_SUCCESS,
  SEARCH_SALONS_FAILURE,
} from "./actionTypes";
import { SET_COGNITO_USER } from "../Auth/actionTypes";
import api from "../../config/api";

const API_BASE_URL = "/api/salons";

// 🚀 FUNCIÓN AUXILIAR PARA OBTENER JWT
const getJwtToken = () => {
  return localStorage.getItem("jwt");
};

// 🚀 FUNCIÓN PRINCIPAL - YA CORREGIDA
export const createSalonOnly = (reqData) => async (dispatch, getState) => {
  dispatch({ type: CREATE_SALON_REQUEST });
  
  try {
    const jwt = getJwtToken();
    
    console.log("=== CREATE SALON ONLY ===");
    console.log("Datos recibidos:", reqData.salonDetails);
    console.log("JWT disponible:", jwt ? "SÍ" : "NO");
    
    if (!jwt) {
      throw new Error("No se encontró JWT para la autenticación");
    }

    // 🚀 MAPEAR CORRECTAMENTE LOS DATOS
    const salonData = {
      name: reqData.salonDetails.name,
      address: reqData.salonDetails.address,
      city: reqData.salonDetails.city,
      phoneNumber: reqData.salonDetails.phone || reqData.salonDetails.phoneNumber || "",
      email: reqData.salonDetails.email,
      openTime: reqData.salonDetails.openTime,
      closeTime: reqData.salonDetails.closeTime,
      images: reqData.salonDetails.images || [
        "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=600"
      ]
    };

    console.log("📋 Datos mapeados para backend:", salonData);

    // Crear el salón
    const { data } = await api.post(API_BASE_URL, salonData, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    console.log("✅ Salón creado exitosamente:", data);
    dispatch({ type: CREATE_SALON_SUCCESS, payload: data });

    // 🚀 ACTUALIZAR ROL DEL USUARIO EN REDUX
    await updateUserRoleInRedux(dispatch, getState, jwt);

    // Navegar al dashboard del salón
    if (reqData.navigate) {
      reqData.navigate("/salon-dashboard");
    }

    return data;
    
  } catch (error) {
    console.error("❌ Error creando salón:", error);
    dispatch({ type: CREATE_SALON_FAILURE, payload: error.message });
    throw error;
  }
};

// 🚀 FUNCIÓN ACTUALIZADA PARA COGNITO
export const fetchSalons = () => async (dispatch) => {
  dispatch({ type: FETCH_SALONS_REQUEST });
  try {
    const jwt = getJwtToken();
    
    if (!jwt) {
      throw new Error("No hay token de autenticación");
    }

    const { data } = await api.get(API_BASE_URL, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    
    console.log("all salons - ", data);
    dispatch({ type: FETCH_SALONS_SUCCESS, payload: data });
  } catch (error) {
    console.log("error fetching salons - ", error);
    dispatch({ type: FETCH_SALONS_FAILURE, payload: error.message });
  }
};

// 🚀 FUNCIÓN ACTUALIZADA PARA COGNITO
export const fetchSalonById = (salonId) => async (dispatch) => {
  dispatch({ type: FETCH_SALON_BY_ID_REQUEST });
  try {
    const jwt = getJwtToken();
    
    if (!jwt) {
      throw new Error("No hay token de autenticación");
    }

    const { data } = await api.get(`${API_BASE_URL}/${salonId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    
    console.log("salon by id - ", data);
    dispatch({ type: FETCH_SALON_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    console.log("error fetching salon by id - ", error);
    dispatch({ type: FETCH_SALON_BY_ID_FAILURE, payload: error.message });
  }
};

// 🚀 FUNCIÓN ACTUALIZADA PARA COGNITO
export const fetchSalonByOwner = () => async (dispatch) => {
  dispatch({ type: FETCH_SALON_BY_OWNER_REQUEST });
  try {
    const jwt = getJwtToken();
    
    if (!jwt) {
      console.log("⚠️ No hay JWT, usuario no autenticado");
      dispatch({ type: FETCH_SALON_BY_OWNER_FAILURE, payload: "Usuario no autenticado" });
      return;
    }

    const { data } = await api.get(`${API_BASE_URL}/owner`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    
    console.log("salon by owner - ", data);
    dispatch({ type: FETCH_SALON_BY_OWNER_SUCCESS, payload: data });
  } catch (error) {
    console.log("error fetching salon by owner - ", error);
    if (error.response?.status === 404) {
      // El usuario no tiene salón, esto es normal
      dispatch({ type: FETCH_SALON_BY_OWNER_SUCCESS, payload: null });
    } else {
      dispatch({ type: FETCH_SALON_BY_OWNER_FAILURE, payload: error.message });
    }
  }
};

// 🚀 FUNCIÓN ACTUALIZADA PARA COGNITO
export const searchSalon = (city) => async (dispatch) => {
  dispatch({ type: SEARCH_SALONS_REQUEST });
  try {
    const jwt = getJwtToken();
    
    if (!jwt) {
      throw new Error("No hay token de autenticación");
    }

    const { data } = await api.get(`${API_BASE_URL}/search`, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { city: city },
    });
    
    console.log("Search salon - ", data);
    dispatch({ type: SEARCH_SALONS_SUCCESS, payload: data });
  } catch (error) {
    console.log("error searching salons - ", error);
    dispatch({ type: SEARCH_SALONS_FAILURE, payload: error.message });
  }
};

// 🚀 FUNCIÓN ACTUALIZADA PARA COGNITO
export const updateSalon = (salonId, salon) => async (dispatch) => {
  dispatch({ type: UPDATE_SALON_REQUEST });
  try {
    const jwt = getJwtToken();
    
    if (!jwt) {
      throw new Error("No hay token de autenticación");
    }

    const { data } = await api.patch(`${API_BASE_URL}/${salonId}`, salon, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    
    dispatch({ type: UPDATE_SALON_SUCCESS, payload: data });
    console.log("salon updated", data);
  } catch (error) {
    console.log("error updating salon", error);
    dispatch({ type: UPDATE_SALON_FAILURE, payload: error.message });
  }
};

// 🚀 FUNCIÓN LEGACY (mantener por compatibilidad)
export const createSalon = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_SALON_REQUEST });
  try {
    const response = await api.post(`/auth/signup`, reqData.ownerDetails);
    localStorage.setItem("jwt", response.data.data.jwt);

    const { data } = await api.post(API_BASE_URL, reqData.salonDetails, {
      headers: { Authorization: `Bearer ${response.data.data.jwt}` },
    });

    reqData.navigate("/salon-dashboard");
    console.log("salon created successfully", data);
    dispatch({ type: CREATE_SALON_SUCCESS, payload: data });
  } catch (error) {
    console.log("error creating salon", error);
    dispatch({ type: CREATE_SALON_FAILURE, payload: error.message });
  }
};

// 🚀 FUNCIÓN AUXILIAR PARA ACTUALIZAR ROL EN REDUX
const updateUserRoleInRedux = async (dispatch, getState, jwt) => {
  try {
    console.log("🔄 Actualizando rol del usuario en Redux...");
    
    const { data: updatedUser } = await api.get("/api/users/profile", {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    
    console.log("✅ Usuario actualizado:", updatedUser);
    
    dispatch({
      type: SET_COGNITO_USER,
      payload: {
        user: updatedUser,
        jwt: jwt
      }
    });
    
    const currentAuthData = JSON.parse(localStorage.getItem('authData') || '{}');
    if (currentAuthData.user) {
      currentAuthData.user.role = updatedUser.role;
      localStorage.setItem('authData', JSON.stringify(currentAuthData));
    }
    
  } catch (error) {
    console.error("⚠️ Error actualizando rol del usuario:", error);
  }
};