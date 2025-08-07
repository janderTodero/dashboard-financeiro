export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-700">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-white"></div>
    </div>
  );
}
