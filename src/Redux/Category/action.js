// actions/categoryActions.js
import axios from "axios";
import {
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  GET_ALL_CATEGORIES_REQUEST,
  GET_ALL_CATEGORIES_SUCCESS,
  GET_ALL_CATEGORIES_FAILURE,
  GET_CATEGORIES_BY_SALON_REQUEST,
  GET_CATEGORIES_BY_SALON_SUCCESS,
  GET_CATEGORIES_BY_SALON_FAILURE,
  GET_CATEGORY_BY_ID_REQUEST,
  GET_CATEGORY_BY_ID_SUCCESS,
  GET_CATEGORY_BY_ID_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_FAILURE
} from "./actionTypes";
import api from "../../config/api";
import { getJwtToken } from "../../config/api"; // Función helper para obtener token

const BASE_URL = "/api/categories";
const getAuthToken = () => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }
  return token;
};
// Create Category
export const createCategory = ({ category, jwt }) => async (dispatch) => {
  dispatch({ type: CREATE_CATEGORY_REQUEST });
  try {
    // Usar el JWT pasado como parámetro o obtenerlo del localStorage
    const token = jwt || getAuthToken();
    
    console.log("🔍 Creando categoría con token:", token ? "✅ Token presente" : "❌ Sin token");
    
    const config = { 
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      } 
    };
    
    const response = await api.post(`${BASE_URL}/salon-owner`, category, config);
    console.log("✅ Categoría creada exitosamente", response.data);
    dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("❌ Error creando categoría:", error);
    console.error("❌ Error response:", error.response?.data);
    dispatch({
      type: CREATE_CATEGORY_FAILURE,
      payload: error.response?.data || error.message || "Error creating category",
    });
  }
};
export const fetchCategoriesBySalonOwner = (jwt) => async (dispatch) => {
  dispatch({ type: FETCH_CATEGORIES_REQUEST });

  try {
    const { data } = await api.get(`/api/service-offering/salon-owner/categories`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "X-Cognito-Sub": localStorage.getItem("cognito_sub") || "",
        "X-User-Email": localStorage.getItem("user_email") || "",
        "X-User-Username": localStorage.getItem("username") || "",
        "X-User-Role": localStorage.getItem("user_role") || "",
        "X-Auth-Source": localStorage.getItem("auth_source") || "cognito",
      },
    });

    dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: data });
    console.log("✅ Categorías cargadas:", data);
  } catch (error) {
    console.error("❌ Error cargando categorías:", error);
    dispatch({ type: FETCH_CATEGORIES_FAILURE, payload: error.message });
  }
};

// Get All Categories
export const getAllCategories = () => async (dispatch) => {
  dispatch({ type: GET_ALL_CATEGORIES_REQUEST });
  try {
    const response = await api.get(BASE_URL);
    dispatch({ type: GET_ALL_CATEGORIES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: GET_ALL_CATEGORIES_FAILURE,
      payload: error.response?.data || "Error fetching categories",
    });
  }
};

// Get Categories by Salon
export const getCategoriesBySalon = ({jwt,salonId}) => async (dispatch) => {
  dispatch({ type: GET_CATEGORIES_BY_SALON_REQUEST });
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    };
    const response = await api.get(`${BASE_URL}/salon/${salonId}`, config);
    dispatch({ type: GET_CATEGORIES_BY_SALON_SUCCESS, payload: response.data });
    console.log("response + ", response.data);
  } catch (error) {
    console.log("error getting salon categories", error);
    dispatch({
      type: GET_CATEGORIES_BY_SALON_FAILURE,
      payload: error.response?.data || "Error fetching salon categories",
    });
  }
};

// Get Category by ID
export const getCategoryById = (id) => async (dispatch) => {
  dispatch({ type: GET_CATEGORY_BY_ID_REQUEST });
  try {
    const response = await api.get(`${BASE_URL}/${id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    dispatch({ type: GET_CATEGORY_BY_ID_SUCCESS, payload: response.data });
    console.log("response get category by id ", response.data);
  } catch (error) {
    dispatch({
      type: GET_CATEGORY_BY_ID_FAILURE,
      payload: error.response?.data || "Error fetching category",
    });
  }
};

export const updateCategory = ({id, category}) => async (dispatch) => {
  dispatch({ type: UPDATE_CATEGORY_REQUEST });

  try {
    const token = localStorage.getItem("jwt"); 
    const response = await api.patch(
      `/api/categories/${id}`,
      category,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );

    dispatch({
      type: UPDATE_CATEGORY_SUCCESS,
      payload: response.data, 
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CATEGORY_FAILURE,
      payload: error.response?.data || "Failed to update category"
    });
  }
};

// Delete Category
export const deleteCategory = (id) => async (dispatch) => {
  dispatch({ type: DELETE_CATEGORY_REQUEST });
  try {
    await api.delete(`${BASE_URL}/${id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_CATEGORY_FAILURE,
      payload: error.response?.data || "Error deleting category",
    });
  }
};
