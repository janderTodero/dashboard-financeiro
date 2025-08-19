import { useMemo } from "react";

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export default function useSaldoData(transactions, mesSelecionado) {
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

    let saldoAcumulado = 0;
    const saldosPorMes = mesesAno.map(({ entradas, saidas }) => {
      saldoAcumulado += entradas - saidas;
      return saldoAcumulado;
    });

    return {
      labels: meses,
      datasets: [
        {
          label: "Saldo (R$)",
          data: saldosPorMes,
          borderColor: "#36A2EB",
          backgroundColor: "rgba(54, 162, 235, 0.3)",
          tension: 0.3,
        },
      ],
    };
  }, [transactions, mesSelecionado]);
}
