import React, { useEffect } from "react";
import ReportCard from "./Report/ReportCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import CancelIcon from "@mui/icons-material/Cancel";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  FormControl,
  Grid2,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import EarningCharts from "./Chart/EarningCharts";
import BookingCharts from "./Chart/BookingChart";
import { useSelector } from "react-redux";

// 📊 OPCIONES DE GRÁFICOS EN ESPAÑOL
const Chart = [
  { name: "Hoy", value: "today" },
  { name: "Últimos 7 días", value: "daily" },
  { name: "Últimos 12 meses", value: "monthly" },
];

const HomePage = () => {
  const [chartType, setChartType] = React.useState(Chart[0].value);
  const { booking } = useSelector(store => store);

  useEffect(() => {}, []);

  const handleChange = (event) => {
    setChartType(event.target.value);
  };

  return (
    <div className="space-y-5">
      {/* 📱 SECCIÓN PRINCIPAL */}
      <div className="lg:flex gap-5">
        {/* 📈 GRÁFICO DE INGRESOS */}
        <div className="space-y-10 rounded-md w-full lg:w-[70%]">
          <div>
            <div className="border rounded-lg p-5 w-full">
              <h1 className="text-lg font-bold pb-5 text-[#067c06]">
                📈 Ingresos Totales
              </h1>
              <EarningCharts />
            </div>
          </div>
        </div>

        {/* 📊 TARJETAS DE RESUMEN */}
        <section className="space-y-5 w-full lg:w-[30%]">
          <ReportCard
            icon={<MonetizationOnIcon sx={{ color: "#019031" }} />}
            value={"$" + "" + (booking.report?.totalEarnings || "0")}
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
            value={"$" + (booking.report?.totalRefund || "0")}
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
        </section>
      </div>

      {/* 📊 GRÁFICO DE RESERVAS */}
      <div className="space-y-10 rounded-md w-full">
        <div>
          <div className="border rounded-lg p-5 w-full">
            <div className="flex justify-between items-center pb-5">
              <h1 className="text-lg font-bold text-[#067c06]">
                📊 Gráfico de Reservas
              </h1>
              
              {/* 🔽 SELECTOR DE PERÍODO */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="chart-type-label">Período</InputLabel>
                <Select
                  labelId="chart-type-label"
                  id="chart-type-select"
                  value={chartType}
                  label="Período"
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                >
                  {Chart.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            
            <BookingCharts chartType={chartType} />
          </div>
        </div>
      </div>

      {/* 📈 MÉTRICAS ADICIONALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos de Hoy</p>
              <p className="text-2xl font-bold text-green-600">
                ${booking.report?.todayEarnings || "0"}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <MonetizationOnIcon sx={{ color: "#019031" }} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reservas de Hoy</p>
              <p className="text-2xl font-bold text-blue-600">
                {booking.report?.todayBookings || "0"}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BookOnlineIcon sx={{ color: "#2196f3" }} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasa de Conversión</p>
              <p className="text-2xl font-bold text-orange-600">
                {booking.report?.conversionRate || "0"}%
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingUpIcon sx={{ color: "#ff9800" }} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Únicos</p>
              <p className="text-2xl font-bold text-purple-600">
                {booking.report?.uniqueCustomers || "0"}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <AccountBalanceIcon sx={{ color: "#9c27b0" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;