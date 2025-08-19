export default function ChartCard({ titulo, children, className = "" }) {
  return (
    <div
      className={`bg-zinc-900 rounded-xl shadow p-4 flex flex-col overflow-hidden ${className}`}
    >
      <h3 className="font-semibold text-base md:text-lg mb-2 text-white">
        {titulo}
      </h3>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}