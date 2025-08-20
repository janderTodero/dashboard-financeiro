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
import formatCurrency from "../utils/format";
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
  const [limite, setLimite ] = useState()

  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth();
  const anoAtual = dataAtual.getFullYear();

  const [mesSelecionado, setMesSelecionado] = useState({
    mes: mesAtual,
    ano: anoAtual,
  });

  const transacoesFiltradas = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((t) => {
      const dt = new Date(t.date);
      return (
        dt.getMonth() === mesSelecionado.mes &&
        dt.getFullYear() === mesSelecionado.ano
      );
    });
  }, [transactions, mesSelecionado]);

  const { entradas, saidas, total } = useResumo(transacoesFiltradas);
  const categoryData = useCategoryData(transacoesFiltradas);
  const entradasSaidasData = useEntradasSaidasData(transactions, mesSelecionado);
  const saldoData = useSaldoData(transactions, mesSelecionado);

  const mesesDisponiveis = useMemo(() => {
    if (!transactions) return [];
    const combinacoes = transactions.reduce((acc, t) => {
      const dt = new Date(t.date);
      const key = `${dt.getFullYear()}-${dt.getMonth()}`;
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
  }, [transactions]);

  const ultimasTransacoes = useMemo(() => {
    return [...transacoesFiltradas]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transacoesFiltradas]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-700">
      <h2 className="text-xl md:text-2xl font-bold mb-3 text-white">
        Dashboard
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
