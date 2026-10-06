// Reglas de negocio de las reservas: qué horas ocupa cada una y si un bloque está libre.
import { HORAS, esHoraPasada } from "./fechas.js";

export function horasOcupadas(reserva) {
  return Array.from({ length: reserva.duracion }, (_, i) => reserva.hora + i);
}

export function reservaEnBloque(reservas, espacioId, fecha, hora) {
  return reservas.find(
    (r) => r.espacioId === espacioId && r.fecha === fecha && horasOcupadas(r).includes(hora)
  );
}

// Cuántas horas seguidas están libres desde horaInicio (sin pasar el cierre).
export function horasLibresConsecutivas(reservas, espacioId, fecha, horaInicio) {
  let horas = 0;
  for (const hora of HORAS.filter((h) => h >= horaInicio)) {
    if (reservaEnBloque(reservas, espacioId, fecha, hora)) break;
    horas++;
  }
  return horas;
}

// Estado visual de un bloque para el usuario actual: "pasado" | "mio" | "ocupado" | "libre"
export function estadoBloque(reservas, espacioId, fecha, hora, rutUsuario) {
  if (esHoraPasada(fecha, hora)) return "pasado";
  const reserva = reservaEnBloque(reservas, espacioId, fecha, hora);
  if (!reserva) return "libre";
  return reserva.rutSolicitante === rutUsuario ? "mio" : "ocupado";
}

// Estado de cada bloque del día para un espacio: { 8: "libre", 9: "ocupado", ... }
export function estadosDelDia(reservas, espacioId, fecha, rutUsuario) {
  return Object.fromEntries(
    HORAS.map((hora) => [hora, estadoBloque(reservas, espacioId, fecha, hora, rutUsuario)])
  );
}
