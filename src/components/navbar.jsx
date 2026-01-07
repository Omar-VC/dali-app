import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Marca + navegación */}
        <div className="flex items-center gap-6">
          <h1 className="font-semibold text-lg">DALI</h1>

          <Link to="/" className="text-sm text-gray-700 hover:underline">
            Dashboard
          </Link>

          <Link to="/money" className="text-sm text-gray-700 hover:underline">
            Dinero
          </Link>
        </div>

        {/* Usuario */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user?.email}
          </span>

          <button
            onClick={logout}
            className="text-sm text-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
