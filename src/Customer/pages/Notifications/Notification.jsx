// =============================================================================
// FRONTEND - Notification.jsx - SOLO CAMBIO MÍNIMO
// =============================================================================
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {
  addNotification,
} from "../../../Redux/Notifications/action";
import NotificationCard from "./NotificationCard";

const Notification = ({type}) => {
  const dispatch = useDispatch();
  const { auth, notification } = useSelector((store) => store);

  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    // 🔧 FIX: USAR URL DINÁMICA EN LUGAR DE LOCALHOST HARDCODED
    const API_URL = process.env.REACT_APP_API_URL || 'https://34.203.37.29:5000';
    console.log('🔌 Conectando WebSocket a:', `${API_URL}/api/notifications/ws`);
    
    const sock = new SockJS(`${API_URL}/api/notifications/ws`);
    const stomp = Stomp.over(sock);
    setStompClient(stomp);
  }, []);

  useEffect(() => {
    if (stompClient) {
      stompClient.connect(
        {},
        () => {
          if (auth.user?.id) {
            stompClient.subscribe(
              `/notification/user/${auth.user.id}`,
              onMessageRecive,
              (error) => {
                console.error("Subscription error:", error);
              }
            );
            console.log("✅ Subscribed to notifications for user:", auth.user.id);
          }
        },
        (error) => {
          console.error("❌ WebSocket connection error:", error);
        }
      );
    }

    // Cleanup function to disconnect WebSocket on unmount
    return () => {
      if (stompClient?.connected) {
        stompClient.disconnect(() => {
          console.log("🔌 WebSocket disconnected");
        });
      }
    };
  }, [stompClient, auth.user?.id]);

  const onMessageRecive = (payload) => {
    console.log("📨 New notification received:", payload);
    const receivedNotification = JSON.parse(payload.body);
    
    console.log("📋 Parsed notification:", receivedNotification);
    dispatch(addNotification(receivedNotification));
  };

  return (
    <div className="flex justify-center  px-5 md:px-20 py-5 md:py-10">
      <div className="space-y-5 w-full lg:w-1/2 ">
        <h1 className="text-2xl font-bold text-center">Notifications</h1>
        {notification.notifications && notification.notifications.length > 0 ? (
          notification.notifications.map((item) => (
            <NotificationCard type={type} key={item.id} item={item} />
          ))
        ) : (
          <div className="text-center text-gray-500">
            No hay notificaciones
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;