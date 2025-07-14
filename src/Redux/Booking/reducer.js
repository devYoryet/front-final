// src/Redux/Booking/reducer.js
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
  GET_SALON_REPORT_SUCCESS,
  FETCH_BOOKED_SLOTS_REQUEST,
  FETCH_BOOKED_SLOTS_SUCCESS,
  FETCH_BOOKED_SLOTS_FAILURE,
} from "./actionTypes";

const initialState = {
  bookings: [],
  slots: [],
  booking: null,
  loading: false,
  error: null,
  report: null,
  totalBookings: 0, // ✅ AGREGAR CONTADOR
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_BOOKING_REQUEST:
    case FETCH_CUSTOMER_BOOKINGS_REQUEST:
    case FETCH_SALON_BOOKINGS_REQUEST:
    case FETCH_BOOKING_BY_ID_REQUEST:
    case UPDATE_BOOKING_STATUS_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_BOOKING_SUCCESS:
      return { ...state, loading: false, booking: action.payload };

    // 🚀 CORRECCIÓN CRÍTICA: Manejar estructura del backend
    case FETCH_CUSTOMER_BOOKINGS_SUCCESS:
    case FETCH_SALON_BOOKINGS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        // ✅ EXTRAER EL ARRAY DE BOOKINGS DE LA RESPUESTA ESTRUCTURADA
        bookings: action.payload.bookings || action.payload || [],
        totalBookings: action.payload.totalBookings || (action.payload.bookings ? action.payload.bookings.length : 0)
      };

    case FETCH_BOOKING_BY_ID_SUCCESS:
      return { ...state, loading: false, booking: action.payload };

    case UPDATE_BOOKING_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        bookings: state.bookings.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case GET_SALON_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        report: action.payload,
      };

    case FETCH_BOOKED_SLOTS_SUCCESS:
      return {
        ...state,
        loading: false,
        slots: action.payload,
        error: null,
      };

    case CREATE_BOOKING_FAILURE:
    return {
      ...state,
      isLoading: false,
      error: action.payload,  // ✅ Incluye el flag showToast
    };
    case FETCH_CUSTOMER_BOOKINGS_FAILURE:
    case FETCH_SALON_BOOKINGS_FAILURE:
    case FETCH_BOOKING_BY_ID_FAILURE:
    case UPDATE_BOOKING_STATUS_FAILURE:
      return { 
        ...state, 
        loading: false, 
        error: action.payload,
        bookings: [], // ✅ ASEGURAR ARRAY VACÍO EN ERROR
      };

    default:
      return state;
  }
};

export default bookingReducer;