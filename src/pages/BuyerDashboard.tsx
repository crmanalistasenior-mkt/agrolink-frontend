import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useAppData } from '../context/AppDataContext';
import { Package, Truck, CheckCircle, DollarSign, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BuyerDashboard() {
  const { user } = useUser();
  const { publications, orders } = useAppData();
  const navigate = useNavigate();

  // Metrics
  const activeOrders = orders.filter(o => o.status !== 'entregado' && o.status !== 'cancelado').length;
  const inTransitOrders = orders.filter(o => o.status === 'en_transito').length;
  const deliveredOrders = orders.filter(o => o.status === 'entregado').length;
  const totalSpent = orders.reduce((acc, curr) => acc + (curr.total ?? 0), 0);

  const recentOrders = [...orders].reverse().slice(0, 3);
  const featuredPubs = publications
    .filter(p => p.is_active)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'confirmado': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'en_transito': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'entregado': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      case 'cancelado': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-white/5 text-slate-400 border-white/10';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-slate-500 text-sm font-bold uppercase tracking-[0.3em] mb-2">Panel de Control</h1>
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
          { label: 'Pedidos Activos', value: activeOrders, icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-500/10', path: '/my-orders' },
          { label: 'En Tránsito', value: inTransitOrders, icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/my-orders' },
          { label: 'Entregados', value: deliveredOrders, icon: CheckCircle, color: 'text-slate-400', bg: 'bg-white/5', path: '/my-orders' },
          { label: 'Total Gastado', value: `${totalSpent.toLocaleString()} GS`, icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-500/10', path: '/my-orders' },
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
        {/* Recent Orders Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-tight">Pedidos Recientes</h3>
            <Link to="/my-orders" className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  onClick={() => navigate(`/my-orders/${order.id}`)}
                  className="glass-card p-4 border border-white/5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate uppercase">{order.product}</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {(order.qty ?? 0)}kg • {new Date(order.date).toLocaleDateString('es-PY')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xs font-bold text-emerald-500">{(order.total ?? 0).toLocaleString()} GS</p>
                    <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 border border-dashed border-white/5 rounded-2xl flex flex-col items-center gap-4">
                <p className="text-xs text-slate-500 font-medium italic">Aún no realizaste pedidos</p>
                <button 
                  onClick={() => navigate('/market')}
                  className="btn-primary py-2 px-6 text-[10px] uppercase tracking-widest"
                >
                  Ir al Marketplace
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Star size={18} className="text-brand" />
              Productos Destacados
            </h3>
            <Link to="/market" className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {featuredPubs.length > 0 ? (
              featuredPubs.map((pub) => (
                <div key={pub.id} className="glass-card p-4 border border-white/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-xl">
                      {pub.category === 'verduras' ? '🥦' : '🌾'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tight">{pub.product_name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                         {pub.location_name} • {(pub.price_per_kg ?? 0).toLocaleString()} GS/KG
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/market/${pub.id}`)}
                    className="px-4 py-2 bg-white/5 border border-white/10 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Ver
                  </button>
                </div>
              ))
            ) : (
              <div className="py-12 border border-dashed border-white/5 rounded-2xl text-center">
                <p className="text-xs text-slate-500 font-medium italic">No hay productos destacados disponibles</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
