import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        
        {/* Marca */}
        <h1 className="font-semibold text-lg">DALI</h1>

        {/* Botón hamburguesa en móvil */}
        <button
          className="sm:hidden text-gray-700 focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {/* Ícono simple */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Navegación en escritorio */}
        <div className="hidden sm:flex items-center gap-6">
          <Link to="/" className="text-sm text-gray-700 hover:underline">
            Dashboard
          </Link>
          <Link to="/money" className="text-sm text-gray-700 hover:underline">
            Dinero
          </Link>
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button onClick={logout} className="text-sm text-red-600">
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Menú desplegable en móvil */}
      {open && (
        <div className="sm:hidden px-4 pb-4 space-y-2">
          <Link to="/" className="block text-sm text-gray-700 hover:underline">
            Dashboard
          </Link>
          <Link to="/money" className="block text-sm text-gray-700 hover:underline">
            Dinero
          </Link>
          <span className="block text-sm text-gray-600">{user?.email}</span>
          <button onClick={logout} className="block text-sm text-red-600">
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}
