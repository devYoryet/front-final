import React, { useState, useEffect } from 'react';

// Hook simple para errores
export const useErrorToast = () => {
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  const showErrorMessage = (message) => {
    // Personalizar mensajes específicos
    let displayMessage = message;
    
    if (message.includes('open hours')) {
      displayMessage = "La hora seleccionada está fuera del horario de atención";
    } else if (message.includes('Slot not available')) {
      displayMessage = "El horario seleccionado ya está reservado. Elige otro horario";
    } else if (message.includes('Bad Request')) {
      displayMessage = "Error en los datos enviados. Verifica la información";
    }

    setError(displayMessage);
    setShowError(true);
  };

  const hideError = () => {
    setShowError(false);
    setTimeout(() => setError(null), 300);
  };

  return { error, showError, showErrorMessage, hideError };
};

// Componente Toast simple
const ErrorToast = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 transform transition-all duration-300">
      <div className="bg-red-50 border border-red-200 rounded-xl shadow-lg p-4 max-w-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-red-800">
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex text-red-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorToast;