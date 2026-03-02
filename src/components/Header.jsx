import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { signOut } from "../api/auth";

export default function Header({ config }) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header
      className="w-full border-b-4"
      style={{ borderColor: config.primary_action_color }}
    >
      <nav className="w-full" style={{ backgroundColor: config.surface_color }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="rounded p-2 flex items-center justify-center"
              style={{ backgroundColor: config.primary_action_color }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-wide text-xl leading-tight">
                HABITECH
              </span>
              <span className="text-white text-xs opacity-80">
                Marketplace & Constructora
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex gap-6 text-sm items-center">
            <Link to="/" className="text-white hover:text-orange-300 font-medium">Marketplace</Link>
            <Link to="/constructora" className="text-white hover:text-orange-300 font-medium">Constructora</Link>
            <Link to="/nosotros" className="text-white hover:text-orange-300 font-medium">Nosotros</Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to={profile?.role === 'admin' ? "/admin" : "/dashboard"}
                  className="text-white hover:text-orange-300 font-medium text-sm"
                >
                  {profile?.role === 'admin' ? "Panel Admin" : "Mi Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded text-sm font-bold border border-white text-white hover:bg-white hover:text-gray-900 transition-all"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-orange-300 font-medium text-sm">Entrar</Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded font-bold shadow-lg text-sm"
                  style={{
                    backgroundColor: config.primary_action_color,
                    color: "#ffffff",
                  }}
                >
                  Regístrate
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
