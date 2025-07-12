import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { paymentScuccess } from '../../../Redux/Payment/action';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Box,
  LinearProgress,
  Chip,
  Grid
} from '@mui/material';

const ChilePaymentMock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [paymentStep, setPaymentStep] = useState('selection');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extraer parámetros de la URL
  const searchParams = new URLSearchParams(location.search);
  const amount = searchParams.get('amount') || '0';
  const orderId = searchParams.get('orderId');
  const paymentLinkId = searchParams.get('paymentLinkId');
  const provider = searchParams.get('provider') || 'webpay';

  const providers = {
    webpay: {
      name: 'Webpay Plus',
      logo: '💳',
      description: 'Transbank - Pago con tarjeta',
      color: '#E53E3E'
    },
    khipu: {
      name: 'Khipu',
      logo: '🏦',
      description: 'Transferencia bancaria instantánea',
      color: '#38A169'
    },
    mercadopago: {
      name: 'MercadoPago',
      logo: '💰',
      description: 'Múltiples métodos de pago',
      color: '#00A6FB'
    },
    flow: {
      name: 'Flow',
      logo: '💎',
      description: 'Gateway de pagos chileno',
      color: '#805AD5'
    }
  };

  const currentProvider = providers[provider] || providers.webpay;

  useEffect(() => {
    if (!orderId || !paymentLinkId) {
      console.error('❌ Faltan parámetros de pago');
      navigate('/');
    }
  }, [orderId, paymentLinkId, navigate]);

  const handleProviderSelect = (providerKey) => {
    setSelectedProvider(providerKey);
    setPaymentStep('processing');
    
    // Simular tiempo de procesamiento
    setIsProcessing(true);
    setTimeout(() => {
      setPaymentStep('confirming');
      setTimeout(() => {
        handlePaymentSuccess();
      }, 2000);
    }, 3000);
  };

  const handlePaymentSuccess = async () => {
    try {
      console.log('🎉 PROCESANDO PAGO EXITOSO...');
      console.log('PaymentLinkId:', paymentLinkId);
      console.log('OrderId:', orderId);

      const jwt = localStorage.getItem('jwt');
      
      // 🚀 LLAMAR A LA ACCIÓN PARA CONFIRMAR EL PAGO
      await dispatch(paymentScuccess({
        paymentId: orderId,
        paymentLinkId: paymentLinkId,
        jwt: jwt
      }));

      setPaymentStep('success');
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/payment/success', {
          state: {
            orderId,
            paymentId: paymentLinkId,
            amount,
            provider: selectedProvider || provider
          }
        });
      }, 3000);

    } catch (error) {
      console.error('❌ Error procesando pago:', error);
      setPaymentStep('error');
    }
  };

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
              ${new Intl.NumberFormat('es-CL').format(amount)} CLP
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStep === 'confirming') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <div className="text-6xl mb-4">⏳</div>
            <Typography variant="h5" className="mb-4">
              Confirmando Pago
            </Typography>
            <Typography variant="body1" className="mb-6 text-gray-600">
              Actualizando estado de la reserva...
            </Typography>
            <Box className="mb-4">
              <LinearProgress color="success" />
            </Box>
            <Typography variant="body2" className="text-gray-500">
              Casi listo...
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
              Tu pago de ${new Intl.NumberFormat('es-CL').format(amount)} CLP fue procesado correctamente
            </Alert>
            <Typography variant="body2" className="text-gray-500 mb-4">
              Redirigiendo a página de confirmación...
            </Typography>
            <Box className="text-left bg-gray-50 p-3 rounded">
              <Typography variant="body2" className="text-xs">
                <strong>Orden:</strong> #{orderId}<br/>
                <strong>Método:</strong> {currentProvider.name}<br/>
                <strong>Estado:</strong> CONFIRMADO
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStep === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <div className="text-6xl mb-4">❌</div>
            <Typography variant="h5" className="mb-4 text-red-600">
              Error en el Pago
            </Typography>
            <Alert severity="error" className="mb-4">
              Hubo un problema procesando tu pago
            </Alert>
            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
              fullWidth
            >
              Volver al Inicio
            </Button>
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
            Total: ${new Intl.NumberFormat('es-CL').format(amount)} CLP
          </Typography>
        </div>

        <Card className="mb-6">
          <CardContent>
            <Typography variant="h6" className="mb-4">
              Métodos de Pago Disponibles
            </Typography>
            
            <Grid container spacing={3}>
              {Object.entries(providers).map(([key, provider]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedProvider === key ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => handleProviderSelect(key)}
                  >
                    <CardContent className="text-center p-4">
                      <div className="text-4xl mb-2">{provider.logo}</div>
                      <Typography variant="h6" className="mb-1">
                        {provider.name}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {provider.description}
                      </Typography>
                      <Chip 
                        label="Disponible"
                        size="small"
                        color="success"
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-2">
              Resumen del Pago
            </Typography>
            <Box className="space-y-2">
              <Box className="flex justify-between">
                <Typography>Orden ID:</Typography>
                <Typography className="font-mono">#{orderId}</Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography>Monto Total:</Typography>
                <Typography className="font-bold text-green-600">
                  ${new Intl.NumberFormat('es-CL').format(amount)} CLP
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChilePaymentMock;