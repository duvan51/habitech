import { useState, useEffect } from "react";
import defaultConfig from "./defaultConfig";

/**
 * Hook para manejar la configuración dinámica del sitio.
 * Permite traer la config desde el SDK si existe,
 * y si no, usa la config por defecto.
 */
export default function useConfig() {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    if (window && window.dataSdk && window.dataSdk.getConfig) {
      const sdkConfig = window.dataSdk.getConfig();
      if (sdkConfig) {
        setConfig({ ...defaultConfig, ...sdkConfig });
      }
    }
  }, []);

  return config;
}
