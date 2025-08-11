import { useTransactions } from "../context/TransactionsContext";
import { useMemo } from "react";

export default function useTransactionSummary() {
    const { transactions, loading } = useTransactions();

    return useMemo(() => {
        if (loading || !Array.isArray(transactions)) {
            return { entradas: "R$ 0,00", saidas: "R$ 0,00", total: "R$ 0,00" };
        }

        const entradas = transactions
            .filter((t) => t.type === "income")
            .reduce((acc, t) => acc + t.amount, 0);

        const saidas = transactions
            .filter((t) => t.type === "expense")
            .reduce((acc, t) => acc + t.amount, 0);

        const total = entradas - saidas;

        const formatCurrency = (value) =>
            new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(value);

        return {
            entradas: formatCurrency(entradas),
            saidas: formatCurrency(saidas),
            total: formatCurrency(total),
        };
    }, [transactions, loading]);
}
