import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

export const TransactionsContext = createContext();

export const useTransactions = () => useContext(TransactionsContext);

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Função para recarregar todas as transações
  async function fetchTransactions() {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function addTransaction(transaction) {
    try {
      const response = await api.post("/transactions", transaction);
      await fetchTransactions(); // recarrega a lista
      return response.data;
    } catch (error) {
      console.log("Erro ao adicionar transação:", error);
    }
  }

  async function editTransaction(id, updatedTransaction) {
    try {
      const response = await api.put(`/transactions/${id}`, updatedTransaction);
      await fetchTransactions(); // recarrega a lista
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar transação", error);
    }
  }

  async function deleteTransaction(id) {
    try {
      await api.delete(`/transactions/${id}`);
      await fetchTransactions(); // recarrega a lista
    } catch (error) {
      console.log("Erro ao deletar transação:", error);
    }
  }

  async function getTransaction(id) {
    try {
      const response = await api.get(`/transactions/${id}`);
      if (response.data) {
        return response.data;
      } else {
        throw new Error("Transação não encontrada");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error("Transação não encontrada");
        } else {
          throw new Error(`Erro no servidor: ${error.response.status}`);
        }
      } else if (error.request) {
        throw new Error("Sem resposta do servidor");
      } else {
        throw new Error(`Erro na requisição: ${error.message}`);
      }
    }
  }

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        addTransaction,
        editTransaction,
        deleteTransaction,
        getTransaction,
        refreshTransactions: fetchTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
