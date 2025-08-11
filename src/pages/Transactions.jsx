import { useState, useMemo } from "react";
import { useTransactions } from "../context/TransactionsContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export default function Transactions() {
  const { transactions, loading } = useTransactions();
  const navigate = useNavigate();

  // Estado filtro mês - padrão mês atual
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth();
  const anoAtual = dataAtual.getFullYear();
  const [mesSelecionado, setMesSelecionado] = useState({ mes: mesAtual, ano: anoAtual });

  // Estado filtro tipo: "all" | "income" | "expense"
  const [tipoSelecionado, setTipoSelecionado] = useState("all");

  // Obter meses disponíveis com base nas transações para o filtro
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

  // Filtrar transações pelo mês e tipo
  const transacoesFiltradas = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(t => {
      const dt = new Date(t.date);
      const mesAnoMatch = dt.getMonth() === mesSelecionado.mes && dt.getFullYear() === mesSelecionado.ano;
      const tipoMatch = tipoSelecionado === "all" || t.type === tipoSelecionado;
      return mesAnoMatch && tipoMatch;
    });
  }, [transactions, mesSelecionado, tipoSelecionado]);

  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-700 p-6 flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-white text-2xl font-bold">Gerenciar Transações</h1>

        <button
          onClick={() => navigate("/transactions/new")}
          className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold transition-colors"
          type="button"
        >
          + Nova Transação
        </button>
      </header>

      <section className="flex flex-col md:flex-row gap-4 mb-6 text-white">
        {/* Filtro mês */}
        <div>
          <label htmlFor="mes-select" className="block mb-1 font-semibold">
            Filtrar por mês
          </label>
          <select
            id="mes-select"
            className="bg-zinc-900 rounded-md p-2 text-white w-full md:w-48"
            value={`${mesSelecionado.ano}-${mesSelecionado.mes}`}
            onChange={e => {
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

        {/* Filtro tipo */}
        <div>
          <label htmlFor="tipo-select" className="block mb-1 font-semibold">
            Filtrar por tipo
          </label>
          <select
            id="tipo-select"
            className="bg-zinc-900 rounded-md p-2 text-white w-full md:w-48"
            value={tipoSelecionado}
            onChange={e => setTipoSelecionado(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="income">Entradas</option>
            <option value="expense">Saídas</option>
          </select>
        </div>
      </section>

      {/* Tabela responsiva para mobile */}
<div className="bg-zinc-900 rounded-xl shadow p-4 flex-1 overflow-auto text-white">
  {transacoesFiltradas.length === 0 ? (
    <p className="text-center text-gray-400 mt-6">Nenhuma transação encontrada.</p>
  ) : (
    <>
      <div className="hidden md:block">
        {/* tabela tradicional desktop */}
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left p-2">Descrição</th>
              <th className="text-left p-2 hidden md:table-cell">Categoria</th>
              <th className="text-left p-2">Data</th>
              <th className="text-right p-2">Valor</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {transacoesFiltradas.map(t => {
              const dataValida = t.date && !isNaN(new Date(t.date));
              const dataFormatada = dataValida
                ? new Date(t.date).toLocaleDateString("pt-BR")
                : "--/--/----";
              return (
                <tr
                  key={t._id}
                  className="border-b border-zinc-700 hover:bg-zinc-800 transition-colors cursor-pointer"
                  onClick={() => navigate(`/transactions/${t._id}`)}
                >
                  <td className="p-2 max-w-xs truncate">{t.description || t.title || "Sem descrição"}</td>
                  <td className="p-2 hidden md:table-cell max-w-xs truncate">{t.category || "-"}</td>
                  <td className="p-2">{dataFormatada}</td>
                  <td className={`p-2 text-right font-semibold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/transactions/${t._id}`);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm font-semibold"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Versão mobile - cards empilhados */}
      <div className="md:hidden space-y-4">
        {transacoesFiltradas.map(t => {
          const dataValida = t.date && !isNaN(new Date(t.date));
          const dataFormatada = dataValida
            ? new Date(t.date).toLocaleDateString("pt-BR")
            : "--/--/----";
          return (
            <div
              key={t._id}
              className="bg-zinc-800 rounded-md p-4 shadow cursor-pointer"
              onClick={() => navigate(`/transactions/${t._id}`)}
            >
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold truncate max-w-[70%]">{t.description || t.title || "Sem descrição"}</h3>
                <span className={`font-semibold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                  {formatCurrency(t.amount)}
                </span>
              </div>
              <div className="text-sm text-zinc-400 flex justify-between">
                <span>{t.category || "-"}</span>
                <span>{dataFormatada}</span>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  navigate(`/transactions/${t._id}`);
                }}
                className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm font-semibold"
                type="button"
              >
                Ver
              </button>
            </div>
          );
        })}
      </div>
    </>
  )}
</div>

    </div>
  );
}
