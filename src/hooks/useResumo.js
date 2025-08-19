import { useMemo } from "react";

export default function useResumo(transacoesFiltradas) {
  const entradas = useMemo(() => {
    return transacoesFiltradas
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transacoesFiltradas]);

  const saidas = useMemo(() => {
    return transacoesFiltradas
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transacoesFiltradas]);

  const total = entradas - saidas;

  return { entradas, saidas, total };
}
