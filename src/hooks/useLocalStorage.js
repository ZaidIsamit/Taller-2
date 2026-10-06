import { useEffect, useState } from "react";

// Igual que useState, pero guarda el valor en localStorage para que
// sobreviva al recargar la página. Si localStorage no está disponible
// (modo privado, bloqueado), funciona solo en memoria.
export function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave);
      if (guardado !== null) return JSON.parse(guardado);
    } catch {
      /* sin localStorage: se usa el valor inicial */
    }
    return typeof valorInicial === "function" ? valorInicial() : valorInicial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      /* modo solo memoria */
    }
  }, [clave, valor]);

  return [valor, setValor];
}
