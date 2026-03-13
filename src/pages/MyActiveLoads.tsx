import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { ActiveLoadCard } from '../components/ActiveLoadCard';
import { ViewToggle, type ViewMode } from '../components/ViewToggle';
import { useToast } from '../context/ToastContext';
import { Truck, Navigation, TrendingUp, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig: Record<string, { color: string, bg: string, border: string, label: string }> = {
  en_transito: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'En Tránsito' },
  entregado: { color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20', label: 'Entregado' },
};


const FILTERS = ['Todas', 'En tránsito', 'Entregadas'];

export default function MyActiveLoads() {
  const { myLoads, advanceLoadStatus } = useAppData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (localStorage.getItem('myLoadsView') as ViewMode) ?? 'grid'
  );

  useEffect(() => localStorage.setItem('myLoadsView', viewMode), [viewMode]);


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

        {/* Filter Pills and Toggle */}
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
          {filtered.map((load) => {
            const config = statusConfig[load.status] || { bg: 'bg-white/5', color: 'text-slate-400', border: 'border-white/10', label: load.status };
            return (
              <div 
                key={load.id}
                onClick={() => navigate(`/my-loads/${load.id}`)}
                className="flex items-center gap-4 px-5 py-3 h-20 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/30 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-xl">
                  🚚
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-lg text-white truncate leading-none mb-1">{load.origin} → {load.destination}</p>
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${config.border} ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <div className="hidden md:block text-slate-400 font-medium text-sm min-w-[90px]">{load.weight.toLocaleString()} kg</div>
                <div className="hidden md:block text-slate-400 font-medium text-sm min-w-[80px]">{load.distance} km</div>
                <div className="text-right min-w-[130px]">
                  <span className="font-heading text-xl text-emerald-400">{load.price.toLocaleString()}</span>
                  <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest ml-1">Gs</span>
                </div>
                {load.status === 'en_transito' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      advanceLoadStatus(load.id);
                      showToast('¡Entrega confirmada!', 'success');
                    }}
                    className="flex-shrink-0 ml-4 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors h-9"
                  >
                    Entregado
                  </button>
                ) : (
                  <div className="flex-shrink-0 ml-4 w-[110px] text-center">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Completado</span>
                  </div>
                )}
              </div>
            );
          })}

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
      ) : (
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
      )}
    </div>

  );
}
