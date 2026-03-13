import { useState, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import { IncomingOrderCard } from '../components/IncomingOrderCard';
import { Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewToggle, type ViewMode } from '../components/ViewToggle';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const statusConfig: Record<string, { color: string, bg: string, border: string, label: string }> = {
  pendiente: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Pendiente' },
  aceptado: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Aceptado' },
  rechazado: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Rechazado' },
};

const FILTERS = ['Todos', 'Pendientes', 'Aceptados', 'Rechazados'];

export default function MyIncomingOrders() {
  const { incomingOrders, acceptIncomingOrder, rejectIncomingOrder } = useAppData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (localStorage.getItem('incomingOrdersView') as ViewMode) ?? 'grid'
  );

  useEffect(() => localStorage.setItem('incomingOrdersView', viewMode), [viewMode]);

  const handleAccept = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    acceptIncomingOrder(id);
    showToast('Pedido aceptado — carga creada', 'success');
  };

  const handleReject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    rejectIncomingOrder(id);
    showToast('Pedido rechazado', 'warning');
  };

  const filtered = incomingOrders.filter(order => {
    if (activeFilter === 'Pendientes') return order.status === 'pendiente';
    if (activeFilter === 'Aceptados') return order.status === 'aceptado';
    if (activeFilter === 'Rechazados') return order.status === 'rechazado';
    return true;
  });

  const total = incomingOrders.length;
  const pending = incomingOrders.filter(o => o.status === 'pendiente').length;
  const accepted = incomingOrders.filter(o => o.status === 'aceptado').length;

  return (
    <div className="space-y-8">
      <header className="space-y-6">
        <div>
          <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter">Pedidos Recibidos</h1>
          <p className="text-slate-500 mt-1 font-medium">Gestioná las solicitudes de tus compradores en tiempo real.</p>
        </div>

        {/* Summary Bar */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex flex-col min-w-[140px]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Recibidos</span>
            <span className="text-2xl font-bold text-white font-heading">{total}</span>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/10 px-6 py-4 rounded-2xl flex flex-col min-w-[140px]">
            <span className="text-[10px] font-bold text-amber-500/60 uppercase tracking-[0.2em] mb-1">Pendientes</span>
            <span className="text-2xl font-bold text-amber-500 font-heading">{pending}</span>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/10 px-6 py-4 rounded-2xl flex flex-col min-w-[140px]">
            <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.2em] mb-1">Aceptados</span>
            <span className="text-2xl font-bold text-emerald-500 font-heading">{accepted}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeFilter === f 
                    ? 'bg-brand text-slate-950 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
      </header>

      {viewMode === 'list' ? (
        <div className="flex flex-col gap-2">
          {filtered.map((order) => {
            const config = statusConfig[order.status] || { bg: 'bg-gray-500/10', color: 'text-gray-500', border: 'border-gray-500/20', label: order.status };
            return (
              <div 
                key={order.id}
                onClick={() => navigate(`/incoming-orders/${order.id}`)}
                className="flex items-center gap-4 px-5 py-3 h-20 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/30 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-xl">
                  {order.status === 'aceptado' ? '✅' : order.status === 'rechazado' ? '❌' : '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-heading text-lg text-white truncate leading-none">{order.buyer_name}</p>
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-medium truncate">{order.product} → {order.destination}</p>
                </div>
                <div className="hidden md:block text-slate-400 font-medium text-sm min-w-[90px]">{order.qty.toLocaleString()} kg</div>
                <div className="text-right min-w-[130px]">
                  <span className="font-heading text-xl text-emerald-400">{order.total.toLocaleString()}</span>
                  <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest ml-1">Gs</span>
                </div>
                <div className="flex gap-2 ml-4">
                  {order.status === 'pendiente' && (
                    <>
                      <button
                        onClick={(e) => handleReject(e, order.id)}
                        className="flex-shrink-0 px-3 py-2 border border-red-500/30 hover:bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors h-9"
                      >
                        Rechazar
                      </button>
                      <button
                        onClick={(e) => handleAccept(e, order.id)}
                        className="flex-shrink-0 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors h-9"
                      >
                        Aceptar
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-24 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-500 space-y-4">
              <div className="bg-white/5 p-6 rounded-full">
                <Inbox size={48} className="opacity-20" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white/40 uppercase tracking-tight">Sin pedidos recibidos</h3>
                <p className="text-sm font-medium italic">Cuando un comprador solicite tu producto aparecerá aquí</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
          <AnimatePresence mode="popLayout">
            {filtered.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <IncomingOrderCard order={order} />
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="col-span-full py-24 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-500 space-y-4">
              <div className="bg-white/5 p-6 rounded-full">
                <Inbox size={48} className="opacity-20" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white/40 uppercase tracking-tight">Sin pedidos recibidos</h3>
                <p className="text-sm font-medium italic">Cuando un comprador solicite tu producto aparecerá aquí</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
