import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { IncomingOrderCard } from '../components/IncomingOrderCard';
import { Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FILTERS = ['Todos', 'Pendientes', 'Aceptados', 'Rechazados'];

export default function MyIncomingOrders() {
  const { incomingOrders } = useAppData();
  const [activeFilter, setActiveFilter] = useState('Todos');

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

        {/* Filter Pills */}
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
      </header>

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
    </div>
  );
}
