import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEarnings } from "../../../../Redux/Chart/action";
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

const EarningCharts = ({ chartType = "daily" }) => {
  const dispatch = useDispatch();
  const { chart } = useSelector((store) => store);

  useEffect(() => {
    dispatch(fetchEarnings(localStorage.getItem("jwt")));
  }, [dispatch]);

  // Validación de estado de carga
  if (chart.earnings?.loading) {
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
  const earningsData = chart.earnings?.data;
  console.log("💰 Earnings Chart - Datos recibidos:", earningsData);

  if (!earningsData || !Array.isArray(earningsData) || earningsData.length === 0) {
    return (
      <Box className="h-[40vh] w-full flex items-center justify-center">
        <Alert severity="info" variant="outlined">
          💰 No hay datos de ingresos disponibles
        </Alert>
      </Box>
    );
  }

  // Formateo de datos para el gráfico
  const formatData = (data) => {
    return data.map(item => ({
      ...item,
      daily: item.daily || item.date,
      earnings: parseFloat(item.earnings) || 0
    }));
  };

  const formattedData = formatData(earningsData);

  // Configuración de Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{`Fecha: ${label}`}</p>
          <p className="text-green-600 font-semibold">
            {`Ingresos: $${new Intl.NumberFormat('es-CL').format(value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Formatear valores del eje Y
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
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
            tickFormatter={formatYAxis}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="earnings" 
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

export default EarningCharts;