import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Circle, AlertTriangle, Truck, MapPin, Ruler, DollarSign } from 'lucide-react';

interface Load {
  id: string;
  origin: string;
  destination: string;
  weight: number;
  distance: number;
  status: 'publicada' | 'asignada' | 'en_transito' | 'entregada';
  price: number;
}

interface Props {
  load: Load;
  onClose: () => void;
  onConfirm: () => void;
}

export const AceptarCargaModal = ({ load, onClose, onConfirm }: Props) => {
  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-left">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-[#0a1628] border border-brand/20 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-brand/5">
          <div className="flex items-center gap-2">
            <Truck size={20} className="text-brand" />
            <h2 className="font-heading text-xl font-bold text-white uppercase tracking-tight">
              Confirmar Aceptación
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Route Summary Card */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <Circle size={8} className="text-brand/60 fill-brand/20" />
                <span className="text-sm font-medium text-slate-400">{load.origin}</span>
              </div>
              <div className="border-l-2 border-brand/40 ml-1 h-6 my-1" />
              <div className="flex items-center gap-3">
                <Circle size={8} className="text-brand fill-brand shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                <span className="text-base font-bold text-white uppercase tracking-tight font-heading">{load.destination}</span>
              </div>
            </div>
          </div>

          {/* Stats Table */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin size={14} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Peso Sugerido</span>
              </div>
              <span className="text-sm font-bold text-white uppercase font-heading">{load.weight.toLocaleString()} KG</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <div className="flex items-center gap-2 text-slate-500">
                <Ruler size={14} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Distancia aprox.</span>
              </div>
              <span className="text-sm font-bold text-white uppercase font-heading">{load.distance} KM</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <div className="flex items-center gap-2 text-slate-500">
                <DollarSign size={14} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Flete estimado</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-brand font-heading">{load.price.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-brand/60 uppercase font-heading tracking-widest">Gs</span>
              </div>
            </div>
          </div>

          {/* Warning Note */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3">
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-amber-200/70 font-medium">
              <span className="font-bold text-amber-400 uppercase tracking-wider block mb-0.5">Atención</span>
              Al aceptar, te comprometés a realizar el transporte en la fecha acordada y con las condiciones sanitarias requeridas.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="flex-[2] btn-primary py-3 px-6 h-12 uppercase tracking-widest text-xs shadow-lg shadow-brand/10"
          >
            Aceptar Carga
          </button>
        </div>
      </motion.div>
    </div>
  );
};
