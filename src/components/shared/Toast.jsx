import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const VARIANTS = {
  success: { icon: CheckCircle2, cls: 'bg-green-50 border-green-200 text-green-800' },
  error:   { icon: XCircle,      cls: 'bg-red-50 border-red-200 text-red-800' },
  warning: { icon: AlertCircle,  cls: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  info:    { icon: Info,          cls: 'bg-blue-50 border-blue-200 text-blue-800' },
};

const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!duration || !onClose) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const { icon: Icon, cls } = VARIANTS[type] ?? VARIANTS.success;

  return (
    <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm ${cls}`}>
      <Icon className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
