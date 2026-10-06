// Servicio de la API pública Open-Meteo (https://open-meteo.com/en/docs).
// No requiere clave. Entrega el pronóstico por hora para una coordenada,
// hasta 16 días hacia adelante.

import { HORAS, diferenciaDias, fechaISO } from "../utils/fechas.js";

const URL_BASE = "https://api.open-meteo.com/v1/forecast";
export const DIAS_MAXIMOS_PRONOSTICO = 15; // hoy + 15 = 16 días que entrega la API

// Caché en memoria: evita volver a pedir el mismo pronóstico (misma sede y fecha).
const cache = new Map();

export class FueraDeRangoError extends Error {}

export async function obtenerPronosticoPorHora(sede, fecha, signal) {
  const dias = diferenciaDias(fechaISO(), fecha);
  if (dias < 0 || dias > DIAS_MAXIMOS_PRONOSTICO) {
    throw new FueraDeRangoError("El pronóstico solo está disponible para los próximos 16 días.");
  }

  const clave = `${sede.id}|${fecha}`;
  if (cache.has(clave)) return cache.get(clave);

  const parametros = new URLSearchParams({
    latitude: sede.latitud,
    longitude: sede.longitud,
    hourly: "temperature_2m,precipitation_probability,weather_code",
    timezone: "America/Santiago",
    start_date: fecha,
    end_date: fecha
  });

  const respuesta = await fetch(`${URL_BASE}?${parametros}`, { signal });
  if (!respuesta.ok) {
    throw new Error(`Open-Meteo respondió con estado ${respuesta.status}`);
  }
  const json = await respuesta.json();
  const pronostico = transformarRespuesta(json);
  cache.set(clave, pronostico);
  return pronostico;
}

// La API entrega arreglos paralelos (time[], temperature_2m[], ...) para las 24 horas.
// Los convertimos a un objeto { 8: {...}, 9: {...}, ... } solo con el horario de la universidad,
// más un resumen del día para la tarjeta de clima.
function transformarRespuesta(json) {
  const { time, temperature_2m, precipitation_probability, weather_code } = json.hourly;
  const porHora = {};

  time.forEach((marca, i) => {
    const hora = Number(marca.slice(11, 13));
    if (!HORAS.includes(hora)) return;
    porHora[hora] = {
      temperatura: Math.round(temperature_2m[i]),
      probLluvia: precipitation_probability[i] ?? 0,
      codigo: weather_code[i]
    };
  });

  const valores = Object.values(porHora);
  const temperaturas = valores.map((v) => v.temperatura);
  const codigoMediodia = (porHora[13] || valores[0]).codigo;

  return {
    porHora,
    resumen: {
      minima: Math.min(...temperaturas),
      maxima: Math.max(...temperaturas),
      probLluviaMax: Math.max(...valores.map((v) => v.probLluvia)),
      codigo: codigoMediodia
    }
  };
}
