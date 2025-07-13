import React, { useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesBySalon } from "../../../Redux/Category/action";
import CategoryTable from "./CategoryTable";
import { Button, Typography } from "@mui/material";
import { fetchCategoriesBySalonOwner } from "../../../Redux/Category/action";

const Category = () => {
  const [activeTab, setActiveTab] = useState(1);
  const { category, salon } = useSelector((store) => store);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategoriesBySalonOwner(localStorage.getItem("jwt")));
  }, []);

  console.log("salon ", salon);

  const handleTabChange = (tab) => () => {
    setActiveTab(tab);
  };

  // 🚀 FUNCIÓN PARA QUE CategoryForm CAMBIE EL TAB AUTOMÁTICAMENTE
  const handleCategoryCreated = () => {
    setActiveTab(1); // Cambiar a "All Categories"
    // Recargar las categorías
    dispatch(fetchCategoriesBySalonOwner(localStorage.getItem("jwt")));
  };

  return (
    <div className="p-6">
      {/* Header similar al de ServicesTable */}
      <div className="mb-6">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Gestión de Categorías
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Administra las categorías de servicios de tu salón
        </Typography>
      </div>

      {/* Botones de navegación */}
      <div className="flex items-center gap-5 mb-6">
        <Button
          onClick={handleTabChange(1)}
          variant={activeTab == 1 ? "contained" : "outlined"}
          sx={{
            backgroundColor: activeTab == 1 ? "#019031" : "transparent",
            borderColor: "#019031",
            color: activeTab == 1 ? "white" : "#019031",
            "&:hover": {
              backgroundColor: activeTab == 1 ? "#017a29" : "#f0f9f1",
            },
          }}
        >
          Todas las Categorías
        </Button>
        <Button
          onClick={handleTabChange(2)}
          variant={activeTab == 2 ? "contained" : "outlined"}
          sx={{
            backgroundColor: activeTab == 2 ? "#019031" : "transparent",
            borderColor: "#019031",
            color: activeTab == 2 ? "white" : "#019031",
            "&:hover": {
              backgroundColor: activeTab == 2 ? "#017a29" : "#f0f9f1",
            },
          }}
        >
          Crear Nueva Categoría
        </Button>
      </div>

      {/* Contenido de las pestañas */}
      <div>
        {activeTab === 1 ? (
          <CategoryTable />
        ) : (
          <CategoryForm onCategoryCreated={handleCategoryCreated} />
        )}
      </div>
    </div>
  );
};

export default Category;