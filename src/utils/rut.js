// Utilidades para RUT chileno: limpiar (solo dígitos y K) y formatear con puntos y guion.

export function limpiarRut(valor) {
  return (valor || "").replace(/[^0-9kK]/g, "").toUpperCase().slice(0, 9);
}

export function formatearRut(valor) {
  const limpio = limpiarRut(valor);
  if (limpio.length < 2) return limpio;
  const cuerpo = limpio.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${cuerpo}-${limpio.slice(-1)}`;
}
