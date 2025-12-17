function LoadingSpinner({ size = 'lg', fullScreen = false }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const spinnerClass = sizeClasses[size] || sizeClasses.lg;

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-subtle">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <div
              className={`${spinnerClass} border-slate-100 border-t-cyan-500 rounded-full animate-spin`}
            ></div>
          </div>
          <p className="mt-6 text-slate-600 text-lg font-medium">
            読み込み中...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div
        className={`${spinnerClass} border-slate-100 border-t-cyan-500 rounded-full animate-spin`}
      ></div>
    </div>
  );
}

export default LoadingSpinner;
