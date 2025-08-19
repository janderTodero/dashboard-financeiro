export default function EmptyMessage({ children }) {
  return (
    <div className="flex items-center justify-center h-full text-zinc-400 text-center">
      {children}
    </div>
  );
}