import React from "react";
import { Link } from "react-router-dom";

export default function Portafolio() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24 pb-12 items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        {/* Animated Construction Icon Base */}
        <div className="w-32 h-32 bg-orange-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-orange-400 rounded-[2rem] animate-ping opacity-20"></div>
            <span className="text-6xl absolute z-10">🚧</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-[#172c34] tracking-tight mb-4">
          Página en Construcción
        </h1>
        <p className="text-gray-500 font-medium text-lg mb-8 leading-relaxed">
          Nuestros arquitectos y desarrolladores están trabajando duro para presentar nuestro portafolio de proyectos completos. ¡Vuelve pronto para descubrir desarrollos increíbles!
        </p>

        <Link 
          to="/" 
          className="inline-block bg-[#172c34] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-orange-600 active:scale-95 transition-all shadow-xl"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
