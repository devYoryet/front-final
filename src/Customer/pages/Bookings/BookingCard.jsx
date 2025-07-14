import React from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Button, Chip } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateBookingStatus } from "../../../Redux/Booking/action";

const BookingCard = ({ booking }) => {
  const dispatch = useDispatch();

  // Función para formatear precio en pesos chilenos
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price).replace('CLP', '$');
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Función para formatear hora
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

  const handleCancelBooking = () => {
    dispatch(
      updateBookingStatus({
        bookingId: booking.id,
        status: "CANCELLED",
        jwt: localStorage.getItem("jwt"),
      })
    );
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'CONFIRMED': return 'Confirmada';
      case 'PENDING': return 'Pendiente';
      case 'CANCELLED': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{booking.salon.name}</h2>
            <p className="text-sm text-gray-500">Reserva #{booking.id}</p>
          </div>
          <Chip 
            label={getStatusText(booking.status)}
            color={getStatusColor(booking.status)}
            size="small"
            variant="filled"
          />
        </div>

        {/* Servicios */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Servicios</h3>
          <ul className="space-y-1">
            {booking.services.map((service) => (
              <li key={service.id} className="text-sm text-gray-600 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {service.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Fecha y Hora */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center text-sm text-gray-700">
            <ArrowRightAltIcon className="mr-2" fontSize="small" />
            <div>
              <p className="font-semibold">{formatDate(booking.startTime?.split("T")[0])}</p>
              <p className="text-gray-600">
                {formatTime(booking.startTime?.split("T")[1])} - {formatTime(booking.endTime?.split("T")[1])}
              </p>
            </div>
          </div>
        </div>

        {/* Footer con imagen, precio y botón */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              className="h-16 w-16 rounded-lg object-cover" 
              src={booking.salon.images[0]} 
              alt={booking.salon.name}
            />
            <div>
              <p className="text-lg font-bold text-green-600">
                {formatPrice(booking.totalPrice)}
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleCancelBooking}
            color="error"
            variant={booking.status === "CANCELLED" ? "contained" : "outlined"}
            disabled={booking.status === "CANCELLED"}
            size="small"
          >
            {booking.status === "CANCELLED" ? "Cancelada" : "Cancelar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;