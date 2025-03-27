import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    return () => {
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!isOnline) {
      setError('No estás conectado a Internet. Los datos se guardarán localmente.');
      insertIndexedDB({ email, nombre, password });
      return;
    }
  
    try {
      const response = await fetch('https://server-1t3z.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, nombre, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        setError(data.message || 'Error al registrarte.');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor. Inténtalo nuevamente.');
    }
  };

  function insertIndexedDB(data) {
    let dbRequest = window.indexedDB.open("database", 2); // Asegúrate de usar una versión específica
  
    dbRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
  
      // Crear el object store 'Usuarios' si no existe
      if (!db.objectStoreNames.contains("Usuarios")) {
        db.createObjectStore("Usuarios", { keyPath: "email" });
        console.log("✅ 'Usuarios' object store creado.");
      } else {
        console.log("⚠️ 'Usuarios' object store ya existe.");
      }
    };
  
    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
  
      // Verificar si el object store existe antes de insertar los datos
      if (db.objectStoreNames.contains("Usuarios")) {
        const transaction = db.transaction("Usuarios", "readwrite");
        const objStore = transaction.objectStore("Usuarios");
  
        const addRequest = objStore.add(data);
  
        addRequest.onsuccess = () => {
          console.log("✅ Datos insertados en IndexedDB:", addRequest.result);
  
          // Sincronizar datos si el navegador soporta Background Sync
          if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready
              .then((registration) => {
                console.log("Intentando registrar la sincronización...");
                return registration.sync.register("syncUsuarios");
              })
              .then(() => {
                console.log("✅ Sincronización registrada con éxito");
              })
              .catch((err) => {
                console.error("❌ Error registrando la sincronización:", err);
              });
          } else {
            console.warn("⚠️ Background Sync no es soportado en este navegador.");
          }
        };
  
        addRequest.onerror = () => {
          console.error("❌ Error insertando en IndexedDB");
        };
      } else {
        console.error("❌ El object store 'Usuarios' no existe.");
      }
    };
  
    dbRequest.onerror = () => {
      console.error("❌ Error abriendo IndexedDB");
    };
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          Registrar usuario
        </h2>
        {message && <p className="text-center text-red-600">{message}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Usuario</label>
            <input
              type="text"
              name="username"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Correo</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
