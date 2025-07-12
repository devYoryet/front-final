import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../../../../Redux/Chart/action";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Backdrop, CircularProgress, Alert, Box } from "@mui/material";

const BookingCharts = ({ chartType = "daily" }) => {
  const dispatch = useDispatch();
  const { chart } = useSelector((store) => store);

  useEffect(() => {
    dispatch(fetchBookings(localStorage.getItem("jwt")));
  }, [dispatch]);

  // Validación de estado de carga
  if (chart.bookings?.loading) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  // Validación de datos
  const bookingData = chart.bookings?.data;
  console.log("📊 Booking Chart - Datos recibidos:", bookingData);

  if (!bookingData || !Array.isArray(bookingData) || bookingData.length === 0) {
    return (
      <Box className="h-[40vh] w-full flex items-center justify-center">
        <Alert severity="info" variant="outlined">
          📊 No hay datos de reservas disponibles
        </Alert>
      </Box>
    );
  }

  // Formateo de datos para el gráfico
  const formatData = (data) => {
    return data.map(item => ({
      ...item,
      daily: item.daily || item.date, // Asegurar que existe la clave 'daily'
      count: item.count || 0
    }));
  };

  const formattedData = formatData(bookingData);

  // Configuración de Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{`Fecha: ${label}`}</p>
          <p className="text-blue-600 font-semibold">
            {`Reservas: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[40vh] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="daily" 
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => {
              // Formatear fecha para mostrar solo día/mes
              if (value) {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }
              return value;
            }}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            allowDecimals={false} // Solo números enteros para conteo
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#067c06" 
            strokeWidth={3}
            dot={{ fill: "#067c06", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: "#067c06", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingCharts;