import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchSalonsWithFilters, fetchAvailableCities } from '../../../Redux/Salon/action';
import { getAllCategories } from '../../../Redux/Category/action';

const SimpleSearch = () => {
  const dispatch = useDispatch();
  const { salon, category } = useSelector(store => store);
  
  // Estados para los filtros
  const [filters, setFilters] = useState({
    city: '',
    salonName: ''
  });
  
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Cargar ciudades y categorías al montar el componente
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Cargar ciudades disponibles
      const availableCities = await dispatch(fetchAvailableCities());
      setCities(availableCities);
      
      // Cargar categorías
      dispatch(getAllCategories());
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    }
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Ejecutar búsqueda
  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      console.log('Iniciando búsqueda con filtros:', filters);
      
      const results = await dispatch(searchSalonsWithFilters(filters));
      setSearchResults(results);
      
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      city: '',
      salonName: ''
    });
    setSearchResults([]);
    setHasSearched(false);
  };

  // Función para formatear tiempo
  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  // Componente de tarjeta de salón
  const SalonCard = ({ salon }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Imagen del salón */}
      <div className="relative h-48 bg-gradient-to-br from-gray-900 via-green-900 to-black">
        {salon.imageUrl ? (
          <img 
            src={salon.imageUrl} 
            alt={salon.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-4 right-4">
          {salon.isActive && (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              Abierto
            </span>
          )}
        </div>
      </div>

      {/* Información del salón */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-200">
          {salon.name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start text-gray-600">
            <span className="text-green-500 mr-3 mt-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-medium">{salon.address}</p>
              <p className="text-sm text-gray-500">{salon.city}</p>
            </div>
          </div>
          
          {salon.phoneNumber && (
            <div className="flex items-center text-gray-600">
              <span className="text-green-500 mr-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </span>
              <span className="text-sm">{salon.phoneNumber}</span>
            </div>
          )}
          
          <div className="flex items-center text-gray-600">
            <span className="text-green-500 mr-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-sm">
              {formatTime(salon.openTime)} - {formatTime(salon.closeTime)}
            </span>
          </div>
        </div>

        {/* Rating y botón */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {'★'.repeat(5)}
            </div>
            <span className="text-sm font-medium ml-2 text-gray-700">
              {salon.rating ? salon.rating.toFixed(1) : '4.5'}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              ({salon.reviewCount || '12'})
            </span>
          </div>
          
          <button 
            onClick={() => window.location.href = `/salon/${salon.id}`}
            className="bg-gray-900 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-green-800 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-center mb-4">
            Buscar Salones
          </h1>
          <p className="text-xl text-center text-gray-300">
            Encuentra el salón perfecto cerca de ti
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-12">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Ciudad */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <svg className="inline w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Ciudad
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900"
                >
                  <option value="">Todas las ciudades</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Nombre del salón */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <svg className="inline w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  Nombre del salón
                </label>
                <input
                  type="text"
                  value={filters.salonName}
                  onChange={(e) => handleFilterChange('salonName', e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-gray-900 to-green-600 text-white py-4 px-8 rounded-xl hover:from-gray-800 hover:to-green-500 transition-all duration-200 disabled:opacity-50 font-semibold flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Buscando...
                  </>
                ) : (
                  'Buscar Salones'
                )}
              </button>
              
              <button
                onClick={clearFilters}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Búsquedas rápidas por categoría */}
          {category.categories && category.categories.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Búsquedas rápidas por categoría
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, salonName: cat.name }));
                      handleSearch();
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-800 rounded-full hover:bg-green-100 hover:text-green-700 hover:border-green-200 transition-all duration-200 text-sm font-medium border border-gray-200"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resultados de búsqueda */}
        {hasSearched && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Resultados
              </h2>
              <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                <span className="text-gray-600 font-medium">
                  {searchResults.length} salon{searchResults.length !== 1 ? 'es' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResults.map((salon) => (
                  <SalonCard key={salon.id} salon={salon} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  No se encontraron salones
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Intenta con diferentes criterios de búsqueda o verifica que existan salones en la ciudad seleccionada
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-gray-900 to-green-600 text-white px-8 py-3 rounded-xl hover:from-gray-800 hover:to-green-500 transition-all duration-200 font-semibold"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleSearch;

