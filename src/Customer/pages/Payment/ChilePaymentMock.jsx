// =============================================================================
// FRONTEND - ChilePaymentMock.jsx - SOLO CAMBIOS MÍNIMOS
// =============================================================================
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Typography, Box, LinearProgress, Alert } from '@mui/material';

const ChilePaymentMock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('select');

  // 🔧 FIX: Extraer parámetros con validación MEJORADA
  const getQueryParam = (name) => {
    const params = new URLSearchParams(location.search);
    return params.get(name);
  };

  const orderId = getQueryParam('orderId');
  const amount = getQueryParam('amount');
  const provider = getQueryParam('provider') || 'webpay';
  const email = getQueryParam('email');
  const userName = getQueryParam('name');

  // 🔧 FIX: Validación de parámetros AL INICIO
  useEffect(() => {
    console.log('🔍 Parámetros recibidos:', {
      orderId, amount, provider, email, userName,
      search: location.search,
      pathname: location.pathname
    });

    if (!orderId || !amount) {
      console.error('❌ Faltan parámetros de pago:', { orderId, amount });
    }
  }, [orderId, amount, provider, email, userName, location]);

  // Configuración de proveedores chilenos
  const providers = {
    webpay: {
      name: 'WebPay Plus',
      logo: '🏦',
      color: '#E31837',
      description: 'Transbank - Pago con tarjeta'
    },
    onepay: {
      name: 'OnePay',
      logo: '📱',
      color: '#FF6B35',
      description: 'Pago móvil con app bancaria'
    },
    mercadopago: {
      name: 'Mercado Pago',
      logo: '💙',
      color: '#009EE3',
      description: 'Billetera digital'
    },
    khipu: {
      name: 'Khipu',
      logo: '🦘',
      color: '#00A651',
      description: 'Transferencia bancaria'
    },
    flow: {
      name: 'Flow',
      logo: '💧',
      color: '#6B46C1',
      description: 'Múltiples métodos de pago'
    }
  };

  const currentProvider = providers[provider] || providers.webpay;

  // 🔧 FIX: Llamar al backend para confirmar pago
  const handlePayment = async (selectedProvider) => {
    setLoading(true);
    setPaymentStep('processing');

    try {
      console.log('🔄 Procesando pago chileno:', { orderId, selectedProvider });
      
      // 🚀 AGREGAR LLAMADA AL BACKEND
      const apiUrl = process.env.REACT_APP_API_URL || 'https://34.203.37.29:5000';
      console.log('📡 Llamando a:', `${apiUrl}/api/payments/chile-success`);
      
      const response = await fetch(`${apiUrl}/api/payments/chile-success`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: parseInt(orderId),
          provider: selectedProvider,
          status: 'approved',
          chile_payment_id: `CLP_${Date.now()}`,
          chile_payment_provider: selectedProvider
        })
      });

      if (response.ok) {
        console.log('✅ Pago confirmado en backend');
        setPaymentStep('success');
        
        setTimeout(() => {
          const successUrl = `/payment-success/${orderId}?` +
            `chile_payment_id=CLP_${Date.now()}&` +
            `chile_payment_provider=${selectedProvider}&` +
            `status=approved`;
          
          navigate(successUrl);
        }, 2000);
      } else {
        throw new Error('Error al confirmar pago');
      }

    } catch (error) {
      console.error('❌ Error procesando pago:', error);
      // En caso de error, simular éxito para desarrollo
      setTimeout(() => {
        setPaymentStep('success');
        setTimeout(() => {
          const successUrl = `/payment-success/${orderId}?` +
            `chile_payment_id=CLP_${Date.now()}&` +
            `chile_payment_provider=${selectedProvider}&` +
            `status=approved`;
          
          navigate(successUrl);
        }, 2000);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // 🔧 FIX: Mostrar error si faltan parámetros
  if (!orderId || !amount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <div className="text-6xl mb-4">❌</div>
            <Typography variant="h5" className="mb-4 text-red-600">
              Faltan parámetros de pago
            </Typography>
            <Alert severity="error" className="mb-4">
              orderId: {orderId || 'FALTANTE'}<br/>
              amount: {amount || 'FALTANTE'}
            </Alert>
            <Typography variant="body2" className="text-gray-500 mb-4">
              URL: {location.pathname + location.search}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/bookings')}
            >
              Volver a Reservas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // RESTO DEL CÓDIGO IGUAL... (pantallas processing, success, etc.)
  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <div className="text-6xl mb-4">{currentProvider.logo}</div>
            <Typography variant="h5" className="mb-4">
              Procesando Pago
            </Typography>
            <Typography variant="body1" className="mb-6 text-gray-600">
              {currentProvider.name}
            </Typography>
            <Box className="mb-4">
              <LinearProgress />
            </Box>
            <Typography variant="body2" className="text-gray-500">
              Conectando con {currentProvider.description}...
            </Typography>
            <Typography variant="h6" className="mt-4 text-green-600">
              ${amount} CLP
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <div className="text-6xl mb-4">✅</div>
            <Typography variant="h5" className="mb-4 text-green-600">
              ¡Pago Exitoso!
            </Typography>
            <Alert severity="success" className="mb-4">
              Tu pago de ${amount} CLP fue procesado correctamente
            </Alert>
            <Typography variant="body2" className="text-gray-500">
              Redirigiendo...
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pantalla de selección de método de pago
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <Typography variant="h4" className="mb-2">
            Pago Seguro 🇨🇱
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Selecciona tu método de pago preferido
          </Typography>
          <Typography variant="h6" className="mt-4 text-purple-600">
            Total: ${amount} CLP
          </Typography>
        </div>

        <Card className="mb-6">
          <CardContent>
            <Typography variant="h6" className="mb-2">
              Detalles de la Compra
            </Typography>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Orden:</span>
                <span>#{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Cliente:</span>
                <span>{userName || email}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span>{email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {Object.entries(providers).map(([key, provider]) => (
            <Card 
              key={key}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handlePayment(key)}
            >
              <CardContent className="flex items-center p-4">
                <div className="text-4xl mr-4">{provider.logo}</div>
                <div className="flex-1">
                  <Typography variant="h6" style={{ color: provider.color }}>
                    {provider.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {provider.description}
                  </Typography>
                </div>
                <Button 
                  variant="outlined" 
                  disabled={loading}
                  style={{ borderColor: provider.color, color: provider.color }}
                >
                  Pagar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Typography variant="body2" className="text-gray-500">
            🔒 Pago simulado - Ambiente de desarrollo
          </Typography>
          <Button 
            variant="text" 
            onClick={() => navigate('/bookings')}
            className="mt-2"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChilePaymentMock;