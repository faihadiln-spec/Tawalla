"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, Info, AlertCircle, XCircle, X } from "lucide-react";

export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message }]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const typeConfig: Record<
    ToastType,
    { icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-accent-green shrink-0" />,
      bg: "bg-surface",
      text: "text-text-main",
      border: "border-accent-green/30",
    },
    info: {
      icon: <Info className="w-5 h-5 text-primary-blue shrink-0" />,
      bg: "bg-surface",
      text: "text-text-main",
      border: "border-primary-blue/30",
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5 text-warm-brown shrink-0" />,
      bg: "bg-surface",
      text: "text-text-main",
      border: "border-warm-brown/30",
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-warm-brown shrink-0" />,
      bg: "bg-surface",
      text: "text-text-main",
      border: "border-warm-brown/40",
    },
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Container (Top Left or Bottom Left in RTL) */}
      <div
        className="fixed bottom-6 left-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const config = typeConfig[toast.type];
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-float border ${config.bg} ${config.border} transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in text-right`}
            >
              {config.icon}
              <div className="flex-1 space-y-0.5 pr-1">
                <p className="text-xs sm:text-sm font-bold text-text-main">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="text-xs text-text-muted leading-relaxed">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-text-muted hover:text-text-main p-1 rounded-lg transition-colors"
                aria-label="إغلاق التنبيه"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
