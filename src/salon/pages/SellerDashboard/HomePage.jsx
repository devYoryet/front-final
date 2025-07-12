import React, { useEffect, useState } from "react";
import ReportCard from "./Report/ReportCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import CancelIcon from "@mui/icons-material/Cancel";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  FormControl,
  Grid2,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import EarningCharts from "./Chart/EarningCharts";
import BookingCharts from "./Chart/BookingChart";
import { useSelector, useDispatch } from "react-redux";
import { refreshChartData } from "../../../Redux/Chart/action";

// 📊 OPCIONES DE GRÁFICOS EN ESPAÑOL
const Chart = [
  { name: "Hoy", value: "today" },
  { name: "Últimos 7 días", value: "daily" },
  { name: "Últimos 12 meses", value: "monthly" },
];

const HomePage = () => {
  const [chartType, setChartType] = useState(Chart[1].value); // Por defecto "daily"
  const { booking, chart } = useSelector(store => store);
  const dispatch = useDispatch();

  useEffect(() => {
    // Refrescar datos al cargar el componente
    const token = localStorage.getItem("jwt");
    if (token) {
      dispatch(refreshChartData(token));
    }
  }, [dispatch]);

  const handleChange = (event) => {
    setChartType(event.target.value);
  };

  const handleRefresh = () => {
    const token = localStorage.getItem("jwt");
    if (token) {
      dispatch(refreshChartData(token));
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* 📱 ENCABEZADO */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            📊 Dashboard del Salón
          </h1>
          <p className="text-gray-600">Resumen de actividad y ganancias</p>
        </div>
        
        <Tooltip title="Actualizar datos">
          <IconButton 
            onClick={handleRefresh}
            color="primary"
            disabled={chart.earnings?.loading || chart.bookings?.loading}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </div>

      {/* 📊 TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportCard
          icon={<MonetizationOnIcon sx={{ color: "#019031" }} />}
          value={"$" + new Intl.NumberFormat('es-CL').format(booking.report?.totalEarnings || 0)}
          title={"💰 Ingresos Totales"}
          bgColor="bg-gradient-to-r from-green-50 to-green-100"
          iconBg="bg-green-500"
        />

        <ReportCard
          icon={<BookOnlineIcon sx={{ color: "#2196f3" }} />}
          value={booking.report?.totalBookings || "0"}
          title={"📅 Total de Reservas"}
          bgColor="bg-gradient-to-r from-blue-50 to-blue-100"
          iconBg="bg-blue-500"
        />

        <ReportCard
          icon={<TrendingUpIcon sx={{ color: "#ff9800" }} />}
          value={"$" + new Intl.NumberFormat('es-CL').format(booking.report?.totalRefund || 0)}
          title={"💸 Total Reembolsos"}
          bgColor="bg-gradient-to-r from-orange-50 to-orange-100"
          iconBg="bg-orange-500"
        />

        <ReportCard
          icon={<CancelIcon sx={{ color: "#f44336" }} />}
          value={booking.report?.cancelledBookings || "0"}
          title={"❌ Reservas Canceladas"}
          bgColor="bg-gradient-to-r from-red-50 to-red-100"
          iconBg="bg-red-500"
        />
      </div>

      {/* 📈 SECCIÓN DE GRÁFICOS */}
      <div className="lg:flex gap-6">
        {/* 📈 GRÁFICO DE INGRESOS */}
        <Card className="w-full lg:w-[50%] shadow-lg">
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6" className="font-bold text-green-700">
                📈 Ingresos por Día
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Período</InputLabel>
                <Select
                  value={chartType}
                  label="Período"
                  onChange={handleChange}
                  sx={{ borderRadius: '8px' }}
                >
                  {Chart.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <EarningCharts chartType={chartType} />
          </CardContent>
        </Card>

        {/* 📊 GRÁFICO DE RESERVAS */}
        <Card className="w-full lg:w-[50%] shadow-lg mt-6 lg:mt-0">
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6" className="font-bold text-blue-700">
                📊 Reservas por Día
              </Typography>
            </div>
            <BookingCharts chartType={chartType} />
          </CardContent>
        </Card>
      </div>

      {/* 📈 MÉTRICAS ADICIONALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600">
                  Ingresos de Hoy
                </Typography>
                <Typography variant="h5" className="font-bold text-green-600">
                  ${new Intl.NumberFormat('es-CL').format(booking.report?.todayEarnings || 0)}
                </Typography>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <MonetizationOnIcon sx={{ color: "#019031" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600">
                  Reservas de Hoy
                </Typography>
                <Typography variant="h5" className="font-bold text-blue-600">
                  {booking.report?.todayBookings || "0"}
                </Typography>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOnlineIcon sx={{ color: "#2196f3" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600">
                  Promedio por Reserva
                </Typography>
                <Typography variant="h5" className="font-bold text-purple-600">
                  ${new Intl.NumberFormat('es-CL').format(
                    booking.report?.totalBookings > 0 
                      ? (booking.report?.totalEarnings || 0) / booking.report.totalBookings
                      : 0
                  )}
                </Typography>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUpIcon sx={{ color: "#9c27b0" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;