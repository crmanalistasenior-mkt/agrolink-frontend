import { useState } from 'react';
import { Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '../lib/types';
import { AceptarCargaModal } from './AceptarCargaModal';
import { useToast } from '../context/ToastContext';
import { useAppData } from '../context/AppDataContext';
import { useNavigate } from 'react-router-dom';


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
  role: UserRole | null;
  onAccept?: () => void;
}

const statusConfig = {
  publicada: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Publicada' },
  asignada: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Asignada' },
  en_transito: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'En Tránsito' },
  entregada: { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'Entregada' },
};

export const LoadCard = ({ load, role, onAccept }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();
  const { updateLoadStatus } = useAppData();
  const navigate = useNavigate();

  
  const config = statusConfig[load.status];
  const isTransporter = role === 'transporter';
  const isAvailable = load.status === 'publicada';

  const handleConfirmAccept = () => {
    updateLoadStatus(load.id, 'asignada');
    showToast('Carga aceptada. ¡Buen viaje!', 'success');
    setShowModal(false);
    if (onAccept) onAccept();
  };

  return (
    <>
      <motion.div
        onClick={() => navigate(`/loads/${load.id}`)}
        whileHover={{ y: -4 }}
        className="glass-card-accent border border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.05)] transition-all duration-300 flex flex-col p-6 h-full cursor-pointer"
      >

        {/* Route Section */}
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-3">
            <Circle size={8} className="text-emerald-500/60 fill-emerald-500/20" />
            <span className="text-sm font-medium text-slate-400">{load.origin}</span>
          </div>
          <div className="border-l-2 border-emerald-500/40 ml-1 h-4 my-1" />
          <div className="flex items-center gap-3">
            <Circle size={8} className="text-emerald-500 fill-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            <span className="text-base font-bold text-white uppercase tracking-tight font-heading">{load.destination}</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="text-xs">⚖</span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{load.weight.toLocaleString()} kg</span>
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="text-xs text-blue-400">↔</span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{load.distance} km</span>
          </div>
          <div className={`${config.bg} ${config.border} border px-3 py-1.5 rounded-full flex items-center gap-2`}>
            <div className={`w-1.5 h-1.5 rounded-full ${config.color} bg-current`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>{config.label}</span>
          </div>
        </div>

        <div className="flex-grow" />

        {/* Bottom Section */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">FLETE EST.</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white font-heading tracking-tight">{load.price.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase font-heading">Gs</span>
            </div>
          </div>

          {isTransporter && isAvailable && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
              className="btn-primary py-2 px-5 text-xs h-9 uppercase tracking-widest"
            >

              Aceptar carga
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <AceptarCargaModal 
            load={load}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirmAccept}
          />
        )}
      </AnimatePresence>
    </>
  );
};
