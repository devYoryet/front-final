// =============================================================================
// FRONTEND - SalonServiceDetails MEJORADO 🇨🇱
// src/Customer/pages/Salon/SalonDetails/SalonServiceDetails.jsx
// =============================================================================
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBooking,
  fetchBookedSlots,
  fetchCustomerBookings,
} from "../../../../Redux/Booking/action";
import { useParams } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import ServiceCard from "./ServiceCard";
import { Alert, Button, Divider, Modal, Snackbar, Chip } from "@mui/material";
import { isServiceSelected } from "../../../../util/isServiceSelected";
import {
  ArrowRight,
  RemoveShoppingCart,
  ShoppingCart,
  AccessTime,
  LocationOn,
  Phone,
  Email,
} from "@mui/icons-material";
import SelectedServiceList from "./SelectedServiceList";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fetchServicesBySalonId } from "../../../../Redux/Salon Services/action";
import { getTodayDate } from "../../../../util/getTodayDate";
import ErrorToast, { useErrorToast } from '../../../../components/ErrorToast';

const SalonServiceDetails = () => {
   const { error, showError, showErrorMessage, hideError } = useErrorToast();
  const { salon, service, category, booking } = useSelector((store) => store);
  const handleCloseSnackbar = () => setSnackbarOpen(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const dispatch = useDispatch();
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookingData, setBookingData] = useState({
    services: [],
    time: null,
  });
  const [open, setOpen] = React.useState(false);
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  // 🇨🇱 FUNCIÓN PARA FORMATEAR PRECIO EN PESOS CHILENOS
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price).replace('CLP', '$');
  };

  // 🇨🇱 FUNCIÓN PARA FORMATEAR TIEMPO
  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString('es-CL', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch {
      return timeString;
    }
  };

  const handleSelectService = (service) => {
    setBookingData((prev) => ({
      ...prev,
      services: [...prev.services, service],
    }));
  };

  const handleRemoveService = (id) => {
    setBookingData((prev) => ({
      ...prev,
      services: prev.services.filter((service) => service.id !== id),
    }));
  };

  const handleSelectCategory = (id) => () => {
    setSelectedCategory(id);
  };

  const handleBooking = () => {
    const serviceIds = bookingData.services.map((service) => service.id);

    dispatch(
      createBooking({
        bookingData: { serviceIds, startTime: bookingData.time },
        salonId: id,
        jwt: localStorage.getItem("jwt"),
        paymentMethod: "CHILE_PAY"

      })
    );
    console.log("booking data ", bookingData);
  };
// ✅ Escuchar errores del reducer
  useEffect(() => {
    if (booking.error?.showToast) {
      showErrorMessage(booking.error.message);
    }
  }, [booking.error]);
  useEffect(() => {
    dispatch(
      fetchBookedSlots({
        salonId: id,
        date: bookingData.time?.split("T")[0] || getTodayDate(),
        jwt: localStorage.getItem("jwt"),
      })
    );
  }, [id, bookingData.time]);

  useEffect(() => {
    dispatch(
      fetchServicesBySalonId({
        salonId: id,
        jwt: localStorage.getItem("jwt"),
        categoryId: selectedCategory,
      })
    );
  }, [id, selectedCategory]);

  // 🇨🇱 CALCULAR PRECIO TOTAL
  const getTotalPrice = () => {
    return bookingData.services.reduce((total, service) => total + service.price, 0);
  };

  const getTotalDuration = () => {
    return bookingData.services.reduce((total, service) => total + (service.duration || 30), 0);
  };

  return (
    <div className="p-5 space-y-5">
      {/* 🇨🇱 HEADER DEL SALÓN MEJORADO */}
      {salon.salon && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">{salon.salon.name}</h1>
              <div className="space-y-2">
                <div className="flex items-center">
                  <LocationOn className="mr-2" fontSize="small" />
                  <span>{salon.salon.address}, {salon.salon.city}</span>
                </div>
                <div className="flex items-center">
                  <AccessTime className="mr-2" fontSize="small" />
                  <span>
                    {formatTime(salon.salon.openTime)} - {formatTime(salon.salon.closeTime)}
                  </span>
                </div>
                {salon.salon.phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="mr-2" fontSize="small" />
                    <span>{salon.salon.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Email className="mr-2" fontSize="small" />
                  <span>{salon.salon.email}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Chip 
                label={salon.salon.isActive ? "Abierto" : "Cerrado"} 
                color={salon.salon.isActive ? "success" : "error"}
                className="mb-2"
              />
              {salon.salon.homeService && (
                <div>
                  <Chip label="🏠 Servicio a domicilio" color="info" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    {/* 🇨🇱 CATEGORÍAS - CON MANEJO SEGURO */}
<div className="space-y-5">
  <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-4">
      📂 Categorías de Servicios
    </h1>
    <div className="flex flex-wrap gap-3">
      {/* 🚀 VALIDACIÓN SEGURA DE CATEGORÍAS */}
      {category.categories && Array.isArray(category.categories) ? (
        category.categories.map((item) => (
          item && item.id ? (
            <CategoryCard
              key={item.id}
              category={item}
              isSelected={selectedCategory === item.id}
              handleSelectCategory={handleSelectCategory}
            />
          ) : null
        ))
      ) : (
        <div className="w-full text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📂</div>
          <p>Cargando categorías...</p>
        </div>
      )}
      
      {/* 🚀 MOSTRAR MENSAJE SI NO HAY CATEGORÍAS */}
      {category.categories && Array.isArray(category.categories) && category.categories.length === 0 && (
        <div className="w-full text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p>No hay categorías disponibles</p>
        </div>
      )}
    </div>
  </div>

     {/* 🇨🇱 SERVICIOS - CON MANEJO SEGURO */}
  <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-4">
      ✨ Servicios Disponibles
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 🚀 VALIDACIÓN SEGURA DE SERVICIOS */}
      {service.services && Array.isArray(service.services) ? (
        service.services.map((item) => (
          item && item.id ? (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {item.name || "Servicio sin nombre"}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {item.description || "Sin descripción"}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-purple-600">
                  {formatPrice(item.price || 0)}
                </span>
                <div className="flex items-center text-gray-500">
                  <AccessTime fontSize="small" className="mr-1" />
                  <span className="text-sm">{item.duration || 30} min</span>
                </div>
              </div>

              <Button
                onClick={() => 
                  isServiceSelected(bookingData.services, item.id)
                    ? handleRemoveService(item.id)
                    : handleSelectService(item)
                }
                variant={isServiceSelected(bookingData.services, item.id) ? "contained" : "outlined"}
                color={isServiceSelected(bookingData.services, item.id) ? "error" : "primary"}
                fullWidth
                startIcon={
                  isServiceSelected(bookingData.services, item.id) 
                    ? <RemoveShoppingCart /> 
                    : <ShoppingCart />
                }
              >
                {isServiceSelected(bookingData.services, item.id) ? "Quitar" : "Agregar"}
              </Button>
            </div>
          ) : null
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">⚙️</div>
          <p>Cargando servicios...</p>
        </div>
      )}
  {/* 🚀 MOSTRAR MENSAJE SI NO HAY SERVICIOS */}
      {service.services && Array.isArray(service.services) && service.services.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p>No hay servicios disponibles</p>
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="mt-2 text-purple-600 hover:underline"
            >
              Ver todos los servicios
            </button>
          )}
        </div>
      )}
    </div>
  </div>
</div>
      {/* 🇨🇱 CARRITO FLOTANTE */}
      {bookingData.services.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl p-4 border-2 border-purple-500 max-w-sm">
          <div className="text-center mb-3">
            <h3 className="font-bold text-lg text-gray-800">🛒 Tu Reserva</h3>
            <p className="text-sm text-gray-600">
              {bookingData.services.length} servicio{bookingData.services.length !== 1 ? 's' : ''} • {getTotalDuration()} min
            </p>
          </div>
          <div className="text-center mb-3">
            <span className="text-2xl font-bold text-purple-600">
              {formatPrice(getTotalPrice())}
            </span>
          </div>
          <Button
            onClick={handleOpenModal}
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            className="bg-purple-600 hover:bg-purple-700"
          >
            Reservar Ahora
          </Button>
        </div>
      )}

      {/* 🇨🇱 MODAL DE RESERVA MEJORADO */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] lg:w-[700px] bg-white shadow-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Horarios ocupados */}
            <div className="border-r pr-5">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                ⏰ Horarios No Disponibles
              </h2>
              {booking.slots?.length > 0 ? (
                <ul className="space-y-2">
                  {booking.slots.map((item, index) => (
                    <li key={index} className="flex items-center text-sm bg-red-50 p-2 rounded">
                      <ArrowRight className="text-red-500 mr-2" fontSize="small" />
                      <span>
                        {item.startTime?.split("T")[1]?.substring(0, 5)} - {item.endTime?.split("T")[1]?.substring(0, 5)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-green-600 font-semibold">
                    ¡Todos los horarios disponibles!
                  </p>
                </div>
              )}
            </div>

            {/* Formulario de reserva */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-800">
                📅 Confirmar Reserva
              </h2>
              
              <SelectedServiceList
                handleRemoveService={handleRemoveService}
                services={bookingData.services}
                formatPrice={formatPrice}
              />

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total a Pagar:</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Duración total: {getTotalDuration()} minutos
                </div>
              </div>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Selecciona fecha y hora"
                  sx={{ width: "100%" }}
                  onChange={(value) => {
                    if (value) {
                      const localDate = value.format("YYYY-MM-DDTHH:mm:ss");
                      setBookingData((prev) => ({ ...prev, time: localDate }));
                    }
                  }}
                  slotProps={{
                    textField: {
                      helperText: "Selecciona tu horario preferido"
                    }
                  }}
                />
              </LocalizationProvider>

              <Button
                onClick={handleBooking}
                variant="contained"
                fullWidth
                size="large"
                disabled={!bookingData.time || bookingData.services.length === 0}
                className="bg-purple-600 hover:bg-purple-700 py-3"
              >
                💳 Proceder al Pago
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={booking.error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {booking.error || "¡Operación exitosa!"}
        </Alert>

        
      </Snackbar>
       {/* ✅ ErrorToast fuera del Snackbar */}
      <ErrorToast 
        message={error} 
        show={showError} 
        onClose={hideError} 
      />
    </div>
  );
};

export default SalonServiceDetails;