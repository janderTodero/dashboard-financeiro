
import { useTransactions } from "../context/TransactionsContext";
import useTransactionSummary from "../hooks/useTransactionSummary";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
  const { transactions, loading } = useTransactions();
  const { entradas, saidas, total } = useTransactionSummary();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <main className="flex-1 p-4 md:p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-700 min-h-screen">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white">
          Dashboard
        </h2>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-center text-white">
          <div className="bg-zinc-900 rounded-xl shadow p-4 md:p-6 flex flex-col justify-center items-center">
            <h3 className="font-semibold mb-1 md:mb-2 text-base md:text-lg">
              Entradas
            </h3>
            <p className="text-lg md:text-xl font-bold text-green-500">
              R$ {entradas}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl shadow p-4 md:p-6 flex flex-col justify-center items-center">
            <h3 className="font-semibold mb-1 md:mb-2 text-base md:text-lg">
              Saídas
            </h3>
            <p className="text-lg md:text-xl font-bold text-red-600">
              R$ {saidas}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl shadow p-4 md:p-6 flex flex-col justify-center items-center sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold mb-1 md:mb-2 text-base md:text-lg">
              Saldo
            </h3>
            <p className="text-xl md:text-2xl font-bold text-blue-400">
              R$ {total}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl shadow p-4 md:p-6 sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold mb-2 md:mb-4 text-base md:text-lg">
              Despesas por categoria
            </h3>
            <p className="text-gray-500 text-sm md:text-base">
              Relatório detalhado aqui.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
