import React, { useState } from "react";

export default function Remodelaciones() {
  const [filtro, setFiltro] = useState("todos");

  // PROYECTOS DE REMODELACIÓN
  const proyectos = [
    {
      id: 1,
      titulo: "Ampliación de segundo piso",
      descripcion: "Refuerzo estructural, columnas nuevas y ampliación habitable.",
      imagenes: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
        "https://images.unsplash.com/photo-1502005097973-6a7082348e28"
      ],
      iframe: "https://planner5d.onelink.me/stDT/oetz5yoj",
      tipo: "estructura"
    },
    {
      id: 2,
      titulo: "Construcción de piscina",
      descripcion: "Piscina moderna con borde infinito y acabados premium.",
      imagenes: [
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
        "https://images.unsplash.com/photo-1551958219-acbc608c6377",
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4"
      ],
      iframe: "https://planner5d.onelink.me/stDT/nezfafwq",
      tipo: "piscinas"
    },
    {
      id: 3,
      titulo: "Remodelación de cocina",
      descripcion: "Cocina integral moderna con iluminación LED y mármol.",
      imagenes: [
        "https://images.unsplash.com/photo-1556912167-f556f1f39fdf",
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
        "https://images.unsplash.com/photo-1501183638710-841dd1904471"
      ],
      iframe: "https://planner5d.onelink.me/stDT/oetz5yoj",
      tipo: "interiores"
    },
    {
      id: 4,
      titulo: "Pintura general + rediseño moderno",
      descripcion: "Actualización completa de pintura, iluminación y espacios.",
      imagenes: [
        "https://images.unsplash.com/photo-1551970634-747846a548cb",
        "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1",
        "https://images.unsplash.com/photo-1549187774-b4e9b0445b06"
      ],
      iframe: "https://planner5d.onelink.me/stDT/nezfafwq",
      tipo: "pintura"
    }
  ];

  // FILTROS PARA EL USUARIO
  const filtros = [
    { id: "todos", label: "Todos" },
    { id: "estructura", label: "Obras Grises / Estructura" },
    { id: "piscinas", label: "Piscinas" },
    { id: "interiores", label: "Interiores" },
    { id: "pintura", label: "Pintura y Acabados" }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">

      {/* TÍTULO PRINCIPAL */}
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Remodelaciones y Obras Civiles
      </h1>

      {/* DESCRIPCIÓN */}
      <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Aquí encontrarás proyectos de ampliación, obras grises, piscinas,
        rediseño de interiores, pintura, y remodelaciones completas.
      </p>

      {/* FILTROS */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {filtros.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`px-4 py-2 rounded-full border shadow-sm transition-all duration-200 ${
              filtro === f.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* PROYECTOS FILTRADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {proyectos
          .filter((p) => filtro === "todos" || p.tipo === filtro)
          .map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-lg border p-6 transition-transform duration-300 hover:scale-105"
            >
              <h2 className="text-2xl font-semibold mb-3 text-gray-900">
                {p.titulo}
              </h2>

              <p className="text-gray-600 mb-4">{p.descripcion}</p>

              {/* COLLAGE */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {p.imagenes.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="remodelación"
                    className="w-full h-28 object-cover rounded-lg shadow"
                  />
                ))}
              </div>

              {/* PREVIEW (iframe) */}
              <details className="mt-4 cursor-pointer">
                <summary className="text-blue-600 font-medium underline">
                  Ver planos y vista previa
                </summary>

                <div className="mt-4">
                  <iframe
                    src={p.iframe}
                    style={{ width: "100%", height: "400px", border: "none" }}
                    allowFullScreen
                  ></iframe>
                </div>
              </details>
            </div>
          ))}
      </div>

      {/* SECCIÓN IDEAS/CATEGORÍAS */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Ideas de Remodelación por Categoría
        </h2>

        <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
          Selecciona el tipo de remodelación más común según tu necesidad.
        </p>

        {/* TARJETAS DE CATEGORÍAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { titulo: "Obras Grises", desc: "Columnas, muros, ampliaciones" },
            { titulo: "Piscinas", desc: "Construcción y diseño personalizado" },
            { titulo: "Interiores", desc: "Cocinas, baños, iluminación" },
            { titulo: "Pintura", desc: "Acabados profesionales" },
            { titulo: "Segundos pisos", desc: "Ampliaciones estructurales" },
            { titulo: "Rediseño Completo", desc: "Renovación total del hogar" }
          ].map((cat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border shadow-sm transition-transform duration-300 hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-gray-800 text-center">
                {cat.titulo}
              </h3>
              <p className="text-center text-gray-600 mt-2">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
