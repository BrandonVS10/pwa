import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import keys from '../keys.json';

export async function registerServiceWorkerAndSubscribe() {
  // Recuperar usuario del localStorage
  let user = JSON.parse(localStorage.getItem('user'));
  console.log('🧠 Usuario recuperado del localStorage:', user);

  // Solo continuar si el usuario ha iniciado sesión
  if (!user) {
    console.warn('❌ Usuario no autenticado. No se registrará la notificación.');
    return;
  }

  if ('serviceWorker' in navigator) {
    try {
      // Registrar el Service Worker
      const registro = await navigator.serviceWorker.register('./sw.js', { type: 'module' });

      // Verificar el estado de los permisos de notificación
      if (Notification.permission === 'granted') {
        // Si ya se otorgó el permiso, suscribirse directamente
        await subscribeToPushNotifications(registro, user);
      } else if (Notification.permission === 'default') {
        // Si no se ha pedido el permiso, solicitarlo una vez
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          await subscribeToPushNotifications(registro, user);
        } else {
          console.warn('❌ El usuario no ha concedido permisos para notificaciones');
        }
      } else {
        console.warn('❌ El usuario ha denegado los permisos de notificación');
      }
    } catch (error) {
      console.error('❌ Error al registrar Service Worker o suscripción:', error);
    }
  }
}

const subscribeToPushNotifications = async () => {
  try {
    const subscription = await getSubscription(); // Obtener suscripción de Push
    const userId = localStorage.getItem("userId"); // Obtener el userId

    // Verificar si la suscripción tiene los datos completos
    if (!subscription || !subscription.endpoint || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth || !userId) {
      throw new Error('Faltan datos para la suscripción');
    }

    const response = await axios.post("https://server-1t3z.onrender.com/auth/subscribe", {
      subscription,
      userId
    });

    console.log("✅ Respuesta del backend:", response.data);
  } catch (error) {
    console.error("❌ Error al suscribir:", error.message);
  }
};


// Inicializar IndexedDB
let db = window.indexedDB.open('database');

db.onupgradeneeded = event => {
  let result = event.target.result;
  if (!result.objectStoreNames.contains('libros')) {
    result.createObjectStore('libros', { autoIncrement: true });
  }
};

function Main() {
  useEffect(() => {
    // Registra el service worker y suscribe al usuario a notificaciones
    registerServiceWorkerAndSubscribe();
  }, []);

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
