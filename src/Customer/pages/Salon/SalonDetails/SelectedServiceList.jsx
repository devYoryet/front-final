// =============================================================================
// FRONTEND - SelectedServiceList MEJORADO 🇨🇱
// src/Customer/pages/Salon/SalonDetails/SelectedServiceList.jsx
// =============================================================================
import { Delete, AccessTime } from "@mui/icons-material";
import { IconButton, Divider } from "@mui/material";
import React from "react";

const SelectedServiceList = ({ services, handleRemoveService, formatPrice }) => {
  
  // Función por defecto para formatear precio si no se pasa
  const defaultFormatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price).replace('CLP', '$');
  };

  const priceFormatter = formatPrice || defaultFormatPrice;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-lg text-gray-800 mb-3">
        ✨ Servicios Seleccionados
      </h3>
      
      {services.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <div className="text-4xl mb-2">🛒</div>
          <p>No has seleccionado ningún servicio</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={service.id || index}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{service.name}</h4>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <AccessTime fontSize="small" className="mr-1" />
                    <span>{service.duration || 30} min</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="font-bold text-purple-600 mr-2">
                    {priceFormatter(service.price)}
                  </span>
                  <IconButton
                    onClick={() => handleRemoveService(service.id)}
                    size="small"
                    color="error"
                    className="hover:bg-red-50"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </div>
              </div>
              
              {index < services.length - 1 && (
                <Divider className="mt-3" />
              )}
            </div>
          ))}
          
          {services.length > 0 && (
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center font-semibold">
                <span>Subtotal:</span>
                <span className="text-purple-600">
                  {priceFormatter(services.reduce((total, service) => total + service.price, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                <span>Duración total:</span>
                <span>
                  {services.reduce((total, service) => total + (service.duration || 30), 0)} minutos
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectedServiceList;