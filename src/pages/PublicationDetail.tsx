import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Package, DollarSign, MapPin, Truck, Inbox, Scale, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublishForm } from '../components/PublishForm';

const statusConfig = {
  confirmado: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Aceptado' },
  en_transito: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'En Tránsito' },
  entregado: { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'Entregado' },
  cancelado: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Cancelado' },
  pendiente: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Pendiente' },
};

const loadStatusConfig = {
  publicada: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Publicada' },
  asignada: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Asignada' },
  en_transito: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'En Tránsito' },
  entregada: { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'Entregado' },
};

const getStatusConfig = (status: string) => 
  statusConfig[status as keyof typeof statusConfig] ?? { color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10', label: status };

const getLoadStatusConfig = (status: string) => 
  loadStatusConfig[status as keyof typeof loadStatusConfig] ?? { color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10', label: status };

export default function PublicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { publications, incomingOrders, loads, togglePublicationStatus, updatePublication, acceptIncomingOrder, rejectIncomingOrder } = useAppData();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const pub = publications.find(p => p.id === id);

  if (!pub) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-white/30 font-bold uppercase tracking-widest">Publicación no encontrada</p>
    </div>
  );

  const pubOrders = (incomingOrders ?? []).filter(o => o.publication_id === id);
  const pubLoads = (loads as any[] ?? []).filter(l => l.publication_id === id);

  const totalKgSold = pubOrders
    .filter(o => o.status === 'aceptado')
    .reduce((acc, curr) => acc + curr.qty, 0);

  const totalIncome = pubOrders
    .filter(o => o.status === 'aceptado')
    .reduce((acc, curr) => acc + curr.total, 0);

  const handleToggle = () => {
    togglePublicationStatus(pub.id);
    showToast(pub.is_active ? 'Publicación pausada' : 'Publicación activada', 'info');
  };

  const handleEditSubmit = (data: any) => {
    updatePublication(pub.id, data);
    showToast('Publicación actualizada', 'success');
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/my-products')}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Mis Productos</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter leading-none">
                  {pub.product_name}
                </h1>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{pub.category}</p>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${pub.is_active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                {pub.is_active ? 'Activo' : 'Pausado'}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                <Package size={16} className="text-slate-500" />
                <span className="text-sm font-bold text-slate-300">{pub.stock_kg.toLocaleString()} KG Disponibles</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                <DollarSign size={16} className="text-emerald-500/60" />
                <span className="text-sm font-bold text-white">{pub.price_per_kg.toLocaleString()} GS/KG</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                <MapPin size={16} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-400">{pub.location_name}</span>
              </div>
            </div>
          </section>

          {/* Pedidos Recibidos Section */}
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] flex items-center gap-2">
              <Inbox size={14} />
              Pedidos Recibidos
            </h2>
            <div className="glass-card overflow-hidden border border-white/5">
              {pubOrders.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {pubOrders.map((order) => {
                    const config = getStatusConfig(order.status);
                    return (
                      <div 
                        key={order.id} 
                        onClick={() => navigate(`/incoming-orders/${order.id}`)}
                        className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate uppercase">{order.buyer_name ?? 'Comprador'}</p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {order.date ? new Date(order.date).toLocaleDateString('es-PY') : 'Fecha no disponible'}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs font-bold text-white">{(order.qty ?? 0).toLocaleString()} KG</p>
                            <p className="text-[10px] text-emerald-500 font-bold">{(order.total ?? 0).toLocaleString()} GS</p>
                          </div>
                          <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${config.bg} ${config.color} ${config.border}`}>
                            {config.label}
                          </div>
                          {order.status === 'pendiente' && (
                            <div className="flex gap-1 ml-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); rejectIncomingOrder(order.id); }}
                                className="w-8 h-8 flex items-center justify-center border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                              >✕</button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); acceptIncomingOrder(order.id); }}
                                className="px-3 h-8 bg-brand text-slate-950 text-[10px] font-bold rounded-lg uppercase tracking-widest"
                              >Aceptar</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-600 italic text-sm">
                  Aún no recibiste pedidos para este producto
                </div>
              )}
            </div>
          </section>

          {/* Cargas Generadas Section */}
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] flex items-center gap-2">
              <Truck size={14} />
              Cargas Generadas
            </h2>
            <div className="glass-card overflow-hidden border border-white/5">
              {pubLoads.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {pubLoads.map((load) => {
                    const lConfig = getLoadStatusConfig(load.status);
                    return (
                      <div key={load.id} className="p-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <div>
                            <p className="text-sm font-bold text-white uppercase tracking-tight">
                              {load.origin ?? 'Sin origen'} → {load.destination ?? 'Sin destino'}
                            </p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                              {(load.weight ?? 0).toLocaleString()} KG • {load.transporter_name || 'Habilitado para flete'}
                            </p>
                          </div>
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${lConfig.bg} ${lConfig.color} ${lConfig.border}`}>
                          {lConfig.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-600 italic text-sm">
                  No hay cargas generadas aún — aceptá un pedido para crear una
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="glass-card p-6 border border-white/10 space-y-6">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Resumen de Publicación</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Categoría</span>
                  <span className="text-white uppercase">{pub.category}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Disponible</span>
                  <span className="text-white">{pub.stock_kg.toLocaleString()} KG</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Precio/KG</span>
                  <span className="text-white">{pub.price_per_kg.toLocaleString()} GS</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Ubicación</span>
                  <span className="text-white">{pub.location_name}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Publicado</span>
                  <span className="text-white">{new Date(pub.created_at).toLocaleDateString('es-PY')}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pedidos</span>
                  <span className="text-sm font-bold text-white underline underline-offset-4 decoration-white/10">{pubOrders.length} recibidos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">KGs Vendidos</span>
                  <span className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                    <Scale size={14} />
                    {totalKgSold.toLocaleString()} kg
                  </span>
                </div>
                <div className="pt-2 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-[0.2em]">Ingresos Totales</span>
                    <p className="text-3xl font-bold text-emerald-500 font-heading leading-none">
                      {totalIncome.toLocaleString()} <small className="text-xs uppercase opacity-60">GS</small>
                    </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-3">
                <button
                  onClick={handleToggle}
                  className={`w-full py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                    pub.is_active 
                      ? 'border-slate-500/20 text-slate-500 hover:bg-white/5' 
                      : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'
                  }`}
                >
                  {pub.is_active ? '⏸ Pausar Publicación' : '▶ Activar Publicación'}
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Edit3 size={14} />
                  Editar Publicación
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <PublishForm 
                        onSubmit={handleEditSubmit}
                        editingProduct={pub}
                    />
                    <button 
                         onClick={() => setIsEditing(false)}
                         className="w-full mt-4 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest"
                    >
                         Cancelar edición
                    </button>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
