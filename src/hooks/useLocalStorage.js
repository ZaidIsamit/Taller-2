import { useEffect, useState } from "react";

export function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave);
      if (guardado !== null) return JSON.parse(guardado);
    } catch {}
    return typeof valorInicial === "function" ? valorInicial() : valorInicial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {}
  }, [clave, valor]);

  return [valor, setValor];
}
