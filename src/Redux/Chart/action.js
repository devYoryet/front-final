// src/Redux/Chart/action.js
import {
  FETCH_EARNINGS_REQUEST,
  FETCH_EARNINGS_SUCCESS,
  FETCH_EARNINGS_FAILURE,
  FETCH_BOOKINGS_REQUEST,
  FETCH_BOOKINGS_SUCCESS,
  FETCH_BOOKINGS_FAILURE,
} from "./actionTypes";
import api from "../../config/api";

const API_BASE_URL = "/api/bookings/chart";

export const fetchEarnings = (token) => async (dispatch) => {
  dispatch({ type: FETCH_EARNINGS_REQUEST });
  
  try {
    // Validación de token
    if (!token) {
      throw new Error("Token de autenticación requerido");
    }

    console.log("🔄 Obteniendo datos de earnings...");
    
    const response = await api.get(`${API_BASE_URL}/earnings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Earnings response:", response.data);

    // Validar que la respuesta sea un array
    const data = Array.isArray(response.data) ? response.data : [];
    
    dispatch({ 
      type: FETCH_EARNINGS_SUCCESS, 
      payload: data 
    });

  } catch (error) {
    console.error("❌ Error fetching earnings:", error);
    
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        "Error al obtener datos de ingresos";
    
    dispatch({
      type: FETCH_EARNINGS_FAILURE,
      payload: errorMessage,
    });
  }
};

export const fetchBookings = (token) => async (dispatch) => {
  dispatch({ type: FETCH_BOOKINGS_REQUEST });
  
  try {
    // Validación de token
    if (!token) {
      throw new Error("Token de autenticación requerido");
    }

    console.log("🔄 Obteniendo datos de bookings...");
    
    const response = await api.get(`${API_BASE_URL}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Bookings response:", response.data);

    // Validar que la respuesta sea un array
    const data = Array.isArray(response.data) ? response.data : [];
    
    dispatch({ 
      type: FETCH_BOOKINGS_SUCCESS, 
      payload: data 
    });

  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        "Error al obtener datos de reservas";
    
    dispatch({
      type: FETCH_BOOKINGS_FAILURE,
      payload: errorMessage,
    });
  }
};

// Acción para limpiar datos de gráficos (opcional)
export const clearChartData = () => ({
  type: 'CLEAR_CHART_DATA'
});

// Acción para refrescar ambos gráficos
export const refreshChartData = (token) => async (dispatch) => {
  await Promise.all([
    dispatch(fetchEarnings(token)),
    dispatch(fetchBookings(token))
  ]);
};