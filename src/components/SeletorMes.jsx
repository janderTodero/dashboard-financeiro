export default function SeletorMes({
  mesesDisponiveis,
  mesSelecionado,
  setMesSelecionado,
  meses,
  closingDay,
  setClosingDay
}) {

  if (!mesSelecionado || typeof mesSelecionado.ano !== "number" || typeof mesSelecionado.mes !== "number") {
    return <div>Seleção de mês inválida</div>;
  }

  // Calculate cycle period for display
  const getCyclePeriod = () => {
    if (closingDay >= 30) return ""; // Standard month

    const currentMonth = new Date(mesSelecionado.ano, meses[mesSelecionado.mes], closingDay);
    const prevMonth = new Date(mesSelecionado.ano, meses[mesSelecionado.mes] - 1, closingDay + 1);

    return `(${prevMonth.getDate()}/${meses[prevMonth.getMonth()]} - ${currentMonth.getDate()}/${meses[currentMonth.getMonth()]})`;
  };

  return (
    <div className="bg-zinc-900 rounded-xl shadow p-4 flex flex-col justify-center gap-3 h-auto min-h-[7rem]">
      <div className="flex flex-col">
        <label htmlFor="mes-select" className="mb-1 font-semibold text-white text-sm">
          Mês de Referência <span className="text-xs text-gray-400 font-normal">{getCyclePeriod()}</span>
        </label>
        <select
          id="mes-select"
          className="bg-gray-700 rounded-md p-2 text-white focus:outline-none text-sm"
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

      <div className="flex flex-col">
        <label htmlFor="closing-day" className="mb-1 font-semibold text-white text-sm">
          Dia de Fechamento
        </label>
        <select
          id="closing-day"
          className="bg-gray-700 rounded-md p-2 text-white focus:outline-none text-sm"
          value={closingDay}
          onChange={(e) => setClosingDay(Number(e.target.value))}
        >
          <option value={31}>Fim do Mês (Padrão)</option>
          {[...Array(28)].map((_, i) => (
            <option key={i + 1} value={i + 1}>Dia {i + 1}</option>
          ))}
        </select>
      </div>
    </div>
  );
}