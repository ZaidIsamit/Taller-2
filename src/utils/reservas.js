import { HORAS, esHoraPasada } from "./fechas.js";

export function horasOcupadas(reserva) {
  return Array.from({ length: reserva.duracion }, (_, i) => reserva.hora + i);
}

export function reservaEnBloque(reservas, espacioId, fecha, hora) {
  return reservas.find(
    (r) => r.espacioId === espacioId && r.fecha === fecha && horasOcupadas(r).includes(hora)
  );
}

export function horasLibresConsecutivas(reservas, espacioId, fecha, horaInicio) {
  let horas = 0;
  for (const hora of HORAS.filter((h) => h >= horaInicio)) {
    if (reservaEnBloque(reservas, espacioId, fecha, hora)) break;
    horas++;
  }
  return horas;
}

export function estadoBloque(reservas, espacioId, fecha, hora, rutUsuario) {
  if (esHoraPasada(fecha, hora)) return "pasado";
  const reserva = reservaEnBloque(reservas, espacioId, fecha, hora);
  if (!reserva) return "libre";
  return reserva.rutSolicitante === rutUsuario ? "mio" : "ocupado";
}

export function estadosDelDia(reservas, espacioId, fecha, rutUsuario) {
  return Object.fromEntries(
    HORAS.map((hora) => [hora, estadoBloque(reservas, espacioId, fecha, hora, rutUsuario)])
  );
}
