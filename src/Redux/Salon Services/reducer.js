import {
  CREATE_SERVICE_REQUEST,
  CREATE_SERVICE_SUCCESS,
  CREATE_SERVICE_FAILURE,
  UPDATE_SERVICE_REQUEST,
  UPDATE_SERVICE_SUCCESS,
  UPDATE_SERVICE_FAILURE,
  FETCH_SERVICES_BY_SALON_REQUEST,
  FETCH_SERVICES_BY_SALON_SUCCESS,
  FETCH_SERVICES_BY_SALON_FAILURE,
  FETCH_SERVICE_BY_ID_REQUEST,
  FETCH_SERVICE_BY_ID_SUCCESS,
  FETCH_SERVICE_BY_ID_FAILURE,
  DELETE_SERVICE_REQUEST,
  DELETE_SERVICE_SUCCESS,
  DELETE_SERVICE_FAILURE,
} from "./actionTypes";

const initialState = {
  services: [],
  service: null,
  loading: false,
  error: null,
  updated: false,
  deleted: false,
  created: false,
};

const serviceOfferingReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SERVICE_REQUEST:
    case UPDATE_SERVICE_REQUEST:
    case FETCH_SERVICES_BY_SALON_REQUEST:
    case FETCH_SERVICE_BY_ID_REQUEST:
    case DELETE_SERVICE_REQUEST:
      return { 
        ...state, 
        loading: true, 
        error: null, 
        updated: false, 
        deleted: false, 
        created: false 
      };

    case CREATE_SERVICE_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        service: action.payload,
        created: true,
        error: null
      };

    case UPDATE_SERVICE_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        service: action.payload,
        updated: true,
        error: null,
        services: state.services.map((service) =>
          service.id === action.payload.id ? action.payload : service
        )
      };

    case FETCH_SERVICES_BY_SALON_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        services: action.payload,
        error: null
      };

    case FETCH_SERVICE_BY_ID_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        service: action.payload,
        error: null
      };

    case DELETE_SERVICE_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        deleted: true,
        error: null,
        services: state.services.filter(service => service.id !== action.payload)
      };

    case CREATE_SERVICE_FAILURE:
    case UPDATE_SERVICE_FAILURE:
    case FETCH_SERVICES_BY_SALON_FAILURE:
    case FETCH_SERVICE_BY_ID_FAILURE:
    case DELETE_SERVICE_FAILURE:
      return { 
        ...state, 
        loading: false, 
        error: action.payload,
        updated: false,
        deleted: false,
        created: false
      };

    default:
      return state;
  }
};

export default serviceOfferingReducer;