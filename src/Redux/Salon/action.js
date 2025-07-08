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
import api from "../../config/api";

const API_BASE_URL = "/api/salons";

export const createSalon = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_SALON_REQUEST });
  try {
    const response = await api.post(`/auth/signup`, reqData.ownerDetails);

    console.log("response ", response.data);

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

export const updateSalon = (salonId, salon) => async (dispatch) => {
  dispatch({ type: UPDATE_SALON_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/${salonId}`, salon,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      }
    });
    dispatch({ type: UPDATE_SALON_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_SALON_FAILURE, payload: error.message });
  }
};

export const fetchSalons = () => async (dispatch) => {
  dispatch({ type: FETCH_SALONS_REQUEST });
  try {
    const { data } = await api.get(API_BASE_URL,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      }
    });
    console.log("all salons ",data)
    dispatch({ type: FETCH_SALONS_SUCCESS, payload: data });
  } catch (error) {
    console.log("error fetching salons", error);
    dispatch({ type: FETCH_SALONS_FAILURE, payload: error.message });
  }
};

export const fetchSalonById = (salonId) => async (dispatch) => {
  dispatch({ type: FETCH_SALON_BY_ID_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/${salonId}`,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      }
    });
    dispatch({ type: FETCH_SALON_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_SALON_BY_ID_FAILURE, payload: error.message });
  }
};

export const fetchSalonByOwner = (jwt) => async (dispatch) => {
  dispatch({ type: FETCH_SALON_BY_OWNER_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/owner`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("salon by owner - ", data);
    dispatch({ type: FETCH_SALON_BY_OWNER_SUCCESS, payload: data });
  } catch (error) {
    console.log("error fetching salon by owner - ", error);
    dispatch({ type: FETCH_SALON_BY_OWNER_FAILURE, payload: error.message });
  }
};

export const searchSalon = ({jwt,city}) => async (dispatch) => {
  dispatch({ type: SEARCH_SALONS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/search`, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { city: city },
    });
    console.log("Search salon - ", data);
    dispatch({ type: SEARCH_SALONS_SUCCESS, payload: data });
  } catch (error) {
    console.log("error fetching salon by owner - ", error);
    dispatch({ type: SEARCH_SALONS_FAILURE, payload: error.message });
  }
};
// Agregar a src/Redux/Salon/action.js
// Reemplazar la función createSalonOnly en src/Redux/Salon/action.js

// Actualizar createSalonOnly en src/Redux/Salon/action.js
export const createSalonOnly = (reqData) => async (dispatch, getState) => {
  dispatch({ type: CREATE_SALON_REQUEST });
  
  try {
    // ⭐ Intentar obtener JWT de múltiples fuentes
    const state = getState();
    let jwt = localStorage.getItem("jwt") || 
              state.auth?.jwt || 
              reqData.jwt; // Permitir pasar JWT directamente
    
    console.log("=== CREATE SALON ONLY ===");
    console.log("Datos recibidos:", reqData.salonDetails);
    console.log("JWT desde localStorage:", localStorage.getItem("jwt") ? "SÍ" : "NO");
    console.log("JWT desde Redux:", state.auth?.jwt ? "SÍ" : "NO");
    console.log("JWT desde reqData:", reqData.jwt ? "SÍ" : "NO");
    console.log("JWT final seleccionado:", jwt ? "SÍ" : "NO");
    
    if (!jwt) {
      throw new Error("No JWT token available from any source");
    }
    
    // Verificar estructura de datos
    const requiredFields = ['name', 'address', 'city', 'email'];
    const missingFields = requiredFields.filter(field => !reqData.salonDetails[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    console.log("Enviando POST a:", `${API_BASE_URL}`);
    console.log("Headers:", { Authorization: `Bearer ${jwt.substring(0, 50)}...` });
    console.log("Body:", reqData.salonDetails);
    
    const { data } = await api.post(API_BASE_URL, reqData.salonDetails, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    console.log("Salón creado exitosamente:", data);
    dispatch({ type: CREATE_SALON_SUCCESS, payload: data });
    
    // Redirigir después del éxito
    reqData.navigate("/salon-dashboard");

  } catch (error) {
    console.log("=== ERROR CREANDO SALÓN ===");
    console.log("Error completo:", error);
    console.log("Error response:", error.response?.data);
    console.log("Error status:", error.response?.status);
    console.log("Error message:", error.message);
    
    dispatch({ type: CREATE_SALON_FAILURE, payload: error.message });
  }
};