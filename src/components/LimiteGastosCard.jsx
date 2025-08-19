import { useEffect, useState } from "react";
import api from "../services/api";

export default function LimiteGastosCard({ saidas }) {
  const [limite, setLimite] = useState();
  const [editando, setEditando] = useState(false);
  const [novoLimite, setNovoLimite] = useState("");
  const [loading, setLoading] = useState(true);

  // Buscar limite quando montar
  useEffect(() => {
    async function fetchLimite() {
      setLoading(true);
      try {
        const res = await api.get("/limit/");
        setLimite(res.data.limit?.limit ?? null);
        setNovoLimite(res.data.limit?.limit ?? "");
      } catch {
        setLimite(null);
        setNovoLimite("");
      } finally {
        setLoading(false);
      }
    }
    fetchLimite();
  }, []);


  // Salvar/atualizar limite
  async function handleSalvar(e) {
    e.preventDefault();
    try {
      const method = limite === undefined || limite === null ? "post" : "put";
      const res = await api[method]("/limit/", { limit: Number(novoLimite) });
      setLimite(res.data.limit.limit);
      setEditando(false);
    } catch {
      alert("Erro ao salvar limite");
    }
  }

  const semLimite = limite === undefined || limite === null || limite === 0;

  if (loading) {
    return (
      <div className="bg-zinc-900 rounded-xl shadow p-4 mb-6 flex flex-col items-center">
        <span className="font-semibold text-white">Limite de gastos</span>
        <span className="text-zinc-300 mt-2">Carregando...</span>
      </div>
    );
  }

  if (semLimite && !editando) {
    return (
      <div className="bg-zinc-900 rounded-xl shadow p-4 mb-6 flex flex-col items-center">
        <span className="font-semibold mb-2 text-white">Limite de gastos</span>
        <span className="text-zinc-300 mb-2">Nenhum limite definido.</span>
        <button
          type="button"
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-semibold"
          onClick={() => setEditando(true)}
        >
          Definir Limite
        </button>
        {editando && (
          <form
            onSubmit={handleSalvar}
            className="flex flex-col items-center gap-2 mt-3 w-full"
          >
            <input
              type="number"
              min={0}
              step={0.01}
              value={novoLimite}
              onChange={(e) => setNovoLimite(e.target.value)}
              className="w-24 rounded px-2 py-1 bg-white placeholder-zinc-400"
              autoFocus
              placeholder="Digite o limite"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition text-xs"
              >
                Salvar
              </button>
              <button
                type="button"
                className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition text-xs"
                onClick={() => setEditando(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // Exibição normal se já existe limite
  const restante = limite - saidas;
  const percentual = limite ? Math.max(0, Math.min(100, (saidas / limite) * 100)) : 0;
  const excedeu = saidas > limite;

  return (
    <div className="bg-zinc-900 rounded-xl shadow p-4 mb-6 flex flex-col items-center">
      <span className="font-semibold mb-2 text-white">Limite de gastos</span>
      <div className="w-full bg-zinc-700 rounded-full h-4 mb-2">
        <div
          className={`h-4 rounded-full transition-all duration-300 ${
            excedeu ? "bg-red-500" : "bg-green-500"
          }`}
          style={{ width: `${percentual > 100 ? 100 : percentual}%` }}
        />
      </div>
      <div className="flex justify-between items-center w-full text-xs text-zinc-300 gap-2">
        <span>
          saídas:{" "}
          {saidas.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
        <span className="flex items-center gap-2">
          Limite:
          {editando ? (
            <form onSubmit={handleSalvar} className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                step={0.01}
                value={novoLimite}
                onChange={(e) => setNovoLimite(e.target.value)}
                className="w-20 rounded px-1 py-0.5 text-white placeholder-zinc-400"
                autoFocus
              />
              <button
                type="submit"
                className="ml-1 px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition text-xs"
                title="Salvar"
              >
                Salvar
              </button>
              <button
                type="button"
                className="ml-1 px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition text-xs"
                onClick={() => setEditando(false)}
                title="Cancelar"
              >
                Cancelar
              </button>
            </form>
          ) : (
            <>
              <span className="ml-1">
                {limite.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
              <button
                type="button"
                className="ml-2 px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-xs font-semibold"
                onClick={() => {
                  setNovoLimite(limite);
                  setEditando(true);
                }}
                title="Editar limite"
              >
                Editar
              </button>
            </>
          )}
        </span>
        <span className={restante < 0 ? "text-red-400" : "text-green-400"}>
          {restante < 0
            ? `-${(saidas - limite).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}`
            : `${restante.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })} restantes`}
        </span>
      </div>
    </div>
  );
}