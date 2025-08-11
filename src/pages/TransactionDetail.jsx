import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useTransactions } from "../context/TransactionsContext";

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteTransaction } = useTransactions()

  const [detalhe, setDetalhe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    async function fetchTransaction() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/transactions/${id}`);
        setDetalhe(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }

    fetchTransaction();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("Tem certeza que deseja deletar esta transação?")) return;

    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteTransaction(id)
      navigate("/");
    } catch (err) {
      setDeleteError(err.response?.data?.message || err.message || "Erro ao deletar");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl shadow-xl p-8 w-full max-w-md text-white">
        <div className="flex justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            Voltar
          </button>

          <div className="space-x-3">
            <button
              onClick={() => navigate(`/transactions/edit/${id}`)}
              className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                deleting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {deleting ? "Deletando..." : "Deletar"}
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Detalhes da Transação</h2>

        {loading ? (
          <p className="text-center text-white">Carregando...</p>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : (
          <div className="space-y-4">
            <p>
              <strong>Descrição:</strong> {detalhe.description || detalhe.title || "Sem descrição"}
            </p>
            <p>
              <strong>Categoria:</strong> {detalhe.category || "-"}
            </p>
            <p>
              <strong>Valor:</strong>{" "}
              {detalhe.amount.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            <p>
              <strong>Data:</strong> {new Date(detalhe.date).toLocaleDateString("pt-BR")}
            </p>
            <p>
              <strong>Tipo:</strong> {detalhe.type === 'expense' ? "Saída" : "Entrada"}
            </p>
            {deleteError && <p className="text-red-500 mt-4">{deleteError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

