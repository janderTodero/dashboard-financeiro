import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Sidebar from "../components/Sidebar";
import { useTransactions } from "../context/TransactionsContext";
import useTransactionSummary from "../hooks/useTransactionSummary";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { transactions, loading } = useTransactions();
  const { entradas, saidas, total } = useTransactionSummary()

  if (loading) {
    return <LoadingSpinner />
  }

  
  return (
    <div className="grid grid-cols-[300px_1fr] min-h-screen">
      <Sidebar />

      <main className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Dashboard</h2>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
          <div className="bg-zinc-900 rounded-xl shadow p-6 flex flex-col justify-center items-center">
            <h3 className="font-semibold mb-2 text-lg">Entradas</h3>
            <p className="text-xl font-bold text-green-500">R$ {entradas}</p>
          </div>

          <div className="bg-zinc-900 rounded-xl shadow p-6 flex flex-col justify-center items-center">
            <h3 className="font-semibold mb-2 text-lg">Saídas</h3>
            <p className="text-xl font-bold text-red-600">R$ {saidas}</p>
          </div>

          <div className="bg-zinc-900 rounded-xl shadow p-6 flex flex-col justify-center items-center h-40 lg:col-span-1">
            <h3 className="font-semibold mb-2 text-lg">Saldo</h3>
            <p className="text-2xl font-bold text-blue-700">R$ {total}</p>
          </div>

          <div className="bg-zinc-900 rounded-xl shadow p-6 lg:col-span-1">
            <h3 className="font-semibold mb-4 text-lg">Despesas por categoria</h3>
            <p className="text-gray-500">Relatório detalhado aqui.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
