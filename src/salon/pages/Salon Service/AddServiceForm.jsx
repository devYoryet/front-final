import React, { useEffect, useState } from "react";
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
  Grid,
} from "@mui/material";
import "tailwindcss/tailwind.css";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesBySalon, fetchCategoriesBySalonOwner } from "../../../Redux/Category/action";
import { createServiceAction } from "../../../Redux/Salon Services/action";

const ServiceForm = () => {
  const [uploadImage, setUploadingImage] = useState(false);
  const [snackbarOpen, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const { category, salon } = useSelector((store) => store);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      duration: "",
      image: "",
      category: "",
    },
    onSubmit: (values) => {
      dispatch(createServiceAction({ service: values, jwt: localStorage.getItem('jwt') }));
      setOpenSnackbar(true);
    },
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    formik.setFieldValue("image", image);
    setUploadingImage(false);
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("image", "");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(fetchCategoriesBySalonOwner(jwt));
    }
  }, [dispatch]);

  return (
    <div className="flex justify-center items-center bg-white p-6 rounded-2xl shadow-xl w-full lg:w-3/4">
      <form onSubmit={formik.handleSubmit} className="space-y-4 w-full">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3} className="flex justify-center items-center">
            {formik.values.image ? (
              <div className="relative border rounded-md overflow-hidden">
                <img className="w-24 h-24 object-cover" src={formik.values.image} alt="Service" />
                <IconButton
                  onClick={handleRemoveImage}
                  size="small"
                  color="error"
                  sx={{ position: "absolute", top: 0, right: 0 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <div className="w-24 h-24 border border-green-600 rounded-md flex items-center justify-center bg-green-50">
                    <AddPhotoAlternateIcon className="text-green-700" />
                  </div>
                  {uploadImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                      <CircularProgress size={24} />
                    </div>
                  )}
                </label>
              </>
            )}
          </Grid>

          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Nombre del servicio"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              multiline
              rows={3}
              fullWidth
              id="description"
              name="description"
              label="Descripción"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="price"
              name="price"
              label="Precio ($)"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="duration"
              name="duration"
              label="Duración (minutos)"
              type="number"
              value={formik.values.duration}
              onChange={formik.handleChange}
              error={formik.touched.duration && Boolean(formik.errors.duration)}
              helperText={formik.touched.duration && formik.errors.duration}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel id="category-label">Categoría</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formik.values.category}
                label="Categoría"
                onChange={formik.handleChange}
              >
                {category.categories.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="success" fullWidth sx={{ py: 1 }}>
              Agregar nuevo servicio
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: "100%" }}>
          Servicio creado exitosamente
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ServiceForm;
