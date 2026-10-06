import { useLocalStorage } from "./useLocalStorage.js";
import reservasIniciales from "../data/reservasIniciales.json";
import { fechaISO, sumarDias } from "../utils/fechas.js";

const CLAVE_STORAGE = "unab_reservas_v2";

function crearReservasSemilla() {
  const hoy = fechaISO();
  return reservasIniciales.map(({ diasDesdeHoy, ...reserva }) => ({
    ...reserva,
    fecha: sumarDias(hoy, diasDesdeHoy),
    creadaEn: Date.now()
  }));
}

export function useReservas() {
  const [reservas, setReservas] = useLocalStorage(CLAVE_STORAGE, crearReservasSemilla);

  function crearReserva(datos) {
    const nueva = { ...datos, id: `r${Date.now()}`, creadaEn: Date.now() };
    setReservas((actuales) => [...actuales, nueva]);
    return nueva;
  }

  return { reservas, crearReserva };
}
