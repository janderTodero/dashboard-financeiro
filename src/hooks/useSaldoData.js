import { useMemo } from "react";
import { parseDate } from "../utils/format";

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export default function useSaldoData(transactions, mesSelecionado, closingDay = 31) {
  return useMemo(() => {
    if (!transactions) return null;

    const mesesAno = Array(12).fill(0).map(() => ({ entradas: 0, saidas: 0 }));

    transactions.forEach(({ type, amount, date }) => {
      const dt = parseDate(date);
      let cycleMonth = dt.getMonth();
      let cycleYear = dt.getFullYear();

      if (closingDay < 30 && dt.getDate() > closingDay) {
        cycleMonth = (cycleMonth + 1) % 12;
        if (dt.getMonth() === 11) {
          cycleYear++;
        }
      }

      if (cycleYear === mesSelecionado.ano) {
        if (type === "income") mesesAno[cycleMonth].entradas += amount;
        else if (type === "expense") mesesAno[cycleMonth].saidas += amount;
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
  }, [transactions, mesSelecionado, closingDay]);
}
