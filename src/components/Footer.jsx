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
        <div className="flex flex-col items-center space-y-6 text-center">
          <img src="/logoHabitech.png" alt="Habitech Logo" className="h-32 w-auto" />
          <div className="space-y-2">
            <p className="text-white text-base font-semibold">
              {config.footer_texto}
            </p>
            <p className="text-white/60 text-xs font-medium tracking-wide uppercase">
              Pasión por la excelencia en construcción
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
