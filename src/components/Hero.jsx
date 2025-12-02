import React from "react";

export default function Hero({ config }) {
  return (
    <section
      id="hero"
      className="w-full"
      style={{ backgroundColor: config.surface_color }}
    >
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
        
        {/* Texto principal */}
        <div className="space-y-6">
          <p
            className="uppercase tracking-[0.2em] text-xs font-semibold"
            style={{ color: config.primary_action_color }}
          >
            Constructora Habitech
          </p>

          <h1
            id="hero-title"
            className="text-white font-bold leading-tight text-4xl"
          >
            {config.hero_titulo}
          </h1>

          <p
            id="hero-subtitle"
            className="text-white text-lg leading-relaxed"
          >
            {config.hero_subtitulo}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <a
              id="hero-cta"
              href="#contacto"
              className="inline-flex justify-center px-6 py-3 rounded font-bold shadow-lg text-white text-lg"
              style={{ backgroundColor: config.primary_action_color }}
            >
              {config.hero_boton}
            </a>

            <p id="hero-secondary" className="text-white text-sm">
              Respuesta en menos de 24 horas hábiles.
            </p>
          </div>

          {/* Métricas */}
          <div
            className="grid grid-cols-3 gap-4 pt-6 border-t-2"
            style={{ borderColor: config.primary_action_color }}
          >
            <div>
              <p
                className="font-bold text-3xl"
                style={{ color: config.primary_action_color }}
              >
                +10
              </p>
              <p className="text-white text-sm">Años de experiencia</p>
            </div>

            <div>
              <p
                className="font-bold text-3xl"
                style={{ color: config.primary_action_color }}
              >
                +80
              </p>
              <p className="text-white text-sm">Proyectos ejecutados</p>
            </div>

            <div>
              <p
                className="font-bold text-3xl"
                style={{ color: config.primary_action_color }}
              >
                100%
              </p>
              <p className="text-white text-sm">Acompañamiento integral</p>
            </div>
          </div>
        </div>

        {/* Tarjeta lateral */}
        <aside
          className="card-elevated rounded-lg border-2 p-6 space-y-4 bg-white"
          style={{ borderColor: "#e5e7eb" }}
        >
          <h2
            className="font-bold text-xl"
            style={{ color: config.surface_color }}
          >
            Proyectos que combinan diseño, eficiencia y plusvalía
          </h2>

          <p
            className="text-base leading-relaxed"
            style={{ color: config.surface_color }}
          >
            Te acompañamos en todo el ciclo: anteproyecto, permisos,
            construcción y entrega final.
          </p>

          <div className="space-y-4">
            {[
              {
                title: "Diseño arquitectónico",
                text: "Propuestas funcionales y estéticas alineadas a tu presupuesto y al mercado.",
              },
              {
                title: "Gestión de obra",
                text: "Coordinamos equipos, plazos y calidad para que tu inversión esté siempre protegida.",
              },
              {
                title: "Entrega llave en mano",
                text: "Recibes tu proyecto listo para habitar o comercializar, con documentación al día.",
              },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1">
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-base font-bold"
                    style={{ backgroundColor: config.primary_action_color }}
                  >
                    {i + 1}
                  </span>
                </div>

                <div>
                  <p
                    className="font-bold text-base"
                    style={{ color: config.surface_color }}
                  >
                    {s.title}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: config.surface_color }}
                  >
                    {s.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
