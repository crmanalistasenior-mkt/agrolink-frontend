import { motion } from 'framer-motion';
import { Package, DollarSign, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export type OrderStatus = 'pendiente' | 'confirmado' | 'en_transito' | 'entregado' | 'cancelado';

export interface Order {
  id: string;
  date: string;
  product: string;
  qty: number;
  total: number;
  status: OrderStatus;
  producer: string;
  destination: string;
}

interface Props {
  order: Order;
}

const statusConfig = {
  pendiente: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Pendiente' },
  confirmado: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Confirmado' },
  en_transito: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'En Tránsito' },
  entregado: { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'Entregado' },
  cancelado: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Cancelado' },
};

const STEPS = ['Confirmado', 'Carga asignada', 'En tránsito', 'Entregado'];

export const OrderCard = ({ order }: Props) => {
  const config = statusConfig[order.status];
  const showProgress = order.status === 'en_transito' || order.status === 'entregado';

  const getStepStatus = (index: number) => {
    if (order.status === 'entregado') return 'completed';
    if (order.status === 'en_transito' && index <= 2) return 'completed';
    if (order.status === 'confirmado' && index === 0) return 'completed';
    return 'pending';
  };

  return (
    <Link to={`/my-orders/${order.id}`} className="block h-full group">
      <motion.div
        whileHover={{ y: -4 }}
        className="glass-card-accent border border-white/5 group-hover:border-emerald-500/40 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.05)] transition-all duration-300 flex flex-col p-6 h-full relative"
      >
        {/* Row 1: Date & Status */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {new Date(order.date).toLocaleDateString('es-PY', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
          <div className={`${config.bg} ${config.border} border px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
            {config.label}
          </div>
        </div>

        {/* Row 2: Product Name */}
        <h3 className="font-heading text-2xl font-bold text-white uppercase tracking-tight mb-4 group-hover:text-brand transition-colors">
          {order.product}
        </h3>

        {/* Row 3: Stat Pills */}
        <div className="flex gap-2 mb-6">
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Package size={14} className="text-slate-500" />
            <span className="text-xs font-bold text-slate-300">{order.qty.toLocaleString()} <small className="text-[10px] opacity-60">KG</small></span>
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <DollarSign size={14} className="text-brand/60" />
            <span className="text-xs font-bold text-white">{order.total.toLocaleString()} <small className="text-[10px] text-brand uppercase">Gs</small></span>
          </div>
        </div>

        {/* Row 4: Route Info */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="font-bold uppercase tracking-wider">Productor:</span>
            <span className="text-slate-300 font-medium">{order.producer}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <MapPin size={12} className="text-brand/40" />
            <span className="text-white/60">→ {order.destination}</span>
          </div>
        </div>

        {/* Row 5: Progress Bar */}
        {showProgress && (
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center justify-between relative px-1">
              {/* Progress line */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0" />
              
              {STEPS.map((step, i) => {
                const status = getStepStatus(i);
                return (
                  <div key={step} className="flex flex-col items-center gap-2 z-10">
                    <div className={`w-2 h-2 rounded-full border-2 ${status === 'completed' ? 'bg-brand border-brand shadow-[0_0_8px_#22c55e]' : 'bg-slate-900 border-white/20'}`} />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3">
               <span className="text-[8px] font-bold uppercase tracking-[0.05em] text-brand text-center w-0 whitespace-nowrap overflow-visible flex justify-center">{STEPS[0]}</span>
               <span className="text-[8px] font-bold uppercase tracking-[0.05em] text-center w-0 whitespace-nowrap overflow-visible flex justify-center text-white/20">{STEPS[1]}</span>
               <span className="text-[8px] font-bold uppercase tracking-[0.05em] text-center w-0 whitespace-nowrap overflow-visible flex justify-center text-brand">{STEPS[2]}</span>
               <span className="text-[8px] font-bold uppercase tracking-[0.05em] text-center w-0 whitespace-nowrap overflow-visible flex justify-center text-white/20">{STEPS[3]}</span>
            </div>
          </div>
        )}

        {/* Right Arrow */}
        <div className="absolute bottom-4 right-4 text-white/0 group-hover:text-white/20 transition-all duration-300">
          <ArrowRight size={16} />
        </div>
      </motion.div>
    </Link>
  );
};
