export default function ResumoCard({ titulo, valor, cor }) {
  return (
    <div className="bg-zinc-900 rounded-xl shadow p-4 flex flex-col justify-center items-center h-28">
      <h3 className="font-semibold text-base md:text-lg mb-1">{titulo}</h3>
      <p className={`text-lg md:text-xl font-bold ${cor}`}>{valor}</p>
    </div>
  );
}