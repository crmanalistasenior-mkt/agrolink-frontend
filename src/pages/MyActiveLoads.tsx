import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { ActiveLoadCard } from '../components/ActiveLoadCard';
import { Truck, Navigation, TrendingUp, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FILTERS = ['Todas', 'En tránsito', 'Entregadas'];

export default function MyActiveLoads() {
  const { myLoads } = useAppData();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Todas');

  const filtered = myLoads.filter(load => {
    if (activeFilter === 'En tránsito') return load.status === 'en_transito';
    if (activeFilter === 'Entregadas') return load.status === 'entregado';
    return true;
  });

  const totalCount = myLoads.length;
  const inTransitCount = myLoads.filter(l => l.status === 'en_transito').length;
  const totalEarned = myLoads
    .filter(l => l.status === 'entregado')
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-8">
      <header className="space-y-6">
        <div>
          <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter">Mis Cargas</h1>
          <p className="text-slate-500 mt-1 font-medium">Seguí tus viajes activos y el historial de tus ganancias.</p>
        </div>

        {/* Summary Bar */}
        <div className="flex flex-wrap gap-4">
          <div className="glass-card flex-1 min-w-[160px] p-4 border-l-4 border-emerald-500/20">
            <div className="flex items-center gap-3 mb-2 text-slate-500">
              <Package size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Total Viajes</span>
            </div>
            <p className="text-2xl font-bold text-white font-heading">{totalCount}</p>
          </div>
          <div className="glass-card flex-1 min-w-[160px] p-4 border-l-4 border-blue-500/20">
            <div className="flex items-center gap-3 mb-2 text-blue-400">
              <Navigation size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">En Tránsito</span>
            </div>
            <p className="text-2xl font-bold text-white font-heading">{inTransitCount}</p>
          </div>
          <div className="glass-card flex-1 min-w-[200px] p-4 border-l-4 border-emerald-500">
            <div className="flex items-center gap-3 mb-2 text-emerald-500">
              <TrendingUp size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Ganancia Total</span>
            </div>
            <p className="text-2xl font-bold text-white font-heading">
                {totalEarned.toLocaleString()} <span className="text-xs uppercase text-brand">gs</span>
            </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
        <AnimatePresence mode="popLayout">
          {filtered.map((load) => (
            <motion.div
              key={load.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveLoadCard load={load} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-full py-24 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-500 space-y-6">
            <div className="bg-white/5 p-8 rounded-full">
              <Truck size={64} className="opacity-10" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-white/40 uppercase tracking-tight">Sin cargas asignadas</h3>
              <p className="text-sm font-medium italic">Aceptá una carga desde el tablero para verla aquí</p>
            </div>
            <button 
                onClick={() => navigate('/loads')}
                className="btn-secondary py-3 px-8 text-xs h-12"
            >
                Ver cargas disponibles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
