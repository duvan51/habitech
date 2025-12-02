import React, { useState, useEffect } from "react";
import { useDataSdk } from "../hooks/useDataSdk";




export default function ContactForm({ config }) {
  const { records, createRecord } = useDataSdk();
  const [state, setState] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tipo_proyecto: "",
    mensaje: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: false,
  });

  useEffect(() => {
    const summary = document.getElementById("submission-summary");
    const countSpan = document.getElementById("submission-count");

    if (!summary || !countSpan) return;

    if (records.length > 0) {
      summary.classList.remove("hidden");
      countSpan.textContent = records.length + " ";
    } else {
      summary.classList.add("hidden");
      countSpan.textContent = "";
    }
  }, [records]);

  function setFormState(isLoading, message, isError) {
    setStatus({
      loading: isLoading,
      message: message || "",
      error: !!isError,
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setState((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { nombre, email, telefono, tipo_proyecto, mensaje } = state;

    if (!nombre.trim() || !email.trim()) {
      setFormState(
        false,
        "Por favor completá al menos tu nombre y correo.",
        true
      );
      return;
    }

    if (!window || !window.dataSdk) {
      setFormState(
        false,
        "Formulario en modo demo. La base de datos no está disponible.",
        true
      );
      return;
    }

    setFormState(true, "Enviando tu consulta...", false);

    const record = {
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      tipo_proyecto,
      mensaje: mensaje.trim(),
      origen: "Landing Habitech",
      created_at: new Date().toISOString(),
    };

    const res = await createRecord(record);

    if (res && res.isOk) {
      setFormState(
        false,
        "¡Gracias! Recibimos tu consulta y te contactaremos muy pronto.",
        false
      );
      setState({
        nombre: "",
        email: "",
        telefono: "",
        tipo_proyecto: "",
        mensaje: "",
      });
    } else if (res && res.reason === "max-reached") {
      setFormState(
        false,
        "Se alcanzó el límite de consultas almacenadas. Eliminá algunas antes de continuar.",
        true
      );
    } else {
      setFormState(
        false,
        "Ocurrió un problema al guardar tu consulta. Intentá nuevamente.",
        true
      );
    }
  }

  return (
    <section
      id="contacto"
      className="w-full"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Título */}
          <div className="text-center space-y-4 mb-8">
            <h2
              className="font-bold text-3xl"
              style={{ color: config.surface_color }}
            >
              {config.form_titulo}
            </h2>

            <p
              className="text-lg leading-relaxed"
              style={{ color: config.surface_color }}
            >
              {config.form_subtitulo}
            </p>

            <div
              className="flex flex-wrap justify-center gap-4 text-base pt-2"
              style={{ color: config.surface_color }}
            >
              <span>✓ Atención personalizada</span>
              <span>✓ Sin compromiso</span>
              <span>✓ Presupuesto gratuito</span>
            </div>

            <div
              id="submission-summary"
              className="mt-4 text-sm hidden"
              style={{ color: config.surface_color }}
            >
              <span id="submission-count"></span> personas ya solicitaron
              información
            </div>
          </div>

          {/* Card */}
          <div
            className="rounded-lg border-2 p-8 bg-white"
            style={{ borderColor: "#e5e7eb" }}
          >
            <form
              id="lead-form"
              className="space-y-5"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Nombre */}
              <div className="space-y-2">
                <label
                  htmlFor="nombre"
                  className="block font-bold text-base"
                  style={{ color: config.surface_color }}
                >
                  Nombre completo *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className="w-full rounded border-2 text-base px-4 py-3 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    color: config.surface_color,
                  }}
                  placeholder="Escribe tu nombre"
                  value={state.nombre}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block font-bold text-base"
                  style={{ color: config.surface_color }}
                >
                  Correo electrónico *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded border-2 text-base px-4 py-3 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    color: config.surface_color,
                  }}
                  placeholder="tu@correo.com"
                  value={state.email}
                  onChange={handleChange}
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <label
                  htmlFor="telefono"
                  className="block font-bold text-base"
                  style={{ color: config.surface_color }}
                >
                  Teléfono de contacto
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  className="w-full rounded border-2 text-base px-4 py-3 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    color: config.surface_color,
                  }}
                  placeholder="Número de teléfono"
                  value={state.telefono}
                  onChange={handleChange}
                />
              </div>

              {/* Tipo proyecto */}
              <div className="space-y-2">
                <label
                  htmlFor="tipo_proyecto"
                  className="block font-bold text-base"
                  style={{ color: config.surface_color }}
                >
                  ¿Qué tipo de proyecto necesitas?
                </label>
                <select
                  id="tipo_proyecto"
                  name="tipo_proyecto"
                  className="w-full rounded border-2 text-base px-4 py-3 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    color: config.surface_color,
                  }}
                  value={state.tipo_proyecto}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="casa_tradicional">Casa tradicional</option>
                  <option value="casa_prefabricada">Casa prefabricada</option>
                  <option value="bodega_industrial">
                    Bodega o estructura industrial
                  </option>
                  <option value="remodelacion">Remodelación completa</option>
                  <option value="otro">Otro tipo de proyecto</option>
                </select>
              </div>

              {/* Mensaje */}
              <div className="space-y-2">
                <label
                  htmlFor="mensaje"
                  className="block font-bold text-base"
                  style={{ color: config.surface_color }}
                >
                  Cuéntanos sobre tu proyecto
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={4}
                  className="w-full rounded border-2 text-base px-4 py-3 focus:outline-none"
                  style={{
                    borderColor: "#d1d5db",
                    color: config.surface_color,
                  }}
                  placeholder="Describe ubicación, tamaño, plazos..."
                  value={state.mensaje}
                  onChange={handleChange}
                />
              </div>

              {/* Mensaje del formulario */}
              <div
                id="form-message"
                className="text-base font-medium"
                style={{
                  color: status.error
                    ? config.primary_action_color
                    : "#10b981",
                }}
              >
                {status.message}
              </div>

              {/* Botón enviar */}
              <button
                id="submit-button"
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-4 rounded font-bold text-lg text-white shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: config.primary_action_color }}
                disabled={status.loading}
              >
                {status.loading ? "Enviando..." : config.form_boton}
              </button>

              <p
                className="text-sm text-center"
                style={{ color: "#6b7280" }}
              >
                Al enviar este formulario aceptas que Habitech te contacte para
                brindarte información sobre tu proyecto.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
