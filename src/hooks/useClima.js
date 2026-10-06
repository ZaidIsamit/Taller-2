import { useCallback, useEffect, useState } from "react";
import { FueraDeRangoError, obtenerPronosticoPorHora } from "../services/climaApi.js";

// Sincroniza el componente con la API de clima: cada vez que cambia la sede
// o la fecha se vuelve a consultar. Devuelve el estado de la consulta para
// que la interfaz muestre carga, error o los datos.
//   estado: "cargando" | "ok" | "error" | "fuera-de-rango"
export function useClima(sede, fecha) {
  const [resultado, setResultado] = useState({ estado: "cargando", datos: null });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!sede || !fecha) return;
    // AbortController cancela la petición si la sede/fecha cambia antes de
    // que llegue la respuesta, así no se muestran datos de una consulta vieja.
    const controlador = new AbortController();
    setResultado({ estado: "cargando", datos: null });

    obtenerPronosticoPorHora(sede, fecha, controlador.signal)
      .then((datos) => setResultado({ estado: "ok", datos }))
      .catch((error) => {
        if (error.name === "AbortError") return;
        const estado = error instanceof FueraDeRangoError ? "fuera-de-rango" : "error";
        setResultado({ estado, datos: null, mensaje: error.message });
      });

    return () => controlador.abort();
  }, [sede, fecha, intento]);

  const reintentar = useCallback(() => setIntento((n) => n + 1), []);

  return { ...resultado, reintentar };
}
