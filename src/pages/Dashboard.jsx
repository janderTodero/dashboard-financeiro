import { useState, useMemo } from "react";
import { useTransactions } from "../context/TransactionsContext";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import ResumoCard from "../components/ResumoCard";
import SeletorMes from "../components/SeletorMes";
import UltimasTransacoes from "../components/UltimasTransacoes";
import formatCurrency, { parseDate } from "../utils/format";
import ChartCard from "../components/ChartCard";

import useResumo from "../hooks/useResumo";
import useCategoryData from "../hooks/useCategoryData";
import useEntradasSaidasData from "../hooks/useEntradasSaidasData";
import useSaldoData from "../hooks/useSaldoData";
import DespesasPorCategoriaChart from "../components/DespesasPorCategoriaChart";
import TendenciaSaldoChart from "../components/TendenciaSaldoChart";
import EntradasSaidasChart from "../components/EntradasSaidasChart";
import { barOptions, doughnutOptions, lineOptions } from "../utils/chartOptions";
import LimiteGastosCard from "../components/LimiteGastosCard";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export default function Dashboard() {
  const { transactions, loading } = useTransactions();
  const navigate = useNavigate();
  const [limite, setLimite] = useState()

  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth();
  const anoAtual = dataAtual.getFullYear();

  const [mesSelecionado, setMesSelecionado] = useState({
    mes: mesAtual,
    ano: anoAtual,
  });
  const [closingDay, setClosingDay] = useState(31);

  const transacoesFiltradas = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((t) => {
      const dt = parseDate(t.date);

      // If standard calendar month (closing day >= 30)
      if (closingDay >= 30) {
        return (
          dt.getMonth() === mesSelecionado.mes &&
          dt.getFullYear() === mesSelecionado.ano
        );
      }

      // Custom cycle logic
      // A transaction belongs to the selected month/year cycle if:
      // 1. It is in the selected month AND day <= closingDay
      // 2. OR it is in the previous month AND day > closingDay

      const targetDate = new Date(mesSelecionado.ano, mesSelecionado.mes, 1);
      const cycleEnd = new Date(mesSelecionado.ano, mesSelecionado.mes, closingDay);
      // cycleStart is the day after closing day of previous month
      const cycleStart = new Date(mesSelecionado.ano, mesSelecionado.mes - 1, closingDay + 1);

      // We need to compare dates properly
      // parseDate already returns a date at 00:00:00 local time
      const tDate = dt;

      return tDate >= cycleStart && tDate <= cycleEnd;
    });
  }, [transactions, mesSelecionado, closingDay]);

  const { entradas, saidas, total } = useResumo(transacoesFiltradas);
  const categoryData = useCategoryData(transacoesFiltradas);
  const entradasSaidasData = useEntradasSaidasData(transactions, mesSelecionado, closingDay);
  const saldoData = useSaldoData(transactions, mesSelecionado, closingDay);

  const mesesDisponiveis = useMemo(() => {
    if (!transactions) return [];

    // For custom cycles, we determine which "cycle month" a transaction belongs to
    const combinacoes = transactions.reduce((acc, t) => {
      const dt = parseDate(t.date);
      let cycleMonth = dt.getMonth();
      let cycleYear = dt.getFullYear();

      if (closingDay < 30 && dt.getDate() > closingDay) {
        // Belongs to next month's cycle
        if (cycleMonth === 11) {
          cycleMonth = 0;
          cycleYear++;
        } else {
          cycleMonth++;
        }
      }

      const key = `${cycleYear}-${cycleMonth}`;
      if (!acc.includes(key)) acc.push(key);
      return acc;
    }, []);

    combinacoes.sort((a, b) => {
      const [anoA, mesA] = a.split("-").map(Number);
      const [anoB, mesB] = b.split("-").map(Number);
      if (anoA !== anoB) return anoB - anoA;
      return mesB - mesA;
    });

    return combinacoes.map((key) => {
      const [ano, mes] = key.split("-").map(Number);
      return { ano, mes };
    });
  }, [transactions, closingDay]);

  const ultimasTransacoes = useMemo(() => {
    return [...transacoesFiltradas]
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))
      .slice(0, 5);
  }, [transacoesFiltradas]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col min-h-screen lg:max-h-screen p-4 md:p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-700">
      <h2 className="text-xl md:text-2xl font-bold mb-3 text-white">
        PersonalFin
      </h2>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-white items-center">
        <ResumoCard
          titulo="Entradas"
          valor={formatCurrency(entradas)}
          cor="text-green-500"
        />
        <ResumoCard
          titulo="Saídas"
          valor={formatCurrency(saidas)}
          cor="text-red-600"
        />
        <ResumoCard
          titulo="Saldo"
          valor={formatCurrency(total)}
          cor="text-blue-400"
        />
        <SeletorMes
          mesesDisponiveis={mesesDisponiveis}
          mesSelecionado={mesSelecionado}
          setMesSelecionado={setMesSelecionado}
          meses={meses}
          closingDay={closingDay}
          setClosingDay={setClosingDay}
        />
      </section>

      <LimiteGastosCard
        limite={limite}
        saidas={saidas}
        onChangeLimite={setLimite}
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden mb-6">
        <ChartCard titulo="Despesas por categoria">
          <DespesasPorCategoriaChart data={categoryData} options={doughnutOptions} />
        </ChartCard>

        <ChartCard titulo="Tendência do Saldo">
          <TendenciaSaldoChart data={saldoData} options={lineOptions} />
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-none">
        <ChartCard titulo="Entradas vs Saídas" className="md:col-span-2 h-72">
          <EntradasSaidasChart data={entradasSaidasData} options={barOptions} />
        </ChartCard>

        <UltimasTransacoes
          ultimasTransacoes={ultimasTransacoes}
          navigate={navigate}
        />
      </section>
    </div>
  );
}
