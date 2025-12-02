import React from "react";

export default function Services({ config }) {
  const services = [
    {
      icon: "🏠",
      title: config.beneficio_1_titulo,
      text: config.beneficio_1_texto,
    },
    {
      icon: "🏭",
      title: config.beneficio_2_titulo,
      text: config.beneficio_2_texto,
    },
    {
      icon: "🔨",
      title: config.beneficio_3_titulo,
      text: config.beneficio_3_texto,
    },
  ];

  return (
    <section id="servicios" className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-10">
        {/* Título */}
        <div className="text-center max-w-2xl mx-auto">
          <h2
            className="font-bold text-3xl mb-3"
            style={{ color: config.surface_color }}
          >
            Nuestros Servicios
          </h2>
          <p className="text-lg" style={{ color: config.surface_color }}>
            Soluciones completas de construcción para cada necesidad
          </p>
        </div>

        {/* Items */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, idx) => (
            <article
              key={idx}
              className="
    rounded-lg border-2 p-6 flex flex-col gap-4 bg-white shadow-sm 
    transition-transform duration-300 hover:scale-105
  "
              style={{ borderColor: "#e5e7eb" }}
            >
              {/* Ícono */}
              <div
                className="w-16 h-16 rounded flex items-center justify-center mx-auto shadow"
                style={{ backgroundColor: config.primary_action_color }}
              >
                <span className="text-white text-3xl">{s.icon}</span>
              </div>

              {/* Título */}
              <h3
                className="font-bold text-xl text-center"
                style={{ color: config.surface_color }}
              >
                {s.title}
              </h3>

              {/* Descripción */}
              <p
                className="text-base text-center leading-relaxed"
                style={{ color: config.surface_color }}
              >
                {s.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
