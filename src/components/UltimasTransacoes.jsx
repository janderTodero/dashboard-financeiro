import { Eye } from "lucide-react";
import formatCurrency from "../utils/format";

export default function UltimasTransacoes({ ultimasTransacoes, navigate }) {
  return (
    <div className="bg-zinc-900 rounded-xl shadow p-6 flex flex-col overflow-auto h-72 text-white">
      <h3 className="font-semibold text-lg mb-4 border-b border-zinc-700 pb-2">
        Últimas Transações
      </h3>
      <ul className="text-sm md:text-base space-y-3 overflow-auto">
        {ultimasTransacoes.length > 0 ? (
          ultimasTransacoes.map((t) => {
            const dataValida = t.date && !isNaN(new Date(t.date));
            const dataFormatada = dataValida
              ? new Date(t.date).toLocaleDateString("pt-BR")
              : "--/--/----";
            return (
              <li
                key={t._id}
                className="flex items-center justify-between bg-zinc-800 rounded-md px-4 py-2 hover:bg-zinc-700 transition-colors"
              >
                <div className="flex flex-col max-w-[60%] truncate">
                  <span className="font-medium truncate">
                    {t.description || t.title || "Sem descrição"}
                  </span>
                  <span className="text-xs text-zinc-400">{dataFormatada}</span>
                </div>
                <span
                  className={`font-semibold ${
                    t.type === "income"
                      ? "text-green-400"
                      : "text-red-400"
                  } min-w-[90px] text-right`}
                >
                  {formatCurrency(t.amount)}
                </span>
                <button
                  type="button"
                  className="cursor-pointer ml-4 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-semibold flex items-center gap-1"
                  onClick={() => navigate(`/transactions/${t._id}`)}
                >
                  <Eye size={16} /> Ver
                </button>
              </li>
            );
          })
        ) : (
          <li className="text-center text-zinc-400">
            Nenhuma transação recente
          </li>
        )}
      </ul>
    </div>
  );
}