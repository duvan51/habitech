import React from "react";

export default function TerrenoDetalle() {
  // Información simulada (en tu app vendrá por props o por API)
  const terreno = {
    titulo: "Terreno Campestre 1.200 m² en La Mesa, Cundinamarca",
    precio: "$145.000.000 COP",
    ciudad: "La Mesa, Cundinamarca",
    tamano: "1.200 m²",
    tipo: "Finca / Campestre",
    credito: "Sí acepta crédito",
    descripcion: `
      Hermoso terreno campestre ubicado a 10 minutos del casco urbano.
      Ideal para casa campestre, cabaña turística o proyecto de inversión.
      Cuenta con escritura, agua veredal y punto de energía cercano.
    `,
    imagenes: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
    ],
    video: "https://www.youtube.com/embed/ysz5S6PUM-U",
    vendedor: {
      nombre: "Inmobiliaria Verde Campo",
      telefono: "+57 320 555 8899",
      whatsapp: "3205558899",
    },
    ubicacionMapa:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.0511477853654!2d-74.463858!3d4.635366!2m3!1f0!2f0!3f0",
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">

      {/* TÍTULO */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
        {terreno.titulo}
      </h1>

      {/* PRECIO */}
      <p className="text-3xl text-green-600 font-extrabold text-center mb-10">
        {terreno.precio}
      </p>

      {/* GALERÍA DE IMÁGENES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
        {terreno.imagenes.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="foto terreno"
            className="w-full h-52 object-cover rounded-xl shadow"
          />
        ))}
      </div>

      {/* VIDEO */}
      <div className="w-full mb-14">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          Video del Terreno
        </h2>
        <iframe
          className="w-full h-72 md:h-96 rounded-xl shadow"
          src={terreno.video}
          allowFullScreen
        ></iframe>
      </div>

      {/* DESCRIPCIÓN */}
      <div className="mb-14">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          Descripción detallada
        </h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {terreno.descripcion}
        </p>
      </div>

      {/* CARACTERÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="bg-gray-100 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">
            Información del Terreno
          </h3>

          <ul className="text-gray-700 space-y-2">
            <li><strong>Ciudad:</strong> {terreno.ciudad}</li>
            <li><strong>Tamaño:</strong> {terreno.tamano}</li>
            <li><strong>Tipo:</strong> {terreno.tipo}</li>
            <li><strong>Crédito:</strong> {terreno.credito}</li>
          </ul>
        </div>

        {/* VENDEDOR */}
        <div className="bg-white border p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">
            Contacto del Vendedor
          </h3>

          <p className="text-gray-700 mb-4">
            {terreno.vendedor.nombre}
          </p>

          <a
            href={`tel:${terreno.vendedor.telefono}`}
            className="block w-full text-center mb-3 bg-blue-600 text-white py-2 rounded-lg font-medium"
          >
            Llamar
          </a>

          <a
            href={`https://wa.me/57${terreno.vendedor.whatsapp}`}
            target="_blank"
            className="block w-full text-center bg-green-600 text-white py-2 rounded-lg font-medium"
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* MAPA */}
      <div className="w-full mb-20">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          Ubicación aproximada
        </h2>
        <iframe
          src={terreno.ubicacionMapa}
          className="w-full h-72 rounded-xl shadow"
          allowFullScreen
        ></iframe>
      </div>

    </div>
  );
}
