import type { Load, UserRole } from '../../lib/types';
import { Truck, Navigation, CircleDot } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  load: Load;
  role: UserRole | null;
  onAccept?: () => void;
}

export const LoadCard = ({ load, role, onAccept }: Props) => {
  const isTransporter = role === 'transporter';
  const isAvailable = load.status === 'publicada';

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="glass-card p-6 flex flex-col gap-4 border-l-4 border-l-green-500"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Truck size={18} className="text-green-500" />
          <span className="font-heading text-lg font-bold text-white uppercase tracking-wide">Servicio de Flete</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
          load.status === 'publicada' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        }`}>
          {load.status}
        </span>
      </div>

      <div className="bg-white/5 rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-slate-700 opacity-20" />
        
        <div className="flex items-start gap-4">
          <CircleDot size={14} className="mt-1 text-green-500" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-500">Origen</span>
            <span className="text-sm text-slate-200 font-semibold">{load.origin}</span>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Navigation size={14} className="mt-1 text-blue-500" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-500">Destino</span>
            <span className="text-sm text-slate-200 font-semibold">{load.destination}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-500">Carga</span>
            <span className="text-sm font-bold text-white uppercase font-heading">{load.product_name}</span>
          </div>
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-500">Peso</span>
            <span className="text-sm font-bold text-white uppercase font-heading">{load.weight_kg.toLocaleString()} KG</span>
          </div>
        </div>

        {isTransporter && isAvailable && (
          <button 
            onClick={onAccept}
            className="btn-primary py-2 px-4 text-xs"
          >
            Aceptar carga
          </button>
        )}
      </div>
    </motion.div>
  );
};
