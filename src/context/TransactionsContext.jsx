import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

export const TransactionsContext = createContext();

export const useTransactions = () => useContext(TransactionsContext);

export function TransactionsProvider({ children }) {
    const [transactions, setTransactions ] = useState([]);
    const [loading, setLoading ] = useState(true);

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await api.get("/transactions");
                setTransactions(response.data)
                console.log("Transacoes recebidas:", response.data)
            } catch (error) {
                console.error("Erro ao buscar transações:", error)
            } finally {
                setLoading(false);
            }
        }
        fetchTransactions();
    }, []);

    async function addTransaction(transaction) {
        try {
            const response = await axios.post("/api/transactions", transaction);
            setTransactions((prev) => [...prev, response.data]);
        } catch (error) {
            console.log("Erro ao adicionar transação:", error)
        }
    }

    async function deleteTransaction(id) {
        try {
            await axios.delete(`/api/transactions/${id}`)
            setTransactions((prev) => prev.filter((t) => t._id !== id))
        } catch (error) {
            console.log("Erro ao deletar transação:", error)
        }
    }

    return (
        <TransactionsContext.Provider
            value={{
                transactions,
                loading,
                addTransaction,
                deleteTransaction,
            }}
        >
            {children}
        </TransactionsContext.Provider>
    )
}