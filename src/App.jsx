import React, { useEffect } from "react";
import defaultConfig from "./hooks/defaultConfig";
import useConfig from "./hooks/useConfig";
import { useDataSdk } from "./hooks/useDataSdk";

import { Routes, Route, Navigate, useLocation } from "react-router-dom"

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

import Header from "./components/Header";
import Footer from "./components/Footer";

// Original Pages (Constructor)
import Home from "./pages/Home";
import Nosotros from "./pages/Nosotros";
import Hogar from "./pages/Hogar";
import Industrial from "./pages/industrial";
import Remodelaciones from "./pages/Remodelaciones";
import Terrenos from "./pages/Terrenos";
import TerrenoID from "./pages/TerrenoDetalles";

// New Marketplace & Auth Pages
import Marketplace from "./pages/Marketplace";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { useAuth } from "./hooks/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-screen italic">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && profile?.role !== 'admin' && profile?.role !== 'superadmin') return <Navigate to="/" />;

  return children;
};

export default function App() {
  const config = useConfig();
  useDataSdk();

  useEffect(() => {
    if (!window || !window.elementSdk) return;

    window.elementSdk.init &&
      window.elementSdk.init({
        defaultConfig,
        onConfigChange: async (newCfg) => {
          // Nota: setConfig no está definido aquí directamente, 
          // pero useConfig maneja el estado internamente si se le pasa el SDK.
        }
      });
  }, []);

  return (
    <div id="app-root" className="w-full h-full bg-white flex flex-col">
      <ScrollToTop />
      <Header config={config} />
      <main className="flex-1 w-full">
        <Routes>
          {/* Marketplace as Root */}
          <Route path="/" element={<Marketplace />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboards */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Original Habitech Constructor Section */}
          <Route path="/constructora" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/hogar" element={<Hogar />} />
          <Route path="/industrial" element={<Industrial />} />
          <Route path="/remodelaciones" element={<Remodelaciones />} />

          {/* Legacy Listings (from previous Habitech logic) */}
          <Route path="/terrenoVentas" element={<Terrenos />} />
          <Route path="/terrenoVentas/:id" element={<TerrenoID />} />
        </Routes>
      </main>
      <Footer config={config} />
    </div>
  );
}
