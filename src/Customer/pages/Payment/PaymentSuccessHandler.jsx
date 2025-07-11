// =============================================================================
// FRONTEND - PaymentSuccessHandler ACTUALIZADO para pagos chilenos
// src/Customer/pages/Payment/PaymentSuccessHandler.jsx
// =============================================================================
import { Backdrop, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { paymentScuccess } from "../../../Redux/Payment/action";

const PaymentSuccessHandler = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { id: orderId } = useParams();
    const { payment } = useSelector(store => store);
    const [paymentProcessed, setPaymentProcessed] = useState(false);

    const getQueryParam = (key) => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };

    // 🇨🇱 DETECTAR TIPO DE PAGO
    const chilePaymentId = getQueryParam("chile_payment_id");
    const chileProvider = getQueryParam("chile_payment_provider");
    const razorpayPaymentId = getQueryParam("razorpay_payment_id");
    const razorpayLinkId = getQueryParam("razorpay_payment_link_id");
    
    // Determinar el tipo de pago
    const isChilePayment = chilePaymentId != null;
    const paymentId = isChilePayment ? chilePaymentId : razorpayPaymentId;
    const paymentLinkId = isChilePayment ? `chile_${orderId}` : razorpayLinkId;

    useEffect(() => {
        if (paymentId && !paymentProcessed) {
            console.log("🎉 Processing payment success for order:", orderId);
            console.log("🇨🇱 Chile payment:", isChilePayment);
            console.log("💳 Provider:", chileProvider || "razorpay");
            
            setPaymentProcessed(true);
            
            dispatch(
                paymentScuccess({
                    paymentId,
                    paymentLinkId: paymentLinkId || "",
                    jwt: localStorage.getItem("jwt") || "",
                })
            );
        }
    }, [paymentId, paymentProcessed, dispatch, paymentLinkId, orderId, isChilePayment, chileProvider]);

    const handleGoHome = () => {
        navigate("/");
    };

    const handleGoToBookings = () => {
        navigate("/bookings");
    };

    // 🎉 MOSTRAR LOADING MIENTRAS PROCESA
    if (!paymentProcessed) {
        return (
            <div className="min-h-[90vh] flex justify-center items-center">
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <div className="text-center">
                        <CircularProgress color="inherit" />
                        <p className="mt-4 text-lg">Procesando tu pago...</p>
                        {isChilePayment && (
                            <p className="text-sm opacity-75">🇨🇱 Pago chileno detectado</p>
                        )}
                    </div>
                </Backdrop>
            </div>
        );
    }

    // 🇨🇱 MAPEO DE PROVEEDORES CHILENOS
    const getProviderInfo = (provider) => {
        const providers = {
            webpay: { name: 'WebPay Plus', icon: '🏦', color: '#E31837' },
            onepay: { name: 'OnePay', icon: '📱', color: '#FF6B35' },
            mercadopago: { name: 'Mercado Pago', icon: '💙', color: '#009EE3' },
            khipu: { name: 'Khipu', icon: '🦘', color: '#00A651' },
            flow: { name: 'Flow', icon: '💧', color: '#6B46C1' }
        };
        return providers[provider] || { name: 'Pago Seguro', icon: '💳', color: '#8B5CF6' };
    };

    const providerInfo = isChilePayment ? getProviderInfo(chileProvider) : { name: 'Razorpay', icon: '💳', color: '#8B5CF6' };

    // 🎉 MOSTRAR SUCCESS CUANDO YA PROCESÓ
    return (
        <div className="min-h-[90vh] flex justify-center items-center bg-gray-50">
            <div className="bg-white shadow-xl rounded-lg p-8 w-[90%] lg:w-[400px] text-center">
                {/* 🎉 ICONO DE SUCCESS */}
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* 🎉 MENSAJE DE SUCCESS */}
                <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Felicitaciones!</h1>
                <h2 className="text-xl text-gray-600 mb-6">Tu reserva fue exitosa</h2>
                
                {/* 💳 INFO DEL PROVEEDOR */}
                {isChilePayment && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-center mb-2">
                            <span className="text-2xl mr-2">{providerInfo.icon}</span>
                            <span className="font-semibold" style={{ color: providerInfo.color }}>
                                {providerInfo.name}
                            </span>
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                🇨🇱 CHILE
                            </span>
                        </div>
                    </div>
                )}
                
                {/* 📋 INFO ADICIONAL */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600">
                        <strong>Orden ID:</strong> {orderId}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        <strong>Pago ID:</strong> {paymentId.substring(0, 20)}...
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Recibirás un email de confirmación pronto.
                    </p>
                </div>

                {/* 🚀 BOTONES DE ACCIÓN */}
                <div className="space-y-3">
                    <Button 
                        onClick={handleGoToBookings} 
                        variant="contained"
                        fullWidth
                        sx={{ 
                            backgroundColor: '#8B5CF6', 
                            '&:hover': { backgroundColor: '#7C3AED' },
                            py: 1.5,
                            fontSize: '1rem'
                        }}
                    >
                        Ver Mis Reservas
                    </Button>
                    
                    <Button 
                        onClick={handleGoHome} 
                        variant="outlined"
                        fullWidth
                        sx={{ 
                            borderColor: '#8B5CF6', 
                            color: '#8B5CF6',
                            '&:hover': { 
                                borderColor: '#7C3AED', 
                                backgroundColor: '#F3F4F6' 
                            },
                            py: 1.5,
                            fontSize: '1rem'
                        }}
                    >
                        Explorar Más Salones
                    </Button>
                </div>

                {/* 📞 SOPORTE */}
                <p className="text-xs text-gray-500 mt-6">
                    ¿Problemas? <span className="text-purple-600 cursor-pointer">Contacta soporte</span>
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccessHandler;