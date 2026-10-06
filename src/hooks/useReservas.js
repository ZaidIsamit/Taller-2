import { useLocalStorage } from "./useLocalStorage.js";
import reservasIniciales from "../data/reservasIniciales.json";
import { fechaISO, sumarDias } from "../utils/fechas.js";

const CLAVE_STORAGE = "unab_reservas_v2";

// El JSON trae "diasDesdeHoy" en vez de una fecha fija, para que la demo
// siempre tenga reservas cerca del día actual.
function crearReservasSemilla() {
  const hoy = fechaISO();
  return reservasIniciales.map(({ diasDesdeHoy, ...reserva }) => ({
    ...reserva,
    fecha: sumarDias(hoy, diasDesdeHoy),
    creadaEn: Date.now()
  }));
}

// Concentra el estado de las reservas: la lista y la acción para crear una nueva.
export function useReservas() {
  const [reservas, setReservas] = useLocalStorage(CLAVE_STORAGE, crearReservasSemilla);

  function crearReserva(datos) {
    const nueva = { ...datos, id: `r${Date.now()}`, creadaEn: Date.now() };
    setReservas((actuales) => [...actuales, nueva]);
    return nueva;
  }

  return { reservas, crearReserva };
}
