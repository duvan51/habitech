import React, { useState } from "react";
import { Link } from "react-router-dom"; 

export default function VentaTerrenos() {
  const [filtroCiudad, setFiltroCiudad] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroCredito, setFiltroCredito] = useState("todos");
  const [filtroTamano, setFiltroTamano] = useState("todos");
  const [filtroPrecio, setFiltroPrecio] = useState("todos");

  const terrenos = [
    {
      id: 1,
      titulo: "Lote en Medellín - 7m x 15m",
      ciudad: "Medellín",
      tipo: "urbano",
      tamano: "7x15",
      precio: 120000000,
      credito: true,
      imagenes: [
        "https://images.unsplash.com/photo-1560184897-67f1b1c93a94",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      ],
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      desc: "Terreno urbano ideal para vivienda unifamiliar. Excelente ubicación y acceso a transporte.",
      contacto: "3001234567",
    },
    {
      id: 2,
      titulo: "Finca en Rionegro - 1000m²",
      ciudad: "Rionegro",
      tipo: "finca",
      tamano: "1000m",
      precio: 350000000,
      credito: false,
      imagenes: [
        "https://images.unsplash.com/photo-1501183007986-d0d080b147f9",
        "https://images.unsplash.com/photo-1528825871115-3581a5387919",
      ],
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      desc: "Hermosa finca con paisaje natural, zona de árboles y excelente clima.",
      contacto: "3129876543",
    },
    {
      id: 3,
      titulo: "Lote para casa campestre - Cali",
      ciudad: "Cali",
      tipo: "campestre",
      tamano: "500m",
      precio: 220000000,
      credito: true,
      imagenes: [
        "https://images.unsplash.com/photo-1472157592780-9d0f18272306",
        "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
      ],
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      desc: "Terreno perfecto para casa campestre en zona tranquila con buena vista.",
      contacto: "3015558899",
    },
  ];

  const filtrarTerrenos = terrenos.filter((t) => {
    return (
      (filtroCiudad === "todos" || t.ciudad === filtroCiudad) &&
      (filtroTipo === "todos" || t.tipo === filtroTipo) &&
      (filtroCredito === "todos" || t.credito === (filtroCredito === "si")) &&
      (filtroTamano === "todos" || t.tamano === filtroTamano) &&
      (filtroPrecio === "todos" ||
        (filtroPrecio === "bajo" && t.precio < 150000000) ||
        (filtroPrecio === "medio" &&
          t.precio >= 150000000 &&
          t.precio < 300000000) ||
        (filtroPrecio === "alto" && t.precio >= 300000000))
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* TÍTULO */}
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Venta de Terrenos en Colombia
      </h1>

      {/* FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12 bg-gray-100 p-5 rounded-xl shadow">
        {/* CIUDAD */}
        <select
          onChange={(e) => setFiltroCiudad(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="todos">Todas las ciudades</option>
          <option value="Medellín">Medellín</option>
          <option value="Rionegro">Rionegro</option>
          <option value="Cali">Cali</option>
        </select>

        {/* TIPO */}
        <select
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="todos">Todos los tipos</option>
          <option value="urbano">Urbano</option>
          <option value="campestre">Campestre</option>
          <option value="finca">Finca</option>
        </select>

        {/* TAMAÑO */}
        <select
          onChange={(e) => setFiltroTamano(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="todos">Todos los tamaños</option>
          <option value="7x15">7x15</option>
          <option value="500m">500m²</option>
          <option value="1000m">1000m²</option>
        </select>

        {/* PRECIO */}
        <select
          onChange={(e) => setFiltroPrecio(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="todos">Todos los precios</option>
          <option value="bajo">Menos de $150M</option>
          <option value="medio">$150M - $300M</option>
          <option value="alto">Más de $300M</option>
        </select>

        {/* CRÉDITO */}
        <select
          onChange={(e) => setFiltroCredito(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="todos">Crédito (Sí/No)</option>
          <option value="si">Acepta crédito</option>
          <option value="no">No acepta crédito</option>
        </select>
      </div>

      {/* LISTADO DE TERRENOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filtrarTerrenos.map((t) => (
          <div
            key={t.id}
            className="bg-white border rounded-2xl shadow p-4 transition-transform hover:scale-[1.02]"
          >
            <h2 className="text-xl font-bold mb-2">{t.titulo}</h2>
            <p className="text-gray-600 text-sm mb-4">{t.desc}</p>

            {/* GALERÍA */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {t.imagenes.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-full h-28 object-cover rounded-lg"
                />
              ))}
            </div>

            {/* VIDEO */}
            <details className="cursor-pointer">
              <summary className="text-blue-600 underline font-medium">
                Ver video del terreno
              </summary>

              <div className="mt-3">
                <iframe
                  src={t.video}
                  className="w-full h-56 rounded-lg"
                  allowFullScreen
                ></iframe>
              </div>
            </details>

            {/* INFO ADICIONAL */}
            <div className="mt-4 text-sm">
              <p>
                <strong>Ciudad:</strong> {t.ciudad}
              </p>
              <p>
                <strong>Tipo:</strong> {t.tipo}
              </p>
              <p>
                <strong>Tamaño:</strong> {t.tamano}
              </p>
              <p>
                <strong>Precio:</strong>{" "}
                <span className="text-green-700 font-semibold">
                  ${t.precio.toLocaleString()}
                </span>
              </p>
              <p>
                <strong>Acepta crédito:</strong>{" "}
                {t.credito ? "Sí" : "No"}
              </p>
            </div>

            {/* CONTACTO */}
            <a
              href={`https://wa.me/57${t.contacto}`}
              target="_blank"
              className="block w-full mt-5 bg-green-600 text-white text-center font-semibold py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              Contactar por WhatsApp
            </a>
            <Link to={`/terrenoVentas/${t.id}`}>Ver más</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
