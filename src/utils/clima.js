// Traduce los códigos de clima WMO que entrega Open-Meteo a un ícono de
// Bootstrap Icons y una descripción en español.
// Tabla oficial: https://open-meteo.com/en/docs (sección "WMO Weather interpretation codes").

const CODIGOS = [
  { codigos: [0], icono: "bi-sun", texto: "Despejado" },
  { codigos: [1, 2], icono: "bi-cloud-sun", texto: "Parcialmente nublado" },
  { codigos: [3], icono: "bi-clouds", texto: "Nublado" },
  { codigos: [45, 48], icono: "bi-cloud-fog2", texto: "Neblina" },
  { codigos: [51, 53, 55, 56, 57], icono: "bi-cloud-drizzle", texto: "Llovizna" },
  { codigos: [61, 63, 65, 66, 67, 80, 81, 82], icono: "bi-cloud-rain-heavy", texto: "Lluvia" },
  { codigos: [71, 73, 75, 77, 85, 86], icono: "bi-cloud-snow", texto: "Nieve" },
  { codigos: [95, 96, 99], icono: "bi-cloud-lightning-rain", texto: "Tormenta" }
];

export function describirClima(codigo) {
  return (
    CODIGOS.find((c) => c.codigos.includes(codigo)) || { icono: "bi-cloud", texto: "Sin datos" }
  );
}

// Probabilidad de precipitación (%) desde la que se considera riesgo de lluvia.
export const UMBRAL_LLUVIA = 40;

export function hayRiesgoLluvia(climaHora) {
  return Boolean(climaHora) && climaHora.probLluvia >= UMBRAL_LLUVIA;
}
