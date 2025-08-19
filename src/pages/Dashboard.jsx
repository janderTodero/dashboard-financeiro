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
import { Doughnut, Line, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import ResumoCard from "../components/ResumoCard";
import SeletorMes from "../components/SeletorMes";
import UltimasTransacoes from "../components/UltimasTransacoes";
import formatCurrency from "../utils/format";
import ChartCard from "../components/ChartCard";
import EmptyMessage from "../components/EmptyMesage";

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
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export default function Dashboard() {
  const { transactions, loading } = useTransactions();
  const navigate = useNavigate();

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

  const categoryData = useMemo(() => {
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

  const entradasSaidasData = useMemo(() => {
    if (!transactions) return null;

    const mesesAno = Array(12)
      .fill(0)
      .map((_, i) => ({ entradas: 0, saidas: 0 }));

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

  const saldoData = useMemo(() => {
    if (!transactions) return null;
    const mesesAno = Array(12)
      .fill(0)
      .map(() => ({ entradas: 0, saidas: 0 }));
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

  const ultimasTransacoes = useMemo(() => {
    return [...transacoesFiltradas]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transacoesFiltradas]);

  const chartAnimation = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
      delay: (context) => context.dataIndex * 100,
    },
    plugins: {
      legend: {
        labels: {
          color: "#e2e8f0",
          usePointStyle: true,
          font: { size: 12 },
        },
      },
    },
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-700">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">
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

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden mb-6">
        <ChartCard titulo="Despesas por categoria">
          {categoryData && categoryData.labels.length > 0 ? (
            <Doughnut
              data={categoryData}
              options={{
                ...chartAnimation,
                plugins: {
                  ...chartAnimation.plugins,
                  legend: {
                    ...chartAnimation.plugins.legend,
                    position: "bottom",
                  },
                },
              }}
            />
          ) : (
            <EmptyMessage>Nenhuma despesa registrada</EmptyMessage>
          )}
        </ChartCard>

        <ChartCard titulo="Tendência do Saldo">
          {saldoData && (
            <Line
              data={saldoData}
              options={{
                ...chartAnimation,
                elements: {
                  line: { tension: 0.3 },
                  point: { radius: 4, hoverRadius: 6 },
                },
              }}
            />
          )}
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-none">
        <ChartCard titulo="Entradas vs Saídas" className="md:col-span-2 h-72">
          {entradasSaidasData && (
            <Bar
              data={entradasSaidasData}
              options={{
                ...chartAnimation,
                scales: {
                  x: { ticks: { color: "#e2e8f0" } },
                  y: { ticks: { color: "#e2e8f0" } },
                },
              }}
            />
          )}
        </ChartCard>

        <UltimasTransacoes ultimasTransacoes={ultimasTransacoes} navigate={navigate} />
      </section>
    </div>
  );
}

