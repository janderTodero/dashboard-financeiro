import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiDollarSign, FiType, FiList, FiSave } from "react-icons/fi";
import { useTransactions } from "../context/TransactionsContext";

export default function EditTransaction() {
  const { user } = useContext(AuthContext);
  const { transactions, editTransaction } = useTransactions();
  const { id } = useParams();
  const navigate = useNavigate();

  const transactionToEdit = transactions.find(t => t._id === id);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState([]);

  const categoryMap = {
    income: ["salário", "freelance", "investimentos", "presente", "venda", "reembolso", "outros"],
    expense: ["moradia", "alimentação", "transporte", "saúde", "educação", "lazer", "outros"]
  };

  useEffect(() => {
    if (transactionToEdit) {
      setTitle(transactionToEdit.title);
      setAmount(transactionToEdit.amount);
      setType(transactionToEdit.type);
      setCategory(transactionToEdit.category);
    }
  }, [transactionToEdit]);

  useEffect(() => {
    setSuggestedCategories(categoryMap[type]);
    if (category && !categoryMap[type].includes(category)) {
      setCategory("");
    }
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!title || !amount || !category) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError("O valor deve ser um número maior que zero.");
      return;
    }

    setIsLoading(true);

    try {
      if (!user || !user.id) {
        throw new Error("Usuário não autenticado");
      }

      const updatedData = {
        title,
        amount: amountValue,
        type,
        category
      };

      const response = await editTransaction(id, updatedData);

      if (response) {
        setSuccessMessage("Transação atualizada com sucesso!");
        setTimeout(() => navigate("/transactions"), 2000);
      } else {
        throw new Error("Erro ao atualizar a transação");
      }
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      setError(error.message || "Ocorreu um erro ao atualizar a transação.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!transactionToEdit) {
    return (
      <div className="text-white p-6">
        <p>Transação não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Editar Transação</h2>
          <p className="text-purple-400 mt-2">Atualize os detalhes da transação</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-500/20 rounded-lg text-green-400 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiType className="text-purple-500" size={20} />
              </div>
              <input
                type="text"
                placeholder="Título*"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-zinc-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="text-purple-500" size={20} />
              </div>
              <input
                type="number"
                placeholder="Valor*"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                step="0.01"
                min="0.01"
                className="w-full pl-10 pr-4 py-3 bg-zinc-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType("income")}
                className={`cursor-pointer py-3 rounded-lg font-medium transition-colors duration-300 ${
                  type === "income"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                }`}
              >
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`cursor-pointer py-3 rounded-lg font-medium transition-colors duration-300 ${
                  type === "expense"
                    ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                    : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                }`}
              >
                Saída
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiList className="text-purple-500" size={20} />
              </div>
              <input
                type="text"
                placeholder={`Categoria ${type === "income" ? "da receita" : "da despesa"}*`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                required
                className="w-full pl-10 pr-4 py-3 bg-zinc-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />

              {showSuggestions && suggestedCategories.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-zinc-800 rounded-lg shadow-lg">
                  {suggestedCategories
                    .filter(cat =>
                      category
                        ? cat.toLowerCase().includes(category.toLowerCase())
                        : true
                    )
                    .map((cat) => (
                      <div
                        key={cat}
                        className="px-4 py-2 hover:bg-purple-600/20 cursor-pointer text-white"
                        onMouseDown={() => {
                          setCategory(cat);
                          setShowSuggestions(false);
                        }}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cursor-pointer w-1/2 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`cursor-pointer w-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all ${
                isLoading ? "opacity-70" : "hover:from-purple-700 hover:to-indigo-700"
              }`}
            >
              {isLoading ? "Salvando..." : (
                <>
                  <FiSave className="inline mr-2" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
