import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://server-1t3z.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Intenta parsear la respuesta

      if (response.ok) {
        console.log("Respuesta del servidor:", data);

        if (data.user && data.user._id && data.user.role) {
          localStorage.setItem('userId', data.user._id);
          localStorage.setItem('userRole', data.user.role);
          console.log("ID del usuario guardado:", data.user._id);
          console.log("Rol del usuario guardado:", data.user.role);

          alert('✅ Login exitoso');
          navigate('/main');
        } else {
          throw new Error('Datos de usuario inválidos.');
        }
      } else {
        throw new Error(data.message || 'Error al iniciar sesión.');
      }
    } catch (err) {
      setError(err.message || 'No se pudo conectar al servidor. Inténtalo nuevamente más tarde.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Iniciar sesión</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Usuario</label>
            <input
              type="email"
              name="Correo electronico"
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
              value={password} // Aquí corregí el error
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
