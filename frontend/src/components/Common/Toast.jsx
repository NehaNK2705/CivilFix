import React from 'react';
import { useReports } from '../../context/ReportsContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useReports();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getToastStyles = () => {
          switch (toast.type) {
            case 'success':
              return {
                bg: 'bg-emerald-900/90 text-white border-emerald-500',
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              };
            case 'error':
              return {
                bg: 'bg-rose-900/90 text-white border-rose-500',
                icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              };
            case 'warning':
              return {
                bg: 'bg-amber-900/90 text-white border-amber-500',
                icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              };
            default:
              return {
                bg: 'bg-slate-900/90 text-white border-teal-500',
                icon: <Info className="w-5 h-5 text-teal-400 shrink-0" />
              };
          }
        };

        const { bg, icon } = getToastStyles();

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 ${bg}`}
          >
            {icon}
            <div className="ml-3 flex-1">
              {toast.title && <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>}
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
