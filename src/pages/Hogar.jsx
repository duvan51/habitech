import React from "react";

export default function ProyectosHogar() {
  // Proyectos con imágenes e iframe
  const proyectos = [
    {
      id: 1,
      titulo: "Casa Moderna Familiar",
      descripcion:
        "Un proyecto moderno con espacios amplios, luz natural y un diseño perfecto para familias.",
      imagenes: [
        "https://via.placeholder.com/300x200?text=Casa+Moderna+1",
        "https://via.placeholder.com/300x200?text=Casa+Moderna+2",
        "https://via.placeholder.com/300x200?text=Casa+Moderna+3",
      ],
      iframe: "https://planner5d.onelink.me/stDT/oetz5yoj",
    },
    {
      id: 2,
      titulo: "Hogar Minimalista",
      descripcion:
        "Diseño limpio y funcional pensado para quienes buscan un estilo de vida minimalista.",
      imagenes: [
        "https://via.placeholder.com/300x200?text=Minimalista+1",
        "https://via.placeholder.com/300x200?text=Minimalista+2",
        "https://via.placeholder.com/300x200?text=Minimalista+3",
      ],
      iframe: "https://planner5d.onelink.me/stDT/oetz5yoj",
    },
    {
      id: 3,
      titulo: "Casa de Campo",
      descripcion:
        "Un diseño cálido y acogedor inspirado en la tranquilidad y naturaleza del campo.",
      imagenes: [
        "https://via.placeholder.com/300x200?text=Casa+Campo+1",
        "https://via.placeholder.com/300x200?text=Casa+Campo+2",
        "https://via.placeholder.com/300x200?text=Casa+Campo+3",
      ],
      iframe: "https://planner5d.onelink.me/stDT/oetz5yoj",
    },
  ];

  // Estado para filtro de terrenos
  const [filtro, setFiltro] = React.useState("todos");

  // Terrenos por tipo
  const terrenos = [
    { size: "6m x 12m", desc: "Lote pequeño urbano.", tipo: "urbanos" },
    { size: "7m x 15m", desc: "Común en zonas residenciales.", tipo: "urbanos" },
    { size: "8m x 16m", desc: "Perfecto para casa en lote pequeño.", tipo: "urbanos" },
    { size: "10m x 20m", desc: "Terreno ideal para casas campestres.", tipo: "campestres" },
    { size: "12m x 25m", desc: "Terreno amplio en zona rural o campestre.", tipo: "campestres" },
    { size: "15m x 30m", desc: "Terreno grande para finca pequeña.", tipo: "fincas" },
    { size: "20m x 40m", desc: "Perfecto para finca o parcela amplia.", tipo: "fincas" },
    { size: "8m x 16m", desc: "Ideal para casa prefabricada modular.", tipo: "prefabricadas" },
    { size: "10m x 20m", desc: "Muy usado para prefabricadas grandes.", tipo: "prefabricadas" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* TÍTULO PRINCIPAL */}
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Proyectos de Hogar
      </h1>

      {/* PROYECTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {proyectos.map((p) => (
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
                  alt="foto proyecto"
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

      {/* SECCIÓN DE TERRENOS */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Sugerencias de Terrenos en Colombia
        </h2>

        <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
          Escoge el tipo de terreno más usado en Colombia según el tipo de
          vivienda que quieras construir.
        </p>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[
            { id: "todos", label: "Todos" },
            { id: "urbanos", label: "Urbanos" },
            { id: "campestres", label: "Campestres" },
            { id: "fincas", label: "Fincas" },
            { id: "prefabricadas", label: "Prefabricadas" }
          ].map((f) => (
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

        {/* Terrenos filtrados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {terrenos
            .filter((t) => filtro === "todos" || t.tipo === filtro)
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
