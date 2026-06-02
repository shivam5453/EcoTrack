import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import useAuth from '../hooks/useAuth';

/**
 * Premium, glassmorphic floating Toast notification center.
 */
export const Toast = () => {
  const { toast, clearToast } = useAuth();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000); // Auto-clear after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  if (!toast) return null;

  const { message, type } = toast;
  
  const isSuccess = type === 'success';

  return (
    <div className="fixed top-5 right-5 z-[9999] max-w-sm w-full animate-[slideIn_0.3s_ease-out] px-4 sm:px-0">
      <div className={`
        flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300
        ${isSuccess 
          ? 'bg-emerald-50/90 dark:bg-emerald-950/85 border-emerald-500/20 text-emerald-900 dark:text-emerald-100 shadow-emerald-500/10' 
          : 'bg-rose-50/90 dark:bg-rose-950/85 border-rose-500/20 text-rose-900 dark:text-rose-100 shadow-rose-500/10'
        }
      `}>
        <div className={`mt-0.5 p-1 rounded-lg ${isSuccess ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-450'}`}>
          {isSuccess ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
        </div>
        
        <div className="flex-1 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider opacity-60">
            {isSuccess ? 'Success' : 'Alert'}
          </p>
          <p className="text-sm font-medium leading-relaxed">{message}</p>
        </div>

        <button 
          onClick={clearToast}
          className="p-1 rounded-lg hover:bg-slate-500/10 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
