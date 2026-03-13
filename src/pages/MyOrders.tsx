import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { OrderCard } from '../components/cards/OrderCard';
import { ViewToggle, type ViewMode } from '../components/ViewToggle';
import { ShoppingBag, Truck, DollarSign, ArrowLeft, PackageSearch } from 'lucide-react';
import { SkeletonOrderCard } from '../components/Skeleton';

import { useAppData } from '../context/AppDataContext';

export default function MyOrders() {
  const { role, user } = useUser();
  const navigate = useNavigate();
  const { orders } = useAppData();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (localStorage.getItem('myOrdersView') as ViewMode) ?? 'grid'
  );

  useEffect(() => localStorage.setItem('myOrdersView', viewMode), [viewMode]);


  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (role === 'transporter' && user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="bg-blue-500/10 p-6 rounded-3xl border border-blue-500/20">
          <Truck size={64} className="text-blue-500 mx-auto" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-3xl font-bold text-white uppercase tracking-tight">Vea sus fletes</h2>
          <p className="text-slate-500 max-w-xs mx-auto">Los transportistas no gestionan pedidos de compra, sino fletes de carga.</p>
        </div>
        <button 
          onClick={() => navigate('/loads')}
          className="btn-secondary group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Ver Cargas Disponibles
        </button>
      </div>
    );
  }

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((acc: number, curr: any) => acc + curr.total, 0);
  const inTransit = orders.filter((o: any) => o.status === 'en_transito').length;

  return (
    <div className="space-y-8">
      <header className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter">Mis Pedidos</h1>
            <p className="text-slate-500 mt-1 font-medium">Seguí el estado de tus compras y entregas.</p>
          </div>
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>


        {/* Summary Bar */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 border-l-4 border-l-brand flex items-center gap-4">
              <div className="bg-brand/10 p-2 rounded-xl text-brand">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Total Pedidos</p>
                <p className="text-xl font-bold text-white font-heading">{totalOrders}</p>
              </div>
            </div>
            
            <div className="glass-card p-4 border-l-4 border-l-blue-500 flex items-center gap-4">
              <div className="bg-blue-500/10 p-2 rounded-xl text-blue-500">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">En Tránsito</p>
                <p className="text-xl font-bold text-white font-heading">{inTransit}</p>
              </div>
            </div>

            <div className="glass-card p-4 border-l-4 border-l-amber-500 flex items-center gap-4">
              <div className="bg-amber-500/10 p-2 rounded-xl text-amber-500">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Inversión Total</p>
                <p className="text-xl font-bold text-white font-heading">{totalSpent.toLocaleString()} <span className="text-xs text-amber-500/70">Gs</span></p>
              </div>
            </div>
          </div>
        )}
      </header>

      {viewMode === 'list' ? (
        <div className="flex flex-col gap-2">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
            ))
          ) : (
            <>
              {orders.map((order: any) => {
                let statusStyle = 'bg-white/5 text-slate-400 border-white/10';
                switch (order.status) {
                  case 'pendiente': statusStyle = 'bg-amber-500/10 text-amber-500 border-amber-500/20'; break;
                  case 'confirmado': statusStyle = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'; break;
                  case 'en_transito': statusStyle = 'bg-blue-500/10 text-blue-500 border-blue-500/20'; break;
                  case 'entregado': statusStyle = 'bg-slate-500/10 text-slate-500 border-slate-500/20'; break;
                  case 'cancelado': statusStyle = 'bg-red-500/10 text-red-500 border-red-500/20'; break;
                }

                return (
                  <div 
                    key={order.id}
                    onClick={() => navigate(`/my-orders/${order.id}`)}
                    className="flex items-center gap-4 px-5 py-3 h-20 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/30 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-500 group-hover:bg-emerald-500/20 transition-colors">
                      <ShoppingBag size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-lg text-white truncate leading-none mb-1 group-hover:text-emerald-400 transition-colors">{order.product}</p>
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${statusStyle}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="hidden md:block text-slate-400 font-medium text-sm min-w-[120px]">
                      {new Date(order.date).toLocaleDateString('es-PY')}
                    </div>
                    <div className="hidden md:block text-slate-400 font-medium text-sm min-w-[90px]">
                      {order.qty} kg
                    </div>
                    <div className="text-right min-w-[130px]">
                      <span className="font-heading text-xl text-emerald-400">{(order.total ?? 0).toLocaleString()}</span>
                      <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest ml-1">Gs</span>
                    </div>
                  </div>
                );
              })}

              {orders.length === 0 && (
                <div className="col-span-full py-24 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <PackageSearch size={48} className="opacity-20" />
                  <p className="text-lg font-medium italic">Aún no tenés pedidos registrados.</p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <SkeletonOrderCard key={i} />
            ))
          ) : (
            <>
              {orders.map((order: any) => (
                <OrderCard key={order.id} order={order} />
              ))}

              {orders.length === 0 && (
                <div className="col-span-full py-24 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <PackageSearch size={48} className="opacity-20" />
                  <p className="text-lg font-medium italic">Aún no tenés pedidos registrados.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

    </div>
  );
}
