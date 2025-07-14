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
    salonName: '',
    homeService: false
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
      console.log('🔍 Iniciando búsqueda con filtros:', filters);
      
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
      salonName: '',
      homeService: false
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
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group">
      {/* Imagen del salón */}
      <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400">
        {salon.imageUrl ? (
          <img 
            src={salon.imageUrl} 
            alt={salon.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-6xl">
            ✨
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {salon.homeService && (
            <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
              🏠 A domicilio
            </span>
          )}
          {salon.isActive && (
            <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
              ✅ Abierto
            </span>
          )}
        </div>
      </div>

      {/* Información del salón */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-200">
          {salon.name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <span className="text-purple-500 mr-2">📍</span>
            <span className="text-sm">{salon.address}, {salon.city}</span>
          </div>
          
          {salon.phoneNumber && (
            <div className="flex items-center text-gray-600">
              <span className="text-purple-500 mr-2">📞</span>
              <span className="text-sm">{salon.phoneNumber}</span>
            </div>
          )}
          
          <div className="flex items-center text-gray-600">
            <span className="text-purple-500 mr-2">🕐</span>
            <span className="text-sm">
              {formatTime(salon.openTime)} - {formatTime(salon.closeTime)}
            </span>
          </div>
        </div>

        {/* Rating y precio */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-yellow-400 text-lg">⭐</span>
            <span className="text-sm font-medium ml-1">
              {salon.rating ? salon.rating.toFixed(1) : '4.5'}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              ({salon.reviewCount || '12'} reseñas)
            </span>
          </div>
          
          <button 
            onClick={() => window.location.href = `/salon/${salon.id}`}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            🔍 Buscar Salones de Belleza
          </h1>
          <p className="text-xl text-center opacity-90">
            Encuentra el salón perfecto cerca de ti
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Ciudad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 Ciudad
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Todas las ciudades</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Nombre del salón */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔍 Nombre del salón
                </label>
                <input
                  type="text"
                  value={filters.salonName}
                  onChange={(e) => handleFilterChange('salonName', e.target.value)}
                  placeholder="Ej: Bella Vista, Hair Studio..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Servicio a domicilio */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="homeService"
                checked={filters.homeService}
                onChange={(e) => handleFilterChange('homeService', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="homeService" className="ml-3 text-sm font-medium text-gray-700">
                🏠 Solo salones con servicio a domicilio
              </label>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 font-medium flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    🔍 Buscar Salones
                  </>
                )}
              </button>
              
              <button
                onClick={clearFilters}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium flex items-center"
              >
                ❌ Limpiar
              </button>
            </div>
          </div>

          {/* Búsquedas rápidas por categoría */}
          {category.categories && category.categories.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                📂 Búsquedas rápidas por categoría
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, salonName: cat.name }));
                      handleSearch();
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-all duration-200 text-sm"
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                📋 Resultados de búsqueda
              </h2>
              <span className="text-gray-600">
                {searchResults.length} salon{searchResults.length !== 1 ? 'es' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
              </span>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((salon) => (
                  <SalonCard key={salon.id} salon={salon} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-300 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No se encontraron salones
                </h3>
                <p className="text-gray-500 mb-6">
                  Intenta con diferentes criterios de búsqueda
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  🔄 Limpiar filtros
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