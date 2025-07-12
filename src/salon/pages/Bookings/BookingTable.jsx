import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalonBookings, updateBookingStatus } from "../../../Redux/Booking/action";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  Alert,
  Grid,
  Divider,
  Avatar,
  Tooltip
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Schedule,
  MoreVert,
  Person,
  Email,
  Phone,
  AttachMoney,
  AccessTime,
  CalendarToday
} from "@mui/icons-material";

const BokingTable = () => {
  const dispatch = useDispatch();
  const { booking } = useSelector(store => store);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
dispatch(fetchSalonBookings(localStorage.getItem("jwt")));
    }
  }, [dispatch]); 

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return { color: 'success', label: 'Confirmada' };
      case 'PENDING': return { color: 'warning', label: 'Pendiente' };
      case 'CANCELLED': return { color: 'error', label: 'Cancelada' };
      case 'SUCCESS': return { color: 'primary', label: 'Completada' };
      default: return { color: 'default', label: status };
    }
  };

  const handleStatusUpdate = (bookingId, newStatus) => {
    const token = localStorage.getItem("jwt");
    dispatch(updateBookingStatus(bookingId, newStatus, token));
    setAnchorEl(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

const bookings = booking.bookings || [];

  return (
    <Box className="p-6 space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center">
        <div>
          <Typography variant="h4" className="font-bold text-gray-800">
            📅 Reservas del Salón
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Gestiona todas las reservas de tu salón
          </Typography>
        </div>
        
        <Card className="p-4">
          <Typography variant="h6" className="text-center">
            Total Reservas
          </Typography>
          <Typography variant="h3" className="text-center font-bold text-blue-600">
            {bookings.length}
          </Typography>
        </Card>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {['PENDING', 'CONFIRMED', 'SUCCESS', 'CANCELLED'].map(status => {
          const count = bookings.filter(b => b.status === status).length;
          const statusInfo = getStatusColor(status);
          
          return (
            <Grid item xs={12} sm={6} md={3} key={status}>
              <Card className="text-center">
                <CardContent>
                  <Typography variant="h4" className="font-bold" 
                    style={{ color: statusInfo.color === 'success' ? '#4caf50' : 
                                   statusInfo.color === 'warning' ? '#ff9800' :
                                   statusInfo.color === 'error' ? '#f44336' : '#2196f3' }}>
                    {count}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {statusInfo.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <Alert severity="info" className="text-center">
          📅 No hay reservas registradas en tu salón
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => {
            const statusInfo = getStatusColor(booking.status);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={booking.id}>
                <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-3">
                    {/* Header */}
                    <Box className="flex justify-between items-start">
                      <Box className="flex items-center space-x-2">
                        <Avatar className="bg-blue-500">
                          <Person />
                        </Avatar>
                        <div>
                          <Typography variant="h6" className="font-semibold">
                            #{booking.id}
                          </Typography>
                          <Chip 
                            label={statusInfo.label}
                            color={statusInfo.color}
                            size="small"
                          />
                        </div>
                      </Box>
                      
                      <IconButton 
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setSelectedBooking(booking);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    <Divider />

                    {/* Customer Info */}
                    <Box className="space-y-2">
                      <Box className="flex items-center space-x-2">
                        <Person fontSize="small" className="text-gray-500" />
                        <Typography variant="body2">
                          {booking.customerName || 'Cliente'}
                        </Typography>
                      </Box>
                      
                      {booking.customerEmail && (
                        <Box className="flex items-center space-x-2">
                          <Email fontSize="small" className="text-gray-500" />
                          <Typography variant="body2" className="truncate">
                            {booking.customerEmail}
                          </Typography>
                        </Box>
                      )}

                      {booking.customerPhone && (
                        <Box className="flex items-center space-x-2">
                          <Phone fontSize="small" className="text-gray-500" />
                          <Typography variant="body2">
                            {booking.customerPhone}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Divider />

                    {/* Booking Details */}
                    <Box className="space-y-2">
                      <Box className="flex items-center space-x-2">
                        <CalendarToday fontSize="small" className="text-gray-500" />
                        <Typography variant="body2">
                          {formatDate(booking.startTime)}
                        </Typography>
                      </Box>

                      <Box className="flex items-center space-x-2">
                        <AccessTime fontSize="small" className="text-gray-500" />
                        <Typography variant="body2">
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </Typography>
                      </Box>

                      <Box className="flex items-center space-x-2">
                        <AttachMoney fontSize="small" className="text-gray-500" />
                        <Typography variant="body2" className="font-semibold">
                          {formatPrice(booking.totalPrice)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Services */}
                    {booking.services && booking.services.length > 0 && (
                      <>
                        <Divider />
                        <Box>
                          <Typography variant="body2" className="font-medium mb-1">
                            Servicios:
                          </Typography>
                          <Box className="flex flex-wrap gap-1">
                            {booking.services.map((service, index) => (
                              <Chip 
                                key={index}
                                label={service.name || service}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Status Update Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {selectedBooking?.status !== 'CONFIRMED' && (
          <MenuItem onClick={() => handleStatusUpdate(selectedBooking.id, 'CONFIRMED')}>
            <CheckCircle className="mr-2" color="success" />
            Confirmar
          </MenuItem>
        )}
        
        {selectedBooking?.status !== 'SUCCESS' && (
          <MenuItem onClick={() => handleStatusUpdate(selectedBooking.id, 'SUCCESS')}>
            <CheckCircle className="mr-2" color="primary" />
            Marcar Completada
          </MenuItem>
        )}
        
        {selectedBooking?.status !== 'CANCELLED' && (
          <MenuItem onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELLED')}>
            <Cancel className="mr-2" color="error" />
            Cancelar
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default BokingTable;