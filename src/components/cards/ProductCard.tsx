import { useState } from 'react';
import type { Publication, UserRole } from '../../lib/types';
import { Package, MapPin, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SolicitarModal } from '../SolicitarModal';
import { useToast } from '../../context/ToastContext';
import { useAppData } from '../../context/AppDataContext';

interface Props {
  publication: Publication;
  role: UserRole | null;
  onAction?: () => void;
}

export const ProductCard = ({ publication, role, onAction }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();
  const { addOrder, updatePublication } = useAppData();
  const isBuyer = role === 'buyer';
  const isPaused = publication.is_active === false;

  const handleConfirmOrder = (requestedQty: number) => {
    const newOrder = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      product: publication.product_name,
      qty: requestedQty,
      total: requestedQty * publication.price_per_kg,
      status: 'confirmado',
      producer: publication.producer_name || 'Productor',
      destination: 'Asunción',
    };
    
    addOrder(newOrder);
    updatePublication(publication.id, {
      stock_kg: publication.stock_kg - requestedQty
    });

    showToast('Pedido enviado correctamente', 'success');
    setShowModal(false);
    if (onAction) onAction();
  };

  return (
    <>
      <motion.div 
        whileHover={!isPaused ? { y: -4 } : {}}
        className={`glass-card-accent border transition-all duration-300 flex flex-col group overflow-hidden h-full max-w-full 
          ${isPaused 
            ? 'opacity-60 grayscale-[0.5] border-white/5 cursor-not-allowed' 
            : 'border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]'}`}
      >
        {/* Visual Header / Placeholder Image */}
        <div className={`h-32 w-full bg-gradient-to-br from-emerald-500/10 to-transparent flex items-center justify-center border-b border-emerald-500/10 relative overflow-hidden ${isPaused ? 'from-slate-500/10' : ''}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent)]" />
          <span className="text-4xl filter drop-shadow-lg z-10 transition-transform duration-500 group-hover:scale-110">
            {isPaused ? '⏸' : '🌾'}
          </span>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-4">
            <h3 className={`font-heading text-2xl font-bold text-white uppercase tracking-tight ${!isPaused ? 'group-hover:text-brand transition-colors' : ''}`}>
              {publication.product_name}
            </h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${isPaused ? 'bg-slate-500/10 text-slate-500 border-white/10' : 'bg-brand/10 text-brand border-brand/20'}`}>
              {isPaused ? 'Pausado' : 'En Stock'}
            </span>
          </div>

          <div className="space-y-3 flex-grow">
            <div className="flex items-center gap-2 text-slate-400">
              <Package size={16} className={isPaused ? 'text-slate-600' : 'text-brand/60'} />
              <span className="text-sm font-medium">{publication.stock_kg.toLocaleString()} kg disponibles</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin size={16} className={isPaused ? 'text-slate-600' : 'text-brand/60'} />
              <span className="text-sm font-medium">{publication.location_name}</span>
            </div>
            {publication.producer_name && (
              <div className="flex items-center gap-2 text-slate-500">
                <User size={16} className={isPaused ? 'text-slate-600' : 'text-brand/40'} />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider leading-none">Productor</span>
                  <span className="text-sm font-semibold text-slate-400">{publication.producer_name}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Precio por KG</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white font-heading">{publication.price_per_kg.toLocaleString()}</span>
                <span className={`text-xs font-semibold font-heading uppercase ${isPaused ? 'text-slate-500' : 'text-brand'}`}>Gs</span>
              </div>
            </div>

            {isBuyer && !isPaused && (
              <button 
                onClick={() => setShowModal(true)}
                className="btn-primary py-2 px-4 text-xs h-9"
              >
                Solicitar
                <ArrowRight size={14} />
              </button>
            )}
            
            {isBuyer && isPaused && (
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">Temporalmente pausado</span>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <SolicitarModal 
            publication={publication}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirmOrder}
          />
        )}
      </AnimatePresence>
    </>
  );
};
