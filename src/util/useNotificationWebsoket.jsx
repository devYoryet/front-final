// src/util/useNotificationWebsoket.jsx - HTTPS Fix
import React, { useEffect, useState } from 'react'
import SockJS from 'sockjs-client';
import { addNotification } from '../Redux/Notifications/action';
import { useDispatch, useSelector } from 'react-redux';
import Stomp from "stompjs";

const useNotificationWebsoket = (userId, type) => {
    const dispatch = useDispatch()
    const [stompClient, setStompClient] = useState(null);
    
    useEffect(() => {
        if (!userId) return; // Only connect if userId is available
    
        // 🚀 CONFIGURAR URL SEGÚN ENTORNO
        const isDevelopment = window.location.hostname === 'localhost';
        const wsUrl = isDevelopment 
            ? "http://localhost:5000/api/notifications/ws"
            : "https://34.203.37.29.sslip.io/api/notifications/ws"; // ✅ Dominio con SSL válido
            
        console.log('🔗 WebSocket URL:', wsUrl);
        
        const sock = new SockJS(wsUrl);
        const stomp = Stomp.over(sock);
        setStompClient(stomp);
    }, [userId]);

    useEffect(() => {
        if (stompClient) {
            stompClient.connect(
                {},
                () => {
                    stompClient.subscribe(
                        `/notification/${type}/${userId}`,
                        onMessageRecive,
                        (error) => {
                            console.error("Subscription error:", error);
                        }
                    );
                    console.log("Subscribed to notifications for user ID:", userId);
                },
                (error) => {
                    console.error("WebSocket error:", error);
                }
            );
        }

        return () => {
            if (stompClient?.connected) {
                stompClient.disconnect(() => {
                    console.log("Disconnected from WebSocket");
                });
            }
        };
    }, [stompClient, userId]);

    const onMessageRecive = (payload) => {
        console.log("New message received", payload);
        const receivedMessage = JSON.parse(payload.body);

        // Dispatch the new notification to Redux store
        dispatch(addNotification(receivedMessage));
    };
}

export default useNotificationWebsoket