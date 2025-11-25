import { useMemo } from "react";
import { parseDate } from "../utils/format";

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export default function useEntradasSaidasData(transactions, mesSelecionado, closingDay = 31) {
  return useMemo(() => {
    if (!transactions) return null;

    const mesesAno = Array(12).fill(0).map(() => ({ entradas: 0, saidas: 0 }));

    transactions.forEach(({ type, amount, date }) => {
      const dt = parseDate(date);
      let cycleMonth = dt.getMonth();
      // If using custom cycle and date is after closing day, it belongs to next month
      if (closingDay < 30 && dt.getDate() > closingDay) {
        cycleMonth = (cycleMonth + 1) % 12;
        // Note: We only care about the month index for the chart x-axis (Jan-Dec)
        // We filter by year in the parent component if needed, but this chart shows the whole year's trend usually?
        // Actually this chart seems to show data for the selected year.
        // Let's check if the year matches the selected year's cycle.

        // If it rolls over to next year (Dec -> Jan), we need to handle that if we are filtering by year.
        // But here we are just aggregating by month index 0-11.
        // So if it's Dec 26th and closing day is 25th, it counts as Jan (index 0).
      }

      // We only want to show data relevant to the selected year context?
      // The original code checked: if (dt.getFullYear() === mesSelecionado.ano)
      // With custom cycles, a transaction in Dec 2024 (after closing) belongs to Jan 2025 cycle.
      // So we should check the "cycle year".

      let cycleYear = dt.getFullYear();
      if (closingDay < 30 && dt.getDate() > closingDay) {
        if (dt.getMonth() === 11) {
          cycleYear++;
        }
      }

      if (cycleYear === mesSelecionado.ano) {
        if (type === "income") mesesAno[cycleMonth].entradas += amount;
        else if (type === "expense") mesesAno[cycleMonth].saidas += amount;
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
