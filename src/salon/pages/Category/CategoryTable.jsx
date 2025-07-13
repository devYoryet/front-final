import * as React from "react";
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
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import UpdateCategoryForm from "./UpdateCategoryForm";
import { deleteCategory } from "../../../Redux/Category/action";

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

export default function CategoryTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { category } = useSelector((store) => store);
  
  // Estados para modals y snackbars
  const [snackbarOpen, setOpenSnackbar] = useState(false);
  const [openUpdateCategoryForm, setUpdateCategoryForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Handlers para actualizar
  const handleOpenUpdateCategoryForm = (id) => () => {
    navigate(`/salon-dashboard/category/${id}`);
    setUpdateCategoryForm(true);
  };
  
  const handleCloseUpdateCategoryForm = () => setUpdateCategoryForm(false);

  // Handlers para eliminar
  const handleDeleteClick = (categoryItem) => () => {
    setCategoryToDelete(categoryItem);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete.id));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  React.useEffect(() => {
    if (category.updated || category.error || category.deleted) {
      setOpenSnackbar(true);
    }
  }, [category.updated, category.error, category.deleted]);

  return (
    <>
      <TableContainer component={Paper} elevation={3} className="rounded-lg">
        <Table sx={{ minWidth: 700 }} aria-label="tabla de categorías">
          <TableHead>
            <TableRow>
              <StyledTableCell>Imagen</StyledTableCell>
              <StyledTableCell>Nombre de Categoría</StyledTableCell>
              <StyledTableCell align="center">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {category.categories && category.categories.length > 0 ? (
              category.categories.map((item) => (
                <StyledTableRow key={item.id}>
                  <StyledTableCell component="th" scope="row">
                    <img 
                      className="w-16 h-16 rounded-lg object-cover shadow-sm" 
                      src={item.image} 
                      alt={item.name}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="subtitle1" className="font-semibold text-gray-800">
                      {item.name}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <div className="flex gap-2 justify-center">
                      <IconButton
                        onClick={handleOpenUpdateCategoryForm(item.id)}
                        color="primary"
                        className="hover:bg-blue-50"
                        title="Editar categoría"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleDeleteClick(item)}
                        color="error"
                        className="hover:bg-red-50"
                        title="Eliminar categoría"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={3} align="center" className="py-8">
                  <div className="text-gray-500">
                    <Typography variant="h6" className="mb-2">
                      No hay categorías registradas
                    </Typography>
                    <Typography variant="body2">
                      Crea categorías para organizar tus servicios
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
        open={openUpdateCategoryForm}
        onClose={handleCloseUpdateCategoryForm}
        aria-labelledby="modal-actualizar-categoria"
      >
        <Box sx={style}>
          <UpdateCategoryForm onClose={handleCloseUpdateCategoryForm} />
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
            ¿Estás seguro de que deseas eliminar la categoría <strong>"{categoryToDelete?.name}"</strong>?
            <br />
            <br />
            <strong>Nota:</strong> Los servicios asociados a esta categoría quedarán sin categoría asignada.
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
            category.deleted 
              ? "success" 
              : category.updated 
                ? "success" 
                : "error"
          }
          variant="filled"
          sx={{ width: "100%" }}
        >
          {category.deleted
            ? "Categoría eliminada exitosamente"
            : category.updated
            ? "Categoría actualizada exitosamente"
            : category.error || "Error en la operación"}
        </Alert>
      </Snackbar>
    </>
  );
}