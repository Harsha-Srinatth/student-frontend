import { useEffect } from "react";
import { X, Check, AlertCircle } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm transform transition-all duration-300 ease-out ${
      type === 'success' 
        ? 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white' 
        : 'bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white'
    }`}>
      {type === 'success' ? (
        <Check className="w-5 h-5 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
      )}
      <span className="font-medium">{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;

