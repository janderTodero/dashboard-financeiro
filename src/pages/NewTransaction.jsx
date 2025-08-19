import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/authContext";
import { FiDollarSign, FiType, FiList, FiSave } from "react-icons/fi";
import { useTransactions } from "../context/TransactionsContext";

export default function NewTransaction() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("entrada");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const { addTransaction } = useTransactions();


  const categoryMap = {
    income: [
      "salário",
      "freelance",
      "investimentos",
      "presente",
      "venda",
      "reembolso",
      "outros"
    ],
    expense: [
      "moradia",
      "alimentação",
      "transporte",
      "saúde",
      "educação",
      "lazer",
      "outros"
    ]
  };

  useEffect(() => {
    setSuggestedCategories(categoryMap[type]);
    if (category && !categoryMap[type].includes(category)) {
      setCategory("");
    }
  }, [type]);

  const navigate = useNavigate();

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

      const transactionData = {
        title,
        amount: amountValue,
        type,
        category,
        user: user.id
      };

      const response = addTransaction(transactionData)
  
      if (response) {
        setSuccessMessage("Transação criada com sucesso!");
        
        setTitle("");
        setAmount("");
        setType("entrada");
        setCategory("");
        
        setTimeout(() => {
          navigate("/transactions");
        }, 2000);
      } else {
        throw new Error("Resposta inesperada da API");
      }
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      
      let errorMessage = "Ocorreu um erro ao salvar a transação. Tente novamente.";
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Sessão expirada. Por favor, faça login novamente.";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Nova Transação</h2>
          <p className="text-purple-400 mt-2">Registre uma nova entrada ou saída</p>
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
                className={`py-3 rounded-lg font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900 cursor-pointer ${
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
                className={`py-3 rounded-lg font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900 cursor-pointer ${
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
                placeholder={`Categoria ${type === "entrada" ? "da receita" : "da despesa"}*`}
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
                      category ? 
                      cat.toLowerCase().includes(category.toLowerCase()) : 
                      true
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
              className="w-1/2 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-zinc-900 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                isLoading ? "opacity-70" : "hover:from-purple-700 hover:to-indigo-700 cursor-pointer"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                  Salvando...
                </span>
              ) : (
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