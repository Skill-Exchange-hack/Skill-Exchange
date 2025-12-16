function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-subtle">
      <div className="text-center">
        <div className="inline-flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-slate-600 text-lg font-medium">読み込み中...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
