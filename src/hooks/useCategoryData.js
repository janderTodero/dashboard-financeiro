import { useMemo } from "react";

export default function useCategoryData(transacoesFiltradas) {
  return useMemo(() => {
    if (!transacoesFiltradas || transacoesFiltradas.length === 0) return null;

    const despesas = transacoesFiltradas.filter((t) => t.type === "expense");
    const categoriasMap = despesas.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const labels = Object.keys(categoriasMap);
    const data = Object.values(categoriasMap);

    const generateColors = (num) =>
      Array.from(
        { length: num },
        (_, i) => `hsl(${(i * 360) / num}, 70%, 50%)`
      );

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: generateColors(labels.length),
          borderColor: "#1e1e1e",
          borderWidth: 1,
        },
      ],
    };
  }, [transacoesFiltradas]);
}
