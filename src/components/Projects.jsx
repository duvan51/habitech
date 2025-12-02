import React from "react";

export default function Projects({ config }) {
  return (
    <section
      id="proyectos"
      className="w-full border-t-4"
      style={{
        borderColor: config.primary_action_color,
        backgroundColor: "#f8f9fa",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
        {/* Text Section */}
        <div className="space-y-4">
          <h2
            className="font-bold text-2xl"
            style={{ color: config.surface_color }}
          >
            Proyectos pensados para hoy y para el futuro
          </h2>

          <p
            className="text-base leading-relaxed"
            style={{ color: config.surface_color }}
          >
            Viviendas unifamiliares, edificios residenciales, locales
            comerciales y desarrollos mixtos. En Habitech analizamos el
            contexto urbano, la normativa y la demanda real para que tu
            proyecto sea viable y rentable.
          </p>

          <ul
            className="space-y-2 text-base"
            style={{ color: config.surface_color }}
          >
            <li>• Acompañamiento desde el anteproyecto hasta la entrega.</li>
            <li>• Coordinación integral de gremios y especialistas.</li>
            <li>
              • Enfoque en habitabilidad, eficiencia energética y mantenimiento.
            </li>
          </ul>
        </div>

        {/* Right Card */}
        <div
          className="rounded-lg border-2 p-6 space-y-4 bg-white"
          style={{ borderColor: "#e5e7eb" }}
        >
          <h3
            className="font-bold text-lg"
            style={{ color: config.surface_color }}
          >
            ¿Tenés un terreno o una idea?
          </h3>

          <p
            className="text-base leading-relaxed"
            style={{ color: config.surface_color }}
          >
            Te ayudamos a definir qué tipo de desarrollo tiene más sentido para
            tu caso: metros construibles, tipologías, etapas y presupuesto
            realista.
          </p>

          <div
            className="text-sm"
            style={{ color: config.surface_color }}
          >
            <p>• Análisis inicial sin costo.</p>
            <p>• Propuesta de alcance y cronograma.</p>
            <p>• Estimación de inversión y retorno.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
