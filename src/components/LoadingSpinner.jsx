export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-blue-700">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-white"></div>
    </div>
  );
}
