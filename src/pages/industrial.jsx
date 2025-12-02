import React from "react";

export default function ProyectosIndustriales() {
  const [filtroIndustrial, setFiltroIndustrial] = React.useState("todos");


  const terrenosIndustriales = [
  { size: "20m x 30m", desc: "Ideal para plataforma logística pequeña.", tipo: "plataformas" },
  { size: "30m x 40m", desc: "Terreno común para bodegas medianas.", tipo: "bodegas" },
  { size: "50m x 60m", desc: "Perfecto para naves industriales grandes.", tipo: "naves" },
  { size: "10m x 20m", desc: "Local comercial o mini-bodega urbana.", tipo: "locales" },
  { size: "80m x 100m", desc: "Amplios para complejos industriales.", tipo: "plataformas" }
];
  const proyectosIndustriales = [
  {
    id: 1,
    titulo: "Bodega logística 800m²",
    descripcion: "Diseño estructural y distribución para almacenamiento de mercancía.",
    imagenes: [
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
      "https://images.unsplash.com/photo-1581091012184-5c7b74ba0b9a",
      "https://images.unsplash.com/photo-1581091870627-3af63bff9d70"
    ],
    iframe: "https://planner5d.onelink.me/stDT/oetz5yoj"
  },
  {
    id: 2,
    titulo: "Local comercial moderno",
    descripcion: "Espacio optimizado para comercios y atención al público.",
    imagenes: [
      "https://images.unsplash.com/photo-1529429617124-95b109e86bb8",
      "https://images.unsplash.com/photo-1556912998-c57cc6b63cf8",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc"
    ],
    iframe: "https://planner5d.onelink.me/stDT/oetz5yoj"
  }
];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 mt-32">
  {/* TÍTULO PRINCIPAL INDUSTRIAL */}
  <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
    Proyectos Industriales
  </h1>

  {/* PROYECTOS INDUSTRIALES */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
    {proyectosIndustriales.map((p) => (
      <div
        key={p.id}
        className="bg-white rounded-2xl shadow-lg border p-6 transition-transform duration-300 hover:scale-105"
      >
        <h2 className="text-2xl font-semibold mb-3 text-gray-900">
          {p.titulo}
        </h2>

        <p className="text-gray-600 mb-4">{p.descripcion}</p>

        {/* Collage de imágenes */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {p.imagenes.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="foto industrial"
              className="w-full h-28 object-cover rounded-lg shadow"
            />
          ))}
        </div>

        {/* Preview con iframe */}
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

  {/* ============================ */}
  {/*      TERRENOS INDUSTRIALES     */}
  {/* ============================ */}

  <div className="mt-20">
    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
      Sugerencias de Terrenos Industriales en Colombia
    </h2>

    <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
      Explora las medidas más comunes para bodegas, naves industriales
      y locales comerciales en Colombia.
    </p>

    {/* Filtros Industriales */}
    <div className="flex flex-wrap justify-center gap-4 mb-10">
      {[
        { id: "todos", label: "Todos" },
        { id: "bodegas", label: "Bodegas" },
        { id: "naves", label: "Naves industriales" },
        { id: "locales", label: "Locales comerciales" },
        { id: "plataformas", label: "Plataformas logísticas" }
      ].map((f) => (
        <button
          key={f.id}
          onClick={() => setFiltroIndustrial(f.id)}
          className={`px-4 py-2 rounded-full border shadow-sm transition-all duration-200 ${
            filtroIndustrial === f.id
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>

    {/* Terrenos Industriales Filtrados */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {terrenosIndustriales
        .filter((t) => filtroIndustrial === "todos" || t.tipo === filtroIndustrial)
        .map((t, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border shadow-sm transition-transform duration-300 hover:scale-105"
          >
            <h3 className="text-xl font-semibold text-gray-800 text-center">
              {t.size}
            </h3>
            <p className="text-center text-gray-600 mt-2">{t.desc}</p>
          </div>
        ))}
    </div>
  </div>
</div>
  );
}
