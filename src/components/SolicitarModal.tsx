import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, User } from 'lucide-react';
import type { Publication } from '../lib/types';

interface Props {
  publication: Publication;
  onClose: () => void;
  onConfirm: (qty: number) => void;
}

export const SolicitarModal = ({ publication, onClose, onConfirm }: Props) => {
  const [qty, setQty] = useState<number>(1);
  const total = qty * publication.price_per_kg;
  const progress = (qty / publication.stock_kg) * 100;

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
        className="relative w-full max-w-md bg-[#0a1628] border border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-start">
          <div>
            <h2 className="font-heading text-2xl font-bold text-white uppercase tracking-tight">
              Solicitar Producto
            </h2>
            <div className="mt-1 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <User size={12} className="text-brand/60" />
                <span>{publication.producer_name || 'Productor'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <MapPin size={10} className="text-brand/40" />
                <span>{publication.location_name}</span>
              </div>
            </div>
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
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold text-emerald-500 uppercase tracking-wide">
              {publication.product_name}
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-brand/70 ml-1">
                Cantidad a solicitar (KG)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={publication.stock_kg}
                  value={qty}
                  onChange={(e) => setQty(Math.min(publication.stock_kg, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand focus:outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">KG</span>
              </div>
            </div>

            {/* Stock Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-slate-500">Stock disponible</span>
                <span className="text-slate-300">{publication.stock_kg.toLocaleString()} kg</span>
              </div>
              <div className="h-1.5 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-brand shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                />
              </div>
            </div>
          </div>

          {/* Calculator */}
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-emerald-500/60 tracking-[0.2em] mb-1">Total Estimado</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-brand font-heading tracking-tight">
                {total.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-brand/60 uppercase font-heading tracking-widest">Gs</span>
            </div>
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
            disabled={qty <= 0 || qty > publication.stock_kg}
            onClick={() => onConfirm(qty)}
            className="flex-[2] btn-primary py-3 px-6 h-12 uppercase tracking-widest text-xs disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Confirmar Pedido
          </button>
        </div>
      </motion.div>
    </div>
  );
};
