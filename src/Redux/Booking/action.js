// =============================================================================
// BOOKING ACTION CORREGIDO - src/Redux/Booking/action.js
// =============================================================================

import axios from "axios";
import {
  CREATE_BOOKING_REQUEST,
  CREATE_BOOKING_SUCCESS,
  CREATE_BOOKING_FAILURE,
  FETCH_CUSTOMER_BOOKINGS_REQUEST,
  FETCH_CUSTOMER_BOOKINGS_SUCCESS,
  FETCH_CUSTOMER_BOOKINGS_FAILURE,
  FETCH_SALON_BOOKINGS_REQUEST,
  FETCH_SALON_BOOKINGS_SUCCESS,
  FETCH_SALON_BOOKINGS_FAILURE,
  FETCH_BOOKING_BY_ID_REQUEST,
  FETCH_BOOKING_BY_ID_SUCCESS,
  FETCH_BOOKING_BY_ID_FAILURE,
  UPDATE_BOOKING_STATUS_REQUEST,
  UPDATE_BOOKING_STATUS_SUCCESS,
  UPDATE_BOOKING_STATUS_FAILURE,
  GET_SALON_REPORT_REQUEST,
  GET_SALON_REPORT_SUCCESS,
  GET_SALON_REPORT_FAILURE,
  FETCH_BOOKED_SLOTS_REQUEST,
  FETCH_BOOKED_SLOTS_SUCCESS,
  FETCH_BOOKED_SLOTS_FAILURE,
} from "./actionTypes";
import api from "../../config/api";

const API_BASE_URL = "/api/bookings";

// 🇨🇱 MÉTODO CORREGIDO PARA CHILE PAY
export const createBooking = ({jwt, salonId, bookingData, paymentMethod = "CHILE_PAY"}) => async (dispatch) => {
  dispatch({ type: CREATE_BOOKING_REQUEST });
  
  try {
    console.log("🇨🇱 CREAR BOOKING CON PAGO CHILENO");
    console.log("   Salon ID:", salonId);
    console.log("   Payment Method:", paymentMethod);
    console.log("   Booking Data:", bookingData);

    const { data } = await api.post(
      API_BASE_URL,
      bookingData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { 
          salonId, 
          paymentMethod: paymentMethod  // ✅ USAR CHILE_PAY
        },
      }
    );
    
    // 🇨🇱 REDIRIGIR A PÁGINA DE PAGO CHILENO
    console.log("✅ Booking creado, redirigiendo a pago:", data.payment_link_url);
    window.location.href = data.payment_link_url;
    
    console.log("📋 create booking response:", data);
    dispatch({ type: CREATE_BOOKING_SUCCESS, payload: data });
    
  } catch (error) {
    console.log("❌ Error creating booking:", error);
    
    // Extraer mensaje del error
    const errorMessage = error.response?.data?.message || "Error al crear la reserva";
    
    dispatch({ 
      type: CREATE_BOOKING_FAILURE, 
      payload: {
        message: errorMessage,
        showToast: true  // ✅ Flag para mostrar toast
      }
    });
  }
};
// 🇨🇱 NUEVA FUNCIÓN: CREAR BOOKING CON MÉTODO ESPECÍFICO
export const createBookingWithPaymentMethod = ({jwt, salonId, bookingData, paymentMethod}) => async (dispatch) => {
  dispatch({ type: CREATE_BOOKING_REQUEST });
  
  try {
    console.log("🇨🇱 CREAR BOOKING CON MÉTODO ESPECÍFICO");
    console.log("   Salon ID:", salonId);
    console.log("   Payment Method:", paymentMethod);
    console.log("   Booking Data:", bookingData);

    // Validar método de pago
    const validMethods = ["CHILE_PAY", "RAZORPAY", "STRIPE"];
    const finalPaymentMethod = validMethods.includes(paymentMethod) ? paymentMethod : "CHILE_PAY";
    
    console.log("   Método final:", finalPaymentMethod);

    const { data } = await api.post(
      API_BASE_URL,
      bookingData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { 
          salonId, 
          paymentMethod: finalPaymentMethod
        },
      }
    );
    
    // Redirigir a la URL de pago
    if (data.payment_link_url) {
      console.log("✅ Redirigiendo a:", data.payment_link_url);
      window.location.href = data.payment_link_url;
    }
    
    dispatch({ type: CREATE_BOOKING_SUCCESS, payload: data });
    
  } catch (error) {
    console.log("❌ error creating booking with payment method:", error);
    console.log("❌ error response:", error.response?.data);
    dispatch({ type: CREATE_BOOKING_FAILURE, payload: error.response?.data?.message || error.message });
  }
};

// Resto de funciones sin cambios...
export const fetchCustomerBookings = (jwt) => async (dispatch) => {
  dispatch({ type: FETCH_CUSTOMER_BOOKINGS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/customer`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("customer bookings ", data);
    dispatch({ type: FETCH_CUSTOMER_BOOKINGS_SUCCESS, payload: data });
  } catch (error) {
    console.log("error ", error);
    dispatch({ type: FETCH_CUSTOMER_BOOKINGS_FAILURE, payload: error.message });
  }
};

export const fetchSalonBookings = ({jwt}) => async (dispatch) => {
  dispatch({ type: FETCH_SALON_BOOKINGS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/salon`,{
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("salon bookings ", data);
    dispatch({ type: FETCH_SALON_BOOKINGS_SUCCESS, payload: data });
  } catch (error) {
    console.log("error fetching salon bookings ", error);
    dispatch({ type: FETCH_SALON_BOOKINGS_FAILURE, payload: error.message });
  }
};

export const fetchBookingById = (bookingId) => async (dispatch) => {
  dispatch({ type: FETCH_BOOKING_BY_ID_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/${bookingId}`);
    dispatch({ type: FETCH_BOOKING_BY_ID_SUCCESS, payload: data });
    console.log("booking by id ", data);
  } catch (error) {
    dispatch({
      type: FETCH_BOOKING_BY_ID_FAILURE,
      payload: error,
    });
  }
};

export const updateBookingStatus = ({bookingId, status, jwt}) => async (dispatch) => {
  dispatch({ type: UPDATE_BOOKING_STATUS_REQUEST });
  try {
    const { data } = await api.patch(`${API_BASE_URL}/${bookingId}/status`, 
      { status },
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    dispatch({ type: UPDATE_BOOKING_STATUS_SUCCESS, payload: data });
    console.log("booking status updated ", data);
  } catch (error) {
    console.log("error updating booking status ", error);
    dispatch({ type: UPDATE_BOOKING_STATUS_FAILURE, payload: error.message });
  }
};

export const getSalonReport = ({jwt}) => async (dispatch) => {
  dispatch({ type: GET_SALON_REPORT_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/chart`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("salon report ", data);
    dispatch({ type: GET_SALON_REPORT_SUCCESS, payload: data });
  } catch (error) {
    console.log("error fetching salon report ", error);
    dispatch({ type: GET_SALON_REPORT_FAILURE, payload: error.message });
  }
};

export const fetchBookedSlots = ({salonId, date, jwt}) => async (dispatch) => {
  dispatch({ type: FETCH_BOOKED_SLOTS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/slots/salon/${salonId}/date/${date}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("fetch booked slots: ", data);
    dispatch({ type: FETCH_BOOKED_SLOTS_SUCCESS, payload: data });
  } catch (error) {
    console.log("error fetching booked slots ", error);
    dispatch({ type: FETCH_BOOKED_SLOTS_FAILURE, payload: error.message });
  }
};