import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Bienvenido</h2>
        <div className="space-y-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full p-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate("/registro")}
            className="w-full p-3 text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
