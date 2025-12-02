import React from "react";

export default function Footer({ config }) {
  return (
    <footer
      className="w-full border-t-4"
      style={{
        backgroundColor: config.surface_color,
        borderColor: config.primary_action_color,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center space-y-3">
          <p className="text-white text-base font-medium">
            {config.footer_texto}
          </p>
          <p className="text-white text-sm">
            Construyendo con calidad y compromiso desde hace más de 10 años
          </p>
        </div>
      </div>
    </footer>
  );
}
