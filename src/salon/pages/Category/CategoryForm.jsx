import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Grid2,
} from "@mui/material";
import "tailwindcss/tailwind.css";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../../../Redux/Category/action";

const CategoryForm = ({ onCategoryCreated }) => {
  const [uploadImage, setUploadingImage] = useState(false);
  const [snackbarOpen, setOpenSnackbar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🚀 NUEVO
  const dispatch = useDispatch();
  const { category } = useSelector((store) => store);
  
  // 🚀 REFERENCIA PARA CONTAR CATEGORÍAS INICIALES
  const initialCategoryCount = useRef(null);

  // 🚀 ESTABLECER CONTEO INICIAL AL MONTAR COMPONENTE
  useEffect(() => {
    if (initialCategoryCount.current === null) {
      initialCategoryCount.current = category.categories?.length || 0;
    }
  }, [category.categories]);

  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
    },
    onSubmit: (values) => {
      console.log("Enviando categoría:", values);
      setIsSubmitting(true); // 🚀 MARCAR QUE ESTAMOS CREANDO
      dispatch(createCategory({
        category: values,
        jwt: localStorage.getItem("jwt")
      }));
    },
  });

  // 🚀 EFECTO MEJORADO: SOLO CUANDO SE CREA UNA NUEVA CATEGORÍA
  useEffect(() => {
    const currentCount = category.categories?.length || 0;
    
    // Solo ejecutar si:
    // 1. Estábamos enviando una categoría
    // 2. No está cargando
    // 3. El conteo aumentó respecto al inicial
    if (isSubmitting && !category.loading && currentCount > initialCategoryCount.current) {
      console.log("✅ Nueva categoría creada detectada");
      
      // Resetear formulario
      formik.resetForm();
      setIsSubmitting(false);
      
      // Mostrar mensaje de éxito
      setOpenSnackbar(true);
      
      // Cambiar al tab "All Categories" después de 2 segundos
      setTimeout(() => {
        if (onCategoryCreated) {
          onCategoryCreated();
        }
      }, 2000);
      
      // Actualizar conteo de referencia
      initialCategoryCount.current = currentCount;
    }
    
    // Si hay error, también resetear el estado de envío
    if (category.error && isSubmitting) {
      setIsSubmitting(false);
    }
    
  }, [category.categories, category.loading, category.error, isSubmitting, onCategoryCreated]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    console.log("uploaded images : ", image);
    formik.setFieldValue("image", image);
    setUploadingImage(false);
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("image", "");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 p-4 w-full lg:w-1/2"
      >
        <Grid2 container spacing={2}>
          <Grid2 className="w-24 h-24" size={{ xs: 12 }}>
            {formik.values.image ? (
              <div className="relative">
                <img
                  className="w-full h-full object-cover"
                  src={formik.values.image}
                  alt=""
                />
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    outline: "none",
                  }}
                  onClick={handleRemoveImage}
                >
                  <CloseIcon sx={{ fontSize: "1rem" }} />
                </IconButton>
              </div>
            ) : (
              <label className="relative w-24 h-24 cursor-pointer flex items-center justify-center border border-gray-600 border-dashed rounded-md">
                <span className="text-gray-600 text-center">
                  {uploadImage ? (
                    <CircularProgress />
                  ) : (
                    <AddPhotoAlternateIcon className="text-gray-700" />
                  )}
                </span>
                <input
                  type="file"
                  name="file"
                  className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TextField
              name="name"
              label="Category Name"
              variant="outlined"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              disabled={isSubmitting || category.loading} // 🚀 DESHABILITAR MIENTRAS ENVÍA
            >
              {isSubmitting || category.loading ? "Creando..." : "Create Category"}
            </Button>
          </Grid2>
        </Grid2>
      </form>

      {/* 🚀 SNACKBAR PARA MOSTRAR ÉXITO */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          ¡Categoría creada exitosamente! Cambiando a vista de categorías...
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CategoryForm;