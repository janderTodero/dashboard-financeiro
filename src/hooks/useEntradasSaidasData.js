import { useMemo } from "react";

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export default function useEntradasSaidasData(transactions, mesSelecionado) {
  return useMemo(() => {
    if (!transactions) return null;

    const mesesAno = Array(12).fill(0).map(() => ({ entradas: 0, saidas: 0 }));

    transactions.forEach(({ type, amount, date }) => {
      const dt = new Date(date);
      if (dt.getFullYear() === mesSelecionado.ano) {
        const m = dt.getMonth();
        if (type === "income") mesesAno[m].entradas += amount;
        else if (type === "expense") mesesAno[m].saidas += amount;
      }
    });

    return {
      labels: meses,
      datasets: [
        {
          label: "Entradas",
          data: mesesAno.map((m) => m.entradas),
          backgroundColor: "#4BC0C0",
        },
        {
          label: "Saídas",
          data: mesesAno.map((m) => m.saidas),
          backgroundColor: "#FF6384",
        },
      ],
    };
  }, [transactions, mesSelecionado]);
}
