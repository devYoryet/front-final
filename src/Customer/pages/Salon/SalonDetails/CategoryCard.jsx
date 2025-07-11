// =============================================================================
// FRONTEND - CategoryCard ARREGLADO con manejo seguro
// src/Customer/pages/Salon/SalonDetails/CategoryCard.jsx
// =============================================================================
import React from "react";

const CategoryCard = ({ category, isSelected, handleSelectCategory }) => {
  
  // 🚀 VALIDACIÓN SEGURA DE PROPS
  if (!category) {
    console.warn("CategoryCard: category prop is undefined");
    return null; // No renderizar si no hay category
  }

  // 🚀 VALIDAR QUE TENGA ID
  if (!category.id) {
    console.warn("CategoryCard: category.id is undefined", category);
    return null; // No renderizar si no tiene ID
  }

  // 🚀 VALIDAR QUE handleSelectCategory SEA FUNCIÓN
  if (typeof handleSelectCategory !== 'function') {
    console.warn("CategoryCard: handleSelectCategory is not a function");
    return null;
  }

  return (
    <div
      onClick={handleSelectCategory(category.id)}
      className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-purple-500 bg-purple-50 text-purple-700"
          : "border-gray-300 bg-white text-gray-700 hover:border-purple-300"
      }`}
    >
      <div className="text-center">
        <h3 className="font-semibold text-sm">
          {category.name || "Categoría sin nombre"}
        </h3>
        {category.description && (
          <p className="text-xs text-gray-500 mt-1">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;