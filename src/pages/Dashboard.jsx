import { useTransactions } from "../context/TransactionsContext";
import useTransactionSummary from "../hooks/useTransactionSummary";
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
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

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

export default function Dashboard() {
  const { transactions, loading } = useTransactions();
  const { entradas, saidas, total } = useTransactionSummary();

  console.log(transactions)

  const categoryData = useMemo(() => {
    if (!transactions) return null;
    const expenses = transactions.filter((t) => t.type === "expense");

    const categoriesMap = expenses.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});

    const labels = Object.keys(categoriesMap);
    const data = Object.values(categoriesMap);
    const backgroundColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#8AC24A",
      "#607D8B",
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: "#1e1e1e",
          borderWidth: 1,
        },
      ],
    };
  }, [transactions]);

  const saldoData = useMemo(() => {
    if (!transactions) return null;

    const months = [
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
    let saldoAcumulado = 0;
    const saldosPorMes = months.map((_, i) => {
      const monthTransactions = transactions.filter(
        (t) => new Date(t.date).getMonth() === i
      );
      const entradasMes = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((a, b) => a + b.amount, 0);
      const saidasMes = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((a, b) => a + b.amount, 0);
      saldoAcumulado += entradasMes - saidasMes;
      return saldoAcumulado;
    });

    return {
      labels: months,
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
  }, [transactions]);

  const entradasSaidasData = useMemo(() => {
    if (!transactions) return null;

    const months = [
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
    const entradasMes = months.map((_, i) =>
      transactions
        .filter((t) => t.type === "income" && new Date(t.date).getMonth() === i)
        .reduce((a, b) => a + b.amount, 0)
    );
    const saidasMes = months.map((_, i) =>
      transactions
        .filter(
          (t) => t.type === "expense" && new Date(t.date).getMonth() === i
        )
        .reduce((a, b) => a + b.amount, 0)
    );

    return {
      labels: months,
      datasets: [
        { label: "Entradas", data: entradasMes, backgroundColor: "#4BC0C0" },
        { label: "Saídas", data: saidasMes, backgroundColor: "#FF6384" },
      ],
    };
  }, [transactions]);

  const navigate = useNavigate();

  const topDespesas = useMemo(() => {
    if (!transactions) return [];
    const expenses = transactions.filter((t) => t.type === "expense");
    const categoriesMap = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    return Object.entries(categoriesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [transactions]);

  const meta = 5000;
  const progressoMeta = Math.min((total / meta) * 100, 100);

  const ultimasTransacoes = useMemo(() => {
    if (!transactions) return [];
    // Ordena pela data decrescente (mais recentes primeiro)
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5); // mostra as 5 últimas, por exemplo
  }, [transactions]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-screen p-4 md:p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-700">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-white flex-shrink-0">
        Dashboard
      </h2>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-white">
        <div className="bg-zinc-900 rounded-xl shadow p-4 flex flex-col justify-center items-center h-28">
          <h3 className="font-semibold text-base md:text-lg mb-1">Entradas</h3>
          <p className="text-lg md:text-xl font-bold text-green-500">
            R$ {entradas}
          </p>
        </div>
        <div className="bg-zinc-900 rounded-xl shadow p-4 flex flex-col justify-center items-center h-28">
          <h3 className="font-semibold text-base md:text-lg mb-1">Saídas</h3>
          <p className="text-lg md:text-xl font-bold text-red-600">
            R$ {saidas}
          </p>
        </div>
        <div className="bg-zinc-900 rounded-xl shadow p-4 flex flex-col justify-center items-center h-28">
          <h3 className="font-semibold text-base md:text-lg mb-1">Saldo</h3>
          <p className="text-xl md:text-2xl font-bold text-blue-400">
            R$ {total}
          </p>
        </div>
        <div className="bg-zinc-900 rounded-xl shadow p-4 flex flex-col justify-center h-28">
          <h3 className="font-semibold text-base md:text-lg mb-1">
            Meta de Poupança
          </h3>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${progressoMeta}%` }}
            ></div>
          </div>
          <p className="text-sm">
            {progressoMeta.toFixed(0)}% da meta atingida
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden mb-6">
        <div className="bg-zinc-900 rounded-xl shadow p-4 flex flex-col overflow-hidden">
          <h3 className="font-semibold text-base md:text-lg mb-2 flex-shrink-0 text-white">
            Despesas por categoria
          </h3>
          <div className="flex-1 min-h-0">
            {categoryData ? (
              <Doughnut
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        color: "#e2e8f0",
                        usePointStyle: true,
                        font: { size: 12 },
                      },
                    },
                  },
                }}
              />
            ) : (
              <p className="text-gray-500 text-sm md:text-base">
                Nenhuma despesa registrada
              </p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl shadow p-4 flex flex-col overflow-hidden">
          <h3 className="font-semibold text-base md:text-lg mb-2 flex-shrink-0 text-white">
            Tendência do Saldo
          </h3>
          <div className="flex-1 min-h-0">
            {saldoData && (
              <Line
                data={saldoData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-none">
        <div className="bg-zinc-900 rounded-xl shadow p-4 md:col-span-2 flex flex-col overflow-hidden h-72">
          <h3 className="font-semibold text-base md:text-lg mb-2 text-white">
            Entradas vs Saídas
          </h3>
          <div className="flex-1 min-h-0">
            {entradasSaidasData && (
              <Bar
                data={entradasSaidasData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            )}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl shadow p-6 flex flex-col overflow-auto h-72 text-white">
          <h3 className="font-semibold text-lg mb-4 border-b border-zinc-700 pb-2">
            Últimas Transações
          </h3>
          <ul className="text-sm md:text-base space-y-3 overflow-auto">
            {ultimasTransacoes.length > 0 ? (
              ultimasTransacoes.map((t, i) => {
                const dataFormatada = t.date
                  ? new Date(t.date).toLocaleDateString("pt-BR")
                  : "--/--/----";

                return (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-zinc-800 rounded-md px-4 py-2 hover:bg-zinc-700 transition-colors"
                  >
                    <div className="flex flex-col max-w-[60%] truncate">
                      <span className="font-medium truncate">
                        {t.description || t.title || "Sem descrição"}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {dataFormatada}
                      </span>
                    </div>

                    <span
                      className={`font-semibold ${
                        t.type === "income" ? "text-green-400" : "text-red-400"
                      } min-w-[90px] text-right`}
                    >
                      {t.amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>

                    <button
                      type="button"
                      className="ml-4 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-semibold"
                      onClick={() => navigate(`/transactions/${t._id}`)}
                    >
                      Ver
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="text-center text-zinc-400">
                Nenhuma transação recente
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
