import { useToast } from '../context/ToastContext';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const icons = {
  success: <CheckCircle2 size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

const styles = {
  success: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300',
  error: 'bg-red-950/90 border-red-500/30 text-red-300',
  warning: 'bg-amber-950/90 border-amber-500/30 text-amber-300',
  info: 'bg-blue-950/90 border-blue-500/30 text-blue-300',
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            layout
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm min-w-[280px] max-w-[360px] shadow-2xl ${styles[toast.type]}`}
          >
            <div className="shrink-0 opacity-80">
              {icons[toast.type]}
            </div>
            
            <p className="flex-1 text-sm font-medium tracking-tight">
              {toast.message}
            </p>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors opacity-50 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
