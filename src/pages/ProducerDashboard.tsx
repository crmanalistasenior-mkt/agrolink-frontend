import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useAppData } from '../context/AppDataContext';
import { Sprout, Inbox, Scale, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProducerDashboard() {
  const { user } = useUser();
  const { publications, incomingOrders, acceptIncomingOrder, rejectIncomingOrder } = useAppData();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];
  
  // Metrics
  const activePubs = publications.filter(p => p.is_active).length;
  const pendingOrders = incomingOrders.filter(o => o.status === 'pendiente');
  const pendingCount = pendingOrders.length;
  
  const kgSoldToday = incomingOrders
    .filter(o => o.status === 'aceptado' && o.date.startsWith(todayStr))
    .reduce((acc, curr) => acc + curr.qty, 0);
    
  const monthlyIncome = incomingOrders
    .filter(o => o.status === 'aceptado')
    .reduce((acc, curr) => acc + curr.total, 0);

  const pendingRecent = pendingOrders.slice(0, 3);
  const myRecentPubs = publications.slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-slate-500 text-sm font-bold uppercase tracking-[0.3em] mb-2">Resumen Operativo</h1>
          <h2 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter">
            Bienvenido, <span className="text-brand">{user?.full_name?.split(' ')[0]}</span>
          </h2>
        </div>
        <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date().toLocaleDateString('es-PY', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Publicaciones Activas', value: activePubs, icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-500/10', path: '/my-products' },
          { label: 'Pedidos Pendientes', value: pendingCount, icon: Inbox, color: 'text-amber-500', bg: 'bg-amber-500/10', path: '/incoming-orders' },
          { label: 'KG Vendidos Hoy', value: `${kgSoldToday.toLocaleString()} kg`, icon: Scale, color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/incoming-orders' },
          { label: 'Ingresos del Mes', value: `${monthlyIncome.toLocaleString()} GS`, icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-500/10', path: '/incoming-orders' },
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
        {/* Pending Orders Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-tight">Pedidos Pendientes</h3>
            <Link to="/incoming-orders" className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingRecent.length > 0 ? (
              pendingRecent.map((order) => (
                <div key={order.id} className="glass-card p-4 border border-white/5 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate uppercase">{order.buyer_name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{order.product} • {order.qty}kg</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => rejectIncomingOrder(order.id)}
                      className="p-2 border border-white/10 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Rechazar"
                    >
                      ✕
                    </button>
                    <button 
                      onClick={() => acceptIncomingOrder(order.id)}
                      className="px-3 py-2 bg-brand text-slate-950 text-[10px] font-bold rounded-lg uppercase tracking-widest hover:bg-brand/80 transition-all"
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 border border-dashed border-white/5 rounded-2xl text-center">
                <p className="text-xs text-slate-500 font-medium italic">No hay pedidos pendientes</p>
              </div>
            )}
          </div>
        </section>

        {/* Active Publications Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-tight">Mis Publicaciones</h3>
            <Link to="/my-products" className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline flex items-center gap-1">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {myRecentPubs.length > 0 ? (
              myRecentPubs.map((pub) => (
                <div key={pub.id} className="glass-card p-4 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-lg">
                        {pub.category === 'verduras' ? '🥦' : '🌾'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tight">{pub.product_name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                         {pub.price_per_kg.toLocaleString()} GS/KG • {pub.stock_kg.toLocaleString()} KG
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${pub.is_active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                    {pub.is_active ? 'Activo' : 'Pausado'}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 border border-dashed border-white/5 rounded-2xl flex flex-col items-center gap-4">
                <p className="text-xs text-slate-500 font-medium italic">Aún no publicaste productos</p>
                <button 
                  onClick={() => navigate('/my-products')}
                  className="btn-primary py-2 px-4 text-[10px] uppercase tracking-widest"
                >
                  Publicar producto
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
