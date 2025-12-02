import React from "react";
import useConfig from "../hooks/useConfig";

const Nosotros = () => {
  const config = useConfig();

  return (
    <div id="app-root" className="w-full h-full bg-white flex flex-col">
      <main className="w-full max-w-6xl mx-auto px-4 py-16 space-y-20">
        {/* QUIÉNES SOMOS */}
        <section className="space-y-6">
          <h1
            className="text-4xl font-bold"
            style={{ color: config.surface_color }}
          >
            Quiénes Somos
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: config.surface_color }}
          >
            En Habitech somos una constructora comprometida con el desarrollo
            responsable, la calidad estructural y la transparencia en cada
            proyecto. Durante más de una década hemos acompañado a familias,
            empresas y emprendedores en la construcción de hogares, bodegas,
            espacios comerciales y remodelaciones integrales.
          </p>
          <p
            className="text-lg leading-relaxed"
            style={{ color: config.surface_color }}
          >
            Creemos en el diseño inteligente, la ingeniería responsable y la
            comunicación constante con nuestros clientes. Nuestro trabajo
            combina experiencia, eficiencia y una visión humana del proceso
            constructivo.
          </p>
        </section>

        {/* MISIÓN */}
        <section className="space-y-6">
          <h2
            className="text-3xl font-bold"
            style={{ color: config.primary_action_color }}
          >
            Nuestra Misión
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ color: config.surface_color }}
          >
            Diseñar y construir proyectos que mejoren la vida de las personas,
            garantizando calidad, cumplimiento y soluciones eficientes que se
            adapten a las necesidades reales de cada cliente. Buscamos que cada
            proyecto sea funcional, seguro y con alto valor a largo plazo.
          </p>
        </section>

        {/* VISIÓN */}
        <section className="space-y-6">
          <h2
            className="text-3xl font-bold"
            style={{ color: config.primary_action_color }}
          >
            Nuestra Visión
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ color: config.surface_color }}
          >
            Ser una constructora reconocida a nivel nacional por la excelencia
            en diseño, la innovación, la eficiencia constructiva y la confianza
            de nuestros clientes. Queremos impulsar proyectos que contribuyan al
            desarrollo sostenible y al bienestar comunitario.
          </p>
        </section>

        {/* VALORES */}
        <section className="space-y-6">
          <h2
            className="text-3xl font-bold"
            style={{ color: config.primary_action_color }}
          >
            Nuestros Valores
          </h2>
          <ul
            className="space-y-3 text-lg"
            style={{ color: config.surface_color }}
          >
            <li>• Transparencia en todo el proceso constructivo.</li>
            <li>• Compromiso con la calidad y los tiempos de entrega.</li>
            <li>• Comunicación constante con el cliente.</li>
            <li>• Innovación en diseño y materiales.</li>
            <li>• Responsabilidad social y ambiental.</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Nosotros;
