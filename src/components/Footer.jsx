import React from "react";
import { Link } from "react-router-dom";

export default function Footer({ config }) {
  return (
    <footer
      className="w-full border-t-4"
      style={{
        backgroundColor: config.surface_color,
        borderColor: config.primary_action_color,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-24 lg:pb-8">
        <div className="flex flex-col items-center space-y-6 text-center">
          <img src="/logoHabitech.png" alt="Habitech Logo" className="h-32 w-auto" />
          
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white/80">
            <Link to="/nosotros" className="hover:text-orange-400 transition-colors">
              Sobre Nosotros
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/" className="hover:text-orange-400 transition-colors">
              Marketplace
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/portafolio" className="hover:text-orange-400 transition-colors">
              Portafolio
            </Link>
          </div>

          <div className="space-y-2">
            <p className="text-white text-base font-semibold">
              {config.footer_texto}
            </p>
            <p className="text-white/60 text-xs font-medium tracking-wide uppercase">
              Pasión por la excelencia en construcción
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
