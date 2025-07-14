// src/Customer/pages/Bookings/Bookings.jsx
import React, { useEffect } from "react";
import BookingCard from "./BookingCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerBookings } from "../../../Redux/Booking/action";

const Bookings = () => {
  const dispatch = useDispatch();
  const { booking } = useSelector((store) => store);

  useEffect(() => {
    dispatch(fetchCustomerBookings(localStorage.getItem("jwt")));
  }, []);

  // 🚀 EXTRACCIÓN SEGURA DE BOOKINGS
  const getBookingsArray = () => {
    // Si booking.bookings es un array, usarlo
    if (Array.isArray(booking.bookings)) {
      return booking.bookings;
    }
    
    // Si booking.bookings es un objeto con propiedad 'bookings', extraerla
    if (booking.bookings && booking.bookings.bookings && Array.isArray(booking.bookings.bookings)) {
      return booking.bookings.bookings;
    }
    
    // Si no hay bookings, retornar array vacío
    return [];
  };

  const bookingsArray = getBookingsArray();

  return (
    <div className="px-5 md:flex flex-col items-center mt-10 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold py-5">My Bookings</h1>
      </div>
      
      {/* 🚀 MOSTRAR INFORMACIÓN DE DEBUG */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 p-4 rounded mb-4 text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Loading: {booking.loading ? 'true' : 'false'}</p>
          <p>Bookings Type: {typeof booking.bookings}</p>
          <p>Bookings Array Length: {bookingsArray.length}</p>
          {booking.error && <p className="text-red-500">Error: {booking.error}</p>}
        </div>
      )}

      <div className="space-y-4 md:w-[35rem]">
        {booking.loading ? (
          <div className="text-center py-8">
            <p>Cargando reservas...</p>
          </div>
        ) : bookingsArray.length === 0 ? (
          <div className="text-center py-8">
            <p>No tienes reservas aún.</p>
          </div>
        ) : (
          bookingsArray.map((item, index) => (
            <BookingCard key={item.id || index} booking={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings;