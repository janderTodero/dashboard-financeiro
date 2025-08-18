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
import { Eye } from "lucide-react";

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

 
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth();
  const anoAtual = dataAtual.getFullYear();

 
  const [mesSelecionado, setMesSelecionado] = useState({ mes: mesAtual, ano: anoAtual });

 
  const transacoesFiltradas = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(t => {
      const dt = new Date(t.date);
      return dt.getMonth() === mesSelecionado.mes && dt.getFullYear() === mesSelecionado.ano;
    });
  }, [transactions, mesSelecionado]);

 
  const entradas = useMemo(() => {
    return transacoesFiltradas
      .filter(t => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transacoesFiltradas]);

  const saidas = useMemo(() => {
    return transacoesFiltradas
      .filter(t => t.type === "expense")
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
    return combinacoes.map(key => {
      const [ano, mes] = key.split("-").map(Number);
      return { ano, mes };
    });
  }, [transactions]);

  
  const categoryData = useMemo(() => {
    if (!transacoesFiltradas || transacoesFiltradas.length === 0) return null;
    const despesas = transacoesFiltradas.filter(t => t.type === "expense");
    const categoriasMap = despesas.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const labels = Object.keys(categoriasMap);
    const data = Object.values(categoriasMap);

    const generateColors = (num) =>
      Array.from({ length: num }, (_, i) => `hsl(${(i * 360) / num}, 70%, 50%)`);

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
    
    const mesesAno = Array(12).fill(0).map((_, i) => ({ entradas: 0, saidas: 0 }));

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
        { label: "Entradas", data: mesesAno.map(m => m.entradas), backgroundColor: "#4BC0C0" },
        { label: "Saídas", data: mesesAno.map(m => m.saidas), backgroundColor: "#FF6384" },
      ],
    };
  }, [transactions, mesSelecionado]);

  
  const saldoData = useMemo(() => {
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
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Dashboard</h2>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-white items-center">
        <ResumoCard titulo="Entradas" valor={formatCurrency(entradas)} cor="text-green-500" />
        <ResumoCard titulo="Saídas" valor={formatCurrency(saidas)} cor="text-red-600" />
        <ResumoCard titulo="Saldo" valor={formatCurrency(total)} cor="text-blue-400" />

       
        <div className="bg-zinc-900 rounded-xl shadow p-4 flex flex-col justify-center h-28">
          <label htmlFor="mes-select" className="mb-2 font-semibold text-white">
            Selecionar mês
          </label>
          <select
            id="mes-select"
            className="bg-gray-700 rounded-md p-2 text-white focus:outline-none"
            value={`${mesSelecionado.ano}-${mesSelecionado.mes}`}
            onChange={(e) => {
              const [ano, mes] = e.target.value.split("-").map(Number);
              setMesSelecionado({ ano, mes });
            }}
          >
            {mesesDisponiveis.map(({ ano, mes }) => (
              <option key={`${ano}-${mes}`} value={`${ano}-${mes}`}>
                {meses[mes]} {ano}
              </option>
            ))}
          </select>
        </div>
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
                  legend: { ...chartAnimation.plugins.legend, position: "bottom" },
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

        <div className="bg-zinc-900 rounded-xl shadow p-6 flex flex-col overflow-auto h-72 text-white">
          <h3 className="font-semibold text-lg mb-4 border-b border-zinc-700 pb-2">
            Últimas Transações
          </h3>
          <ul className="text-sm md:text-base space-y-3 overflow-auto">
            {ultimasTransacoes.length > 0 ? (
              ultimasTransacoes.map((t, i) => {
                const dataValida = t.date && !isNaN(new Date(t.date));
                const dataFormatada = dataValida
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
                      <span className="text-xs text-zinc-400">{dataFormatada}</span>
                    </div>
                    <span
                      className={`font-semibold ${
                        t.type === "income"
                          ? "text-green-400"
                          : "text-red-400"
                      } min-w-[90px] text-right`}
                    >
                      {formatCurrency(t.amount)}
                    </span>
                    <button
                      type="button"
                      className="cursor-pointer ml-4 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-semibold flex items-center gap-1"
                      onClick={() => navigate(`/transactions/${t._id}`)}
                    >
                      <Eye size={16} /> Ver
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

function ResumoCard({ titulo, valor, cor }) {
  return (
    <div className="bg-zinc-900 rounded-xl shadow p-4 flex flex-col justify-center items-center h-28">
      <h3 className="font-semibold text-base md:text-lg mb-1">{titulo}</h3>
      <p className={`text-lg md:text-xl font-bold ${cor}`}>{valor}</p>
    </div>
  );
}

function ChartCard({ titulo, children, className = "" }) {
  return (
    <div
      className={`bg-zinc-900 rounded-xl shadow p-4 flex flex-col overflow-hidden ${className}`}
    >
      <h3 className="font-semibold text-base md:text-lg mb-2 text-white">
        {titulo}
      </h3>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

function EmptyMessage({ children }) {
  return <p className="text-gray-500 text-sm md:text-base">{children}</p>;
}


function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
