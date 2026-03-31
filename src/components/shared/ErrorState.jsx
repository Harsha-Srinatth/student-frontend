import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

const VARIANTS = {
  default: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-50', border: 'border-red-100' },
  network: { icon: WifiOff,     color: 'text-orange-400', bg: 'bg-orange-50', border: 'border-orange-100' },
};

const ErrorState = ({ message = 'Something went wrong. Please try again.', onRetry, variant = 'default', title = 'Error' }) => {
  const { icon: Icon, color, bg, border } = VARIANTS[variant] ?? VARIANTS.default;

  return (
    <div className={`flex flex-col items-center justify-center py-14 px-6 text-center rounded-2xl border ${bg} ${border}`}>
      <div className={`w-16 h-16 rounded-full ${bg} border-2 ${border} flex items-center justify-center mb-4`}>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 text-gray-700 rounded-xl text-sm font-medium transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
