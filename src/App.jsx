import React, { useEffect } from "react";
import defaultConfig from "./hooks/defaultConfig";
import useConfig from "./hooks/useConfig";
import { useDataSdk } from "./hooks/useDataSdk";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Nosotros from "./pages/Nosotros";
import Hogar from "./pages/Hogar";
import Industrial from "./pages/Industrial";
import Remodelaciones from "./pages/Remodelaciones";

import Terrenos from "./pages/Terrenos";
import TerrenoID from "./pages/TerrenoDetalles";


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
      <Header config={config} />
      <main className="flex-1 w-full">
        <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col gap-8">
              <Home />
            </div>
          }
        />
        <Route
          path="/Terrenos"
          element={
            <div className="flex flex-col gap-8">
              <Nosotros />
            </div>
          }
        />
        <Route
          path="/nosotros"
          element={
            <div className="flex flex-col gap-8">
              <Nosotros />
            </div>
          }
        />
        <Route
          path="/hogar"
          element={
            <div className="flex flex-col gap-8">
              <Hogar/>
            </div>
          }
        />
        <Route
          path="/Industrial"
          element={
            <div className="flex flex-col gap-8">
              <Industrial />
            </div>
          }
        />
        <Route
          path="/remodelaciones"
          element={
            <div className="flex flex-col gap-8">
              <Remodelaciones />
            </div>
          }
        />
         <Route
          path="/terrenoVentas"
          element={
            <div className="flex flex-col gap-8">
              <Terrenos />
            </div>
          }
        />
        <Route
          path="/terrenoVentas/:id"
          element={
            <div className="flex flex-col gap-8">
              <TerrenoID />
            </div>
          }
        />
        </Routes>
        
      </main>
      <Footer config={config} />
    </div>
  );
}
