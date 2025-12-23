
const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-base-100/60 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-secondary/20 border-b-secondary rounded-full animate-spin-reverse"></div>
          </div>
        </div>
        <p className="text-primary font-bold tracking-widest text-xs uppercase animate-pulse">
          Loading eTuition...
        </p>
      </div>
      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
