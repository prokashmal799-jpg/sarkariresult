import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

export interface ToastMessage {
  id: number;
  msg: string;
  type: "success" | "warn" | "error";
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: number) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const bgColors = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    warn: "bg-amber-50 border-amber-200 text-amber-800",
    error: "bg-rose-50 border-rose-200 text-rose-800",
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    warn: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    error: <CheckCircle2 className="w-5 h-5 text-rose-600" />, // Standard check with error styling
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-80 animate-fade-up ${bgColors[toast.type]}`}
      id={`toast-${toast.id}`}
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 text-sm font-sans font-medium line-clamp-2">
        {toast.msg}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 hover:opacity-75 transition-opacity"
      >
        <X className="w-4 h-4 text-slate-500" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
