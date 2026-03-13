import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useAppData } from '../context/AppDataContext';
import { Truck, CheckCircle, MapPin, DollarSign, ArrowRight, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TransporterDashboard() {
  const { user } = useUser();
  const { myLoads, loads, advanceLoadStatus } = useAppData();
  const navigate = useNavigate();

  const todayStr = new Date().toLocaleDateString('es-PY');
  
  // Metrics
  const activeLoads = myLoads.filter(l => l.status === 'en_transito').length;
  const deliveriesToday = myLoads.filter(l => l.status === 'entregado' && l.delivered_date === todayStr).length;
  const totalKm = myLoads
    .filter(l => l.status === 'entregado')
    .reduce((acc, curr) => acc + (curr.distance || 0), 0);
  const monthlyEarnings = myLoads
    .filter(l => l.status === 'entregado')
    .reduce((acc, curr) => acc + (curr.price || 0), 0);

  const activeRecent = myLoads.filter(l => l.status === 'en_transito').slice(0, 3);
  const availableNearby = (loads as any[]).filter(l => l.status === 'publicada').slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-slate-500 text-sm font-bold uppercase tracking-[0.3em] mb-2">Logística y Transporte</h1>
          <h2 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter">
            Bienvenido, <span className="text-brand">{user?.full_name?.split(' ')[0]}</span>
          </h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {new Date().toLocaleDateString('es-PY', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Cargas Activas', value: activeLoads, icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/my-loads' },
          { label: 'Entregas Hoy', value: deliveriesToday, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', path: '/my-loads' },
          { label: 'KM Recorridos', value: `${totalKm.toLocaleString()} km`, icon: Navigation, color: 'text-amber-500', bg: 'bg-amber-500/10', path: '/my-loads' },
          { label: 'Ganancias Mes', value: `${monthlyEarnings.toLocaleString()} GS`, icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-500/10', path: '/my-loads' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4, borderColor: 'rgba(34, 197, 94, 0.2)' }}
            onClick={() => navigate(stat.path)}
            className="glass-card p-4 border border-white/5 cursor-pointer transition-all flex flex-col gap-3"
          >
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-white font-heading">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Loads Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-tight">Cargas Activas</h3>
            <Link to="/my-loads" className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline flex items-center gap-1">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {activeRecent.length > 0 ? (
              activeRecent.map((load) => (
                <div key={load.id} className="glass-card p-4 border border-white/5 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate uppercase">
                      {load.origin} → {load.destination}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {load.weight.toLocaleString()}kg • {(load.price ?? 0).toLocaleString()} GS
                    </p>
                  </div>
                  <button 
                    onClick={() => advanceLoadStatus(load.id)}
                    className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-bold rounded-lg uppercase tracking-widest hover:bg-emerald-500/20 transition-all whitespace-nowrap"
                  >
                    Entregado
                  </button>
                </div>
              ))
            ) : (
              <div className="py-12 border border-dashed border-white/5 rounded-2xl flex flex-col items-center gap-4">
                <p className="text-xs text-slate-500 font-medium italic">No tenés cargas activas</p>
                <button 
                  onClick={() => navigate('/loads')}
                  className="btn-primary py-2 px-6 text-[10px] uppercase tracking-widest"
                >
                  Ver cargas disponibles
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Available Loads Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-tight">Cargas Disponibles Cerca</h3>
            <Link to="/loads" className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline flex items-center gap-1">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {availableNearby.length > 0 ? (
              availableNearby.map((load) => (
                <div key={load.id} className="glass-card p-4 border border-white/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-slate-400">
                        <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tight">
                        {load.origin} → {load.destination}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                         {load.weight.toLocaleString()} KG • {load.price.toLocaleString()} GS
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/loads`)}
                    className="px-4 py-2 bg-white/5 border border-white/10 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Ver
                  </button>
                </div>
              ))
            ) : (
              <div className="py-12 border border-dashed border-white/5 rounded-2xl text-center">
                <p className="text-xs text-slate-500 font-medium italic">No hay cargas disponibles en este momento</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
