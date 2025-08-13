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
  LineElement,
  PointElement,
  Filler, // Importante para preenchimento (opcional, mas visualmente bom)
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

// Registra os elementos do ChartJS
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler
);

// Array de meses para formatação
const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

// Função de formatação monetária
function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}


// COMPONENTE PRINCIPAL DA PÁGINA DE RELATÓRIOS
export default function Reports() {
  const { transactions, loading } = useTransactions();

  // ----- ESTADO E FILTROS -----
  const dataAtual = new Date();
  const mesAtual = { mes: dataAtual.getMonth(), ano: dataAtual.getFullYear() };
  const mesAnterior = dataAtual.getMonth() === 0
    ? { mes: 11, ano: dataAtual.getFullYear() - 1 }
    : { mes: dataAtual.getMonth() - 1, ano: dataAtual.getFullYear() };

  const [periodoA, setPeriodoA] = useState(mesAnterior);
  const [periodoB, setPeriodoB] = useState(mesAtual);

  const mesesDisponiveis = useMemo(() => {
    if (!transactions) return [];
    const combinacoes = transactions.reduce((acc, t) => {
      const dt = new Date(t.date);
      const key = `${dt.getFullYear()}-${dt.getMonth()}`;
      if (!acc.find(item => item.key === key)) {
        acc.push({ key, ano: dt.getFullYear(), mes: dt.getMonth() });
      }
      return acc;
    }, []);
    combinacoes.sort((a, b) => b.ano - a.ano || b.mes - a.mes);
    return combinacoes;
  }, [transactions]);


  // ----- CÁLCULOS MEMOIZADOS -----

  // Cálculos para os CARDS (resumos gerais do mês)
  const processarPeriodoParaCards = (periodo) => {
    if (!transactions) return { entradas: 0, saidas: 0, total: 0, despesasPorCategoria: {} };

    const transacoesFiltradas = transactions.filter(t => {
      const dt = new Date(t.date);
      return dt.getMonth() === periodo.mes && dt.getFullYear() === periodo.ano;
    });

    const entradas = transacoesFiltradas.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    const saidas = transacoesFiltradas.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
    const despesasPorCategoria = transacoesFiltradas
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    return { entradas, saidas, total: entradas - saidas, despesasPorCategoria };
  };

  const dadosPeriodoA = useMemo(() => processarPeriodoParaCards(periodoA), [transactions, periodoA]);
  const dadosPeriodoB = useMemo(() => processarPeriodoParaCards(periodoB), [transactions, periodoB]);


  // NOVA LÓGICA PARA O GRÁFICO DE LINHA (SALDO DIÁRIO)
  const saldoDiarioLineChartData = useMemo(() => {
    const calcularSaldoDiario = (periodo) => {
      const diasNoMes = new Date(periodo.ano, periodo.mes + 1, 0).getDate();
      const saldosDiarios = Array(diasNoMes).fill(0);
      
      const transacoesDoPeriodo = transactions.filter(t => {
        const dt = new Date(t.date);
        return dt.getMonth() === periodo.mes && dt.getFullYear() === periodo.ano;
      });

      // Calcula o impacto líquido de cada dia
      transacoesDoPeriodo.forEach(t => {
        const dia = new Date(t.date).getDate() - 1; // Array é 0-indexed
        const valor = t.type === 'income' ? t.amount : -t.amount;
        saldosDiarios[dia] += valor;
      });

      // Transforma em saldo acumulado
      for (let i = 1; i < diasNoMes; i++) {
        saldosDiarios[i] += saldosDiarios[i - 1];
      }
      
      return saldosDiarios;
    };

    const saldoPeriodoA = calcularSaldoDiario(periodoA);
    const saldoPeriodoB = calcularSaldoDiario(periodoB);

    const labels = Array.from({ length: 31 }, (_, i) => i + 1); // Eixo X sempre de 1 a 31

    return {
      labels,
      datasets: [
        {
          label: `Saldo ${meses[periodoA.mes]} ${periodoA.ano}`,
          data: saldoPeriodoA,
          borderColor: "#6366F1",
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          fill: true,
          tension: 0.3,
        },
        {
          label: `Saldo ${meses[periodoB.mes]} ${periodoB.ano}`,
          data: saldoPeriodoB,
          borderColor: "#EC4899",
          backgroundColor: "rgba(236, 72, 153, 0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    };
  }, [transactions, periodoA, periodoB]);
  
  // Lógica para o Gráfico de Doughnut (inalterada)
  const doughnutChartData = useMemo(() => {
    const labels = Object.keys(dadosPeriodoA.despesasPorCategoria);
    const data = Object.values(dadosPeriodoA.despesasPorCategoria);
    const generateColors = (num) => Array.from({ length: num }, (_, i) => `hsl(${(i * 360) / num}, 70%, 50%)`);

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: generateColors(labels.length),
        borderColor: "#1e1e1e",
        borderWidth: 2,
      }],
    };
  }, [dadosPeriodoA]);

  // ----- RENDERIZAÇÃO -----
  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-700 text-white">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Relatório Comparativo</h2>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <FiltroPeriodo id="periodo-a" label="Período A" periodo={periodoA} setPeriodo={setPeriodoA} mesesDisponiveis={mesesDisponiveis} />
        <FiltroPeriodo id="periodo-b" label="Período B" periodo={periodoB} setPeriodo={setPeriodoB} mesesDisponiveis={mesesDisponiveis} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ResumoCardComparativo titulo="Resumo Período A" entradas={dadosPeriodoA.entradas} saidas={dadosPeriodoA.saidas} />
        <ResumoCardComparativo titulo="Resumo Período B" entradas={dadosPeriodoB.entradas} saidas={dadosPeriodoB.saidas} />
        <CardDiferenca titulo="Diferença (B vs A)" valorA={dadosPeriodoA.total} valorB={dadosPeriodoB.total} contexto="Saldo" />
        <CardDiferenca titulo="Diferença (B vs A)" valorA={dadosPeriodoA.saidas} valorB={dadosPeriodoB.saidas} contexto="Despesas" isInverted={true} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <ChartCard titulo="Evolução do Saldo Diário" className="lg:col-span-3">
          <Line data={saldoDiarioLineChartData} options={chartOptions.line} />
        </ChartCard>
        <ChartCard titulo={`Categorias de Despesas (${meses[periodoA.mes]})`} className="lg:col-span-2">
          {doughnutChartData.labels.length > 0 ? (
            <Doughnut data={doughnutChartData} options={chartOptions.doughnut(dadosPeriodoB.despesasPorCategoria)} />
          ) : (
            <p className="text-gray-400 text-center my-auto">Nenhuma despesa no Período A.</p>
          )}
        </ChartCard>
      </section>
    </div>
  );
}

// ----- COMPONENTES AUXILIARES (sem alterações) -----

function FiltroPeriodo({ id, label, periodo, setPeriodo, mesesDisponiveis }) {
  return (
    <div className="bg-zinc-900 rounded-xl shadow p-4">
      <label htmlFor={id} className="mb-2 font-semibold text-white text-sm">{label}</label>
      <select id={id} className="bg-gray-700 rounded-md p-2 w-full text-white focus:outline-none mt-1" value={`${periodo.ano}-${periodo.mes}`} onChange={(e) => { const [ano, mes] = e.target.value.split("-").map(Number); setPeriodo({ ano, mes }); }}>
        {mesesDisponiveis.map(({ ano, mes, key }) => (<option key={key} value={`${ano}-${mes}`}>{meses[mes]} {ano}</option>))}
      </select>
    </div>
  );
}

function ResumoCardComparativo({ titulo, entradas, saidas }) {
    const saldo = entradas - saidas;
    return (
      <div className="bg-zinc-900 rounded-xl shadow p-4 flex flex-col justify-center h-28">
        <h3 className="font-semibold text-base md:text-lg mb-2 text-center">{titulo}</h3>
        <div className="flex justify-around text-sm">
          <span className="text-green-500">{formatCurrency(entradas)}</span>
          <span className="text-red-600">{formatCurrency(saidas)}</span>
        </div>
        <p className={`text-lg font-bold text-center mt-1 ${saldo >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>{formatCurrency(saldo)}</p>
      </div>
    );
}
  
function CardDiferenca({ titulo, valorA, valorB, contexto, isInverted = false }) {
    const diferenca = valorB - valorA;
    const percentual = valorA !== 0 ? (diferenca / Math.abs(valorA)) * 100 : (valorB > 0 ? 100 : 0);
    let cor = "text-gray-400"; let Icono = Minus;
    if (percentual > 0) { cor = isInverted ? "text-red-500" : "text-green-500"; Icono = ArrowUp; } 
    else if (percentual < 0) { cor = isInverted ? "text-green-500" : "text-red-500"; Icono = ArrowDown; }
  
    return (
      <div className="bg-zinc-900 rounded-xl shadow p-4 flex flex-col justify-center items-center h-28">
        <h3 className="font-semibold text-base md:text-lg mb-1">{contexto}</h3>
        <div className={`flex items-center gap-2 text-xl font-bold ${cor}`}><Icono size={20} /><span>{percentual.toFixed(1)}%</span></div>
        <p className={`text-sm ${cor}`}>{formatCurrency(diferenca)}</p>
      </div>
    );
}

function ChartCard({ titulo, children, className = "" }) {
  return (
    <div className={`bg-zinc-900 rounded-xl shadow p-4 flex flex-col overflow-hidden h-80 ${className}`}>
      <h3 className="font-semibold text-base md:text-lg mb-2 text-white">{titulo}</h3>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

// Configurações e opções para os gráficos
const chartOptions = {
    line: {
        responsive: true, maintainAspectRatio: false,
        elements: { point: { radius: 1.5, hoverRadius: 4 } }, // Pontos menores no gráfico
        plugins: {
            legend: { position: 'top', labels: { color: "#e2e8f0" } },
            tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${formatCurrency(context.raw)}` } }
        },
        scales: {
            x: { ticks: { color: "#e2e8f0" }, grid: { color: 'rgba(226, 232, 240, 0.1)' } },
            y: { ticks: { color: "#e2e8f0", callback: (value) => formatCurrency(value) }, grid: { color: 'rgba(226, 232, 240, 0.1)' } },
        },
    },
    doughnut: (dadosPeriodoB) => ({
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => ` ${context.label}: ${formatCurrency(context.raw)}`,
                    afterLabel: (context) => {
                        const categoria = context.label;
                        const valorB = dadosPeriodoB[categoria] || 0;
                        return `Período B: ${formatCurrency(valorB)}`;
                    }
                }
            }
        }
    })
};