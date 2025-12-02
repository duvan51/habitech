import React, { useEffect } from "react";
import defaultConfig from "../hooks/defaultConfig";
import useConfig from "../hooks/useConfig";
import { useDataSdk } from "../hooks/useDataSdk";

import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Projects from "../components/Projects";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

export default function App() {
  const config = useConfig();
  useDataSdk(); // solo inicializa el SDK global

  useEffect(() => {
    // Si existe elementSdk, escucha cambios remotos de configuración
    if (!window || !window.elementSdk) return;

    window.elementSdk.init &&
      window.elementSdk.init({
        defaultConfig,
        onConfigChange: async (newCfg) => {
          setConfig((prev) => ({ ...defaultConfig, ...prev, ...newCfg }));
        }
      });
  }, []);

  return (
    <div id="app-root" className="w-full h-full bg-white flex flex-col">
      <main className="flex-1 w-full">
        <Hero config={config} />
        <Services config={config} />
        <Projects config={config} />
        <ContactForm config={config} />
      </main>
    </div>
  );
}
