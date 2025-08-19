export default function SeletorMes({ mesesDisponiveis, mesSelecionado, setMesSelecionado, meses }) {

  if (!mesSelecionado || typeof mesSelecionado.ano !== "number" || typeof mesSelecionado.mes !== "number") {
    return <div>Seleção de mês inválida</div>;
  }

  return (
    <div className="bg-zinc-900 rounded-xl shadow p-4 flex flex-col justify-center h-28">
      <label htmlFor="mes-select" className="mb-2 font-semibold text-white">
        Selecionar mês
      </label>
      <select
        id="mes-select"
        className="bg-gray-700 rounded-md p-2 text-white focus:outline-none"
        value={`${mesSelecionado.ano}-${mesSelecionado.mes}`}
        onChange={(e) => {
          const [ano, mes] = e.target.value.split("-").map(Number);
          setMesSelecionado({ ano, mes });
        }}
      >
        {mesesDisponiveis.map(({ ano, mes }) => (
          <option key={`${ano}-${mes}`} value={`${ano}-${mes}`}>
            {meses[mes]} {ano}
          </option>
        ))}
      </select>
    </div>
  );
}