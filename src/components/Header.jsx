import React from "react";
import { Link } from "react-router-dom";

export default function Header({ config }) {
  return (
    <header
      className="w-full border-b-4"
      style={{ borderColor: config.primary_action_color }}
    >
      <nav className="w-full" style={{ backgroundColor: config.surface_color }}>
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="rounded p-2 flex items-center justify-center"
              style={{ backgroundColor: config.primary_action_color }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect x="3" y="8" width="6" height="11" rx="1" fill="#ffffff" />
                <rect x="9" y="5" width="6" height="14" rx="1" fill="#ffffff" />
                <rect
                  x="15"
                  y="10"
                  width="6"
                  height="9"
                  rx="1"
                  fill="#ffffff"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span
                id="brand-name"
                className="text-white font-bold tracking-wide text-xl"
              >
                HABITECH
              </span>
              <span id="brand-tagline" className="text-white text-sm">
                Constructora de confianza
              </span>
            </div>
          </div>

          <div className="hidden md:flex gap-8 text-base">
            <Link
              to="/hogar"
              className="text-white hover:text-orange-300 font-medium"
              style={{  }}
            >
              Hogar
            </Link>
            
            <Link
              to="/Industrial"
              className="text-white hover:text-orange-300 font-medium"
              style={{  }}
            >
              Industrial
            </Link>
            <Link
              to="/remodelaciones"
              className="text-white hover:text-orange-300 font-medium"
              style={{  }}
            >
              Remodelaciones
            </Link>
            <Link
              to="/terrenoVentas"
              className="text-white hover:text-orange-300 font-medium"
              style={{  }}
            >
              Terrenos
            </Link>
            <Link
              to="/nosotros"
              className="text-white hover:text-orange-300 font-medium"
              style={{  }}
            >
              Nosotros
            </Link>
            
          </div>

          <a
            href="#contacto"
            id="nav-cta"
            className="hidden md:inline-flex px-5 py-2.5 rounded font-bold shadow-lg"
            style={{
              backgroundColor: config.primary_action_color,
              color: "#ffffff",
            }}
          >
            Solicitar presupuesto
          </a>
        </div>
      </nav>
    </header>
  );
}
