import { motion } from 'framer-motion';
import { Circle, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAppData, type LoadHistoryEntry } from '../context/AppDataContext';

interface Props {
  load: LoadHistoryEntry;
}

const statusConfig = {
  en_transito: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'En Tránsito' },
  entregado: { color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20', label: 'Entregado' },
};

export const ActiveLoadCard = ({ load }: Props) => {
  const { showToast } = useToast();
  const { advanceLoadStatus } = useAppData();
  const config = statusConfig[load.status];

  const handleComplete = () => {
    advanceLoadStatus(load.id);
    showToast('¡Entrega confirmada!', 'success');
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card-accent border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col p-6 h-full"
    >
      {/* Row 1: Date & Status */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Aceptada: {load.accepted_date}</span>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${config.bg} ${config.color} ${config.border}`}>
          {config.label}
        </div>
      </div>

      {/* Row 2: Route Display */}
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-3">
          <Circle size={8} className="text-white/20 fill-white/10" />
          <span className="text-sm font-medium text-slate-400">{load.origin}</span>
        </div>
        <div className="border-l-2 border-emerald-500/40 ml-[3px] h-4 my-1" />
        <div className="flex items-center gap-3">
          <Circle size={8} className="text-emerald-500 fill-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          <span className="text-base font-bold text-white uppercase tracking-tight font-heading">{load.destination}</span>
        </div>
      </div>

      {/* Row 3: Stat Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span className="text-xs">⚖</span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{load.weight.toLocaleString()} kg</span>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span className="text-xs text-blue-400">↔</span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{load.distance} km</span>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span className="text-xs">💰</span>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{load.price.toLocaleString()} GS</span>
        </div>
      </div>

      <div className="flex-grow" />

      {/* Row 4: Action or Delivered Status */}
      {load.status === 'en_transito' ? (
        <button
          onClick={handleComplete}
          className="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-all"
        >
          Marcar como entregado
        </button>
      ) : (
        <div className="pt-4 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
            <CheckCircle2 size={14} />
            <span>Entregado el {load.delivered_date}</span>
          </div>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold ml-5">Comisión acreditada</p>
        </div>
      )}
    </motion.div>
  );
};
