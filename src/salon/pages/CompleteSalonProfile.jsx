// src/salon/pages/CompleteSalonProfile.jsx - Versión simplificada
import { Alert, Button, Snackbar, TextField, Grid, Card, CardContent, Typography } from "@mui/material";
import React, { useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { createSalonOnly } from "../../Redux/Salon/action";

const CompleteSalonProfile = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cognitoAuth = useAuth();
  const { salon } = useSelector((store) => store);

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      city: "",
      phoneNumber: "",
      email: cognitoAuth.user?.profile?.email || "",
      openTime: "09:00",
      closeTime: "18:00",
    },
    onSubmit: (values) => {
      const salonDetails = {
        name: values.name,
        address: values.address,
        city: values.city,
        phone: values.phoneNumber,
        email: values.email,
        openTime: values.openTime + ":00", // Formato HH:mm:ss
        closeTime: values.closeTime + ":00",
        images: [
          "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=600",
          "https://images.pexels.com/photos/3331488/pexels-photo-3331488.jpeg?auto=compress&cs=tinysrgb&w=600",
          "https://images.pexels.com/photos/5069455/pexels-photo-5069455.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        ], // Imágenes por defecto
      };

      dispatch(createSalonOnly({ salonDetails, navigate }));
    },
  });

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  // Verificar que el usuario esté autenticado
  if (!cognitoAuth.isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
                Complete Your Salon Profile
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                Welcome {cognitoAuth.user?.profile?.name || cognitoAuth.user?.profile?.email}! 
                Let's set up your salon.
              </Typography>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Salon Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="address"
                    name="address"
                    label="Address"
                    multiline
                    rows={2}
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="city"
                    name="city"
                    label="City"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="openTime"
                    name="openTime"
                    label="Opening Time"
                    type="time"
                    value={formik.values.openTime}
                    onChange={formik.handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="closeTime"
                    name="closeTime"
                    label="Closing Time"
                    type="time"
                    value={formik.values.closeTime}
                    onChange={formik.handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Contact Email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    required
                    disabled // Email viene de Cognito
                  />
                </Grid>
              </Grid>

              <div className="flex gap-4 pt-6">
                <Button
                  onClick={() => navigate('/')}
                  variant="outlined"
                  size="large"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={salon.loading}
                  className="flex-1"
                >
                  {salon.loading ? "Creating Salon..." : "Complete Setup"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={salon.error ? "error" : "success"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {salon.error || "Salon profile completed successfully!"}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default CompleteSalonProfile;