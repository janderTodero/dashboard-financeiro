import { useTransactions } from "../context/TransactionsContext";
import { useMemo } from "react";

export default function useTransactionSummary() {
    const { transactions, loading } = useTransactions();

    return useMemo(() => {
        if (loading || !Array.isArray(transactions)) {
            return { entradas: 0, saidas: 0, total: 0 };
        }

        const entradas = transactions
            .filter((t) => t.type === "income")
            .reduce((acc, t) => acc + t.amount, 0);

        const saidas = transactions
            .filter((t) => t.type === "expense")
            .reduce((acc, t) => acc + t.amount, 0);

        const total = entradas - saidas;
        console.log(transactions)

        return { entradas, saidas, total };
    }, [transactions, loading]);
}
