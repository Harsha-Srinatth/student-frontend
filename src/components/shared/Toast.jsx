import { useEffect } from "react";
import { X, Check, AlertCircle, AlertTriangle } from "lucide-react";

/**
 * Shared Toast for success, error, and warning messages.
 * Use: setToast({ type: "success" | "error" | "warning", message: "..." })
 */
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";
  const isWarning = type === "warning";

  const styles = isSuccess
    ? "bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white"
    : isWarning
    ? "bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white"
    : "bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white";

  const Icon = isSuccess ? Check : isWarning ? AlertTriangle : AlertCircle;

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm transform transition-all duration-300 ease-out ${styles}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
