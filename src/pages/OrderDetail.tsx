import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Package, DollarSign, MapPin, Truck, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig = {
  pendiente: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Pendiente' },
  confirmado: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Confirmado' },
  en_transito: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'En Tránsito' },
  entregado: { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'Entregado' },
  cancelado: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Cancelado' },
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, cancelOrder } = useAppData();
  const { showToast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);

  const order = orders.find(o => o.id === id);

  if (!order) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-white/30 font-bold uppercase tracking-widest text-center px-6">Pedido no encontrado</p>
    </div>
  );

  const config = statusConfig[order.status as keyof typeof statusConfig];

  const handleCancelConfirm = () => {
    cancelOrder(order.id);
    showToast('Pedido cancelado', 'warning');
    // No navigate away immediately to let status change sink in
    setIsCancelling(false);
  };

  const timelineSteps = [
    { label: 'Pedido confirmado', date: 'Mar 10, 14:32', completed: true },
    { label: 'Carga asignada', date: order.status !== 'confirmado' && order.status !== 'cancelado' ? 'Mar 10, 18:05' : 'pendiente', completed: order.status !== 'confirmado' && order.status !== 'cancelado' },
    { label: 'En tránsito', date: order.status === 'en_transito' || order.status === 'entregado' ? 'Mar 11, 07:20' : 'pendiente', completed: order.status === 'en_transito' || order.status === 'entregado' },
    { label: 'Entregado', date: order.status === 'entregado' ? 'Mar 12, 10:45' : 'pendiente', completed: order.status === 'entregado' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/my-orders')}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Mis Pedidos</span>
        </button>
        <span className="text-[10px] items-center uppercase font-bold text-slate-600 tracking-[0.2em]">
          ID: {order.id.split('-')[0]}...
        </span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter leading-none">
                {order.product}
              </h1>
              <div className={`${config.bg} ${config.border} border px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${config.color}`}>
                {config.label}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                <Package size={16} className="text-slate-500" />
                <span className="text-sm font-bold text-slate-300">{order.qty.toLocaleString()} KG</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                <DollarSign size={16} className="text-emerald-500/60" />
                <span className="text-sm font-bold text-white">{order.total.toLocaleString()} GS</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                <Calendar size={16} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-400">{new Date(order.date).toLocaleDateString('es-PY')}</span>
              </div>
            </div>
          </section>

          {/* Producer Section */}
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">Productor</h2>
            <div className="glass-card p-6 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-white uppercase tracking-tight">{order.producer}</p>
                <p className="text-sm text-slate-500 font-medium">Ubicación verificada</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                <MapPin size={24} />
              </div>
            </div>
          </section>

          {/* Transporte Section */}
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">Transporte</h2>
            {order.status === 'confirmado' || order.status === 'pendiente' ? (
              <div className="glass-card p-6 border border-amber-500/10 flex items-center gap-4">
                <div className="relative">
                    <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                        <Truck size={20} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-950 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">Esperando asignación</p>
                  <p className="text-xs text-slate-500 font-medium">Buscando transportista disponible en la zona...</p>
                </div>
              </div>
            ) : order.status === 'cancelado' ? (
              <div className="glass-card p-6 border border-white/5 text-slate-600 text-sm italic">
                Logística cancelada
              </div>
            ) : (
              <div className="glass-card p-6 border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                      <Truck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tight">Transportes Vera</p>
                      <p className="text-xs text-slate-500 font-medium">Empresa de transporte verificada</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/10">
                    GPS ACTIVO
                  </div>
                </div>

                <div className="flex flex-col gap-1 pl-12">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span className="text-xs font-medium text-slate-500">Origen • Caaguazú</span>
                  </div>
                  <div className="border-l border-white/10 h-6 ml-[3px] my-1" />
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-white uppercase tracking-tight">{order.destination}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Timeline Section */}
          <section className="space-y-6">
            <h2 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">Timeline</h2>
            <div className="space-y-0 relative pl-4">
              <div className="absolute top-2 bottom-2 left-[23px] w-[1px] bg-white/10" />
              {timelineSteps.map((step, i) => (
                <div key={i} className="flex gap-6 pb-8 relative last:pb-0">
                  <div className={`w-4 h-4 rounded-full border-2 mt-1 z-10 ${step.completed ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-slate-950 border-white/10'}`} />
                  <div className="flex flex-col gap-1">
                    <p className={`text-sm font-bold uppercase tracking-tight ${step.completed ? 'text-white' : 'text-white/20'}`}>
                      {step.label}
                    </p>
                    <p className={`text-xs font-medium ${step.completed ? 'text-slate-500' : 'text-white/10 italic'}`}>
                      {step.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Actions Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="glass-card p-6 border border-white/10 space-y-6">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Resumen</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500 underline decoration-white/10 underline-offset-4 decoration-dotted">Producto</span>
                  <span className="text-white text-right">{order.product}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500 underline decoration-white/10 underline-offset-4 decoration-dotted">Cantidad</span>
                  <span className="text-white">{order.qty.toLocaleString()} KG</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500 underline decoration-white/10 underline-offset-4 decoration-dotted">Precio Base</span>
                  <span className="text-white">{(order.total / order.qty).toLocaleString()} GS / KG</span>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white uppercase font-heading">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-500 font-heading leading-none">
                      {order.total.toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-emerald-500/40 mt-1">Guaraníes</p>
                  </div>
                </div>
              </div>

              {/* Cancel Logic */}
              <div className="pt-6 border-t border-white/5">
                {order.status === 'confirmado' ? (
                  <AnimatePresence mode="wait">
                    {!isCancelling ? (
                      <motion.button
                        key="cancel-btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCancelling(true)}
                        className="w-full py-3 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-500/10 transition-colors"
                      >
                        Cancelar Pedido
                      </motion.button>
                    ) : (
                      <motion.div
                        key="confirm-box"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-3"
                      >
                        <p className="text-xs text-center font-bold text-red-400 uppercase tracking-tight">¿Estás seguro?</p>
                        <div className="flex gap-2">
                           <button 
                             onClick={() => setIsCancelling(false)}
                             className="flex-1 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                           >
                             No
                           </button>
                           <button 
                             onClick={handleCancelConfirm}
                             className="flex-[2] py-2 bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-red-500/30 transition-all"
                           >
                             Sí, cancelar
                           </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                       {order.status === 'cancelado' ? 'Pedido ya cancelado' : 'Este pedido no puede cancelarse'}
                    </p>
                    {order.status !== 'cancelado' && (
                        <p className="text-[9px] text-center text-slate-600 italic">Ya ha sido procesado o enviado</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                 <p className="text-[10px] font-medium text-emerald-400/70 leading-relaxed text-center">
                    Los pedidos pagados que sean cancelados serán reembolsados a tu billetera AgroLink en 24hs hábiles.
                 </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
