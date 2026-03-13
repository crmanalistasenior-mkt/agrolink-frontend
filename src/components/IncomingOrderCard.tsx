import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useAppData, type IncomingOrder } from '../context/AppDataContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  order: IncomingOrder;
}

const statusConfig = {
  pendiente: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Pendiente' },
  aceptado: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Aceptado' },
  rechazado: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Rechazado' },
};

export const IncomingOrderCard = ({ order }: Props) => {
  const { showToast } = useToast();
  const { acceptIncomingOrder, rejectIncomingOrder } = useAppData();
  const navigate = useNavigate();
  const config = statusConfig[order.status];

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    acceptIncomingOrder(order.id);
    showToast('Pedido aceptado — carga creada', 'success');
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    rejectIncomingOrder(order.id);
    showToast('Pedido rechazado', 'warning');
  };

  return (
    <motion.div
      onClick={() => navigate(`/incoming-orders/${order.id}`)}
      whileHover={{ y: -4 }}
      className="glass-card-accent border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col p-6 h-full cursor-pointer"
    >
      {/* Row 1: Date & Status */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{order.date}</span>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${config.bg} ${config.color} ${config.border}`}>
          {config.label}
        </div>
      </div>

      {/* Row 2: Buyer Name */}
      <h3 className="font-heading text-2xl font-bold text-white uppercase tracking-tight mb-4">
        {order.buyer_name}
      </h3>

      {/* Row 3: Stats Pills */}
      <div className="flex gap-2 mb-6">
        <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span className="text-sm">📦</span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{order.qty.toLocaleString()} kg</span>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span className="text-sm">💰</span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{order.total.toLocaleString()} GS</span>
        </div>
      </div>

      {/* Row 4: Product & Destination */}
      <div className="space-y-2 mb-6">
        <p className="text-xs text-slate-500 font-medium italic">Producto: <span className="text-slate-300 not-italic">{order.product}</span></p>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-brand">→</span>
          <span className="text-xs font-bold uppercase tracking-tight">{order.destination}</span>
        </div>
      </div>

      <div className="flex-grow" />

      {/* Row 5: Actions or Result */}
      {order.status === 'pendiente' ? (
        <div className="flex gap-3 pt-4 border-t border-white/5">
          <button
            onClick={handleReject}
            className="flex-1 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className="flex-[2] py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-400 transition-colors"
          >
            Aceptar Pedido
          </button>
        </div>
      ) : order.status === 'aceptado' ? (
        <div className="pt-4 border-t border-white/5 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest">Carga creada y publicada</span>
        </div>
      ) : null}
    </motion.div>
  );
};
