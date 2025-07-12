import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Chip,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchServicesBySalonId, deleteService } from "../../../Redux/Salon Services/action";
import UpdateServiceForm from "./UpdateSalonServiceForm";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    backgroundColor: "#019031",
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  "&.MuiTableCell-body": {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: "#f3f4f6",
    transition: "background-color 0.2s ease",
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function ServicesTable() {
  const { service } = useSelector((store) => store);
  const { salon } = useSelector((store) => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openUpdateServiceForm, setUpdateServiceForm] = React.useState(false);
  const [snackbarOpen, setOpenSnackbar] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [serviceToDelete, setServiceToDelete] = React.useState(null);

  const handleOpenUpdateServiceForm = (id) => () => {
    navigate(`/salon-dashboard/services/${id}`);
    setUpdateServiceForm(true);
  };

  const handleCloseUpdateServiceForm = () => setUpdateServiceForm(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDeleteClick = (serviceData) => {
    setServiceToDelete(serviceData);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (serviceToDelete) {
      dispatch(deleteService(serviceToDelete.id));
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  React.useEffect(() => {
    if (service.updated || service.error || service.deleted) {
      setOpenSnackbar(true);
    }
  }, [service.updated, service.error, service.deleted]);

  React.useEffect(() => {
    if (salon.salon?.id) {
      dispatch(
        fetchServicesBySalonId({
          salonId: salon.salon?.id,
          jwt: localStorage.getItem("jwt"),
        })
      );
    }
  }, [salon.salon, service.deleted]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Gestión de Servicios
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Administra los servicios de tu salón de belleza
        </Typography>
      </div>

      <TableContainer component={Paper} elevation={3} className="rounded-lg">
        <Table sx={{ minWidth: 700 }} aria-label="tabla de servicios">
          <TableHead>
            <TableRow>
              <StyledTableCell>Imagen</StyledTableCell>
              <StyledTableCell>Servicio</StyledTableCell>
              <StyledTableCell align="center">Precio</StyledTableCell>
              <StyledTableCell align="center">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {service.services && service.services.length > 0 ? (
              service.services.map((item) => (
                <StyledTableRow key={item.id}>
                  <StyledTableCell component="th" scope="row">
                    <img 
                      className="w-16 h-16 rounded-lg object-cover shadow-sm" 
                      src={item.image} 
                      alt={item.name}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <div>
                      <Typography variant="subtitle1" className="font-semibold text-gray-800">
                        {item.name}
                      </Typography>
                      {item.description && (
                        <Typography variant="body2" className="text-gray-500 mt-1">
                          {item.description}
                        </Typography>
                      )}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Chip 
                      label={formatPrice(item.price)} 
                      color="primary" 
                      variant="outlined"
                      className="font-semibold"
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <div className="flex gap-2 justify-center">
                      <IconButton
                        onClick={handleOpenUpdateServiceForm(item.id)}
                        color="primary"
                        className="hover:bg-blue-50"
                        title="Editar servicio"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(item)}
                        color="error"
                        className="hover:bg-red-50"
                        title="Eliminar servicio"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={4} align="center" className="py-8">
                  <div className="text-gray-500">
                    <Typography variant="h6" className="mb-2">
                      No hay servicios registrados
                    </Typography>
                    <Typography variant="body2">
                      Agrega servicios para mostrarlos aquí
                    </Typography>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de actualización */}
      <Modal
        open={openUpdateServiceForm}
        onClose={handleCloseUpdateServiceForm}
        aria-labelledby="modal-actualizar-servicio"
      >
        <Box sx={style}>
          <UpdateServiceForm onClose={handleCloseUpdateServiceForm} />
        </Box>
      </Modal>

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="confirmar-eliminacion"
      >
        <DialogTitle className="text-red-600 font-bold">
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el servicio <strong>"{serviceToDelete?.name}"</strong>?
            <br />
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4">
          <Button 
            onClick={handleDeleteCancel} 
            color="inherit"
            className="text-gray-600"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de notificaciones */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={
            service.deleted 
              ? "success" 
              : service.updated 
                ? "success" 
                : "error"
          }
          variant="filled"
          sx={{ width: "100%" }}
        >
          {service.deleted
            ? "Servicio eliminado exitosamente"
            : service.updated
            ? "Servicio actualizado exitosamente"
            : service.error?.response?.data?.message || "Error en la operación"}
        </Alert>
      </Snackbar>
    </div>
  );
}