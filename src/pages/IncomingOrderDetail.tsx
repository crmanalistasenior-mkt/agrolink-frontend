import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Package, DollarSign, MapPin, Truck, Calendar, User } from 'lucide-react';

const statusConfig = {
  pendiente: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Pendiente' },
  aceptado: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Aceptado' },
  rechazado: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Rechazado' },
};

export default function IncomingOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incomingOrders, acceptIncomingOrder, rejectIncomingOrder } = useAppData();
  const { showToast } = useToast();

  const order = incomingOrders.find(o => o.id === id);

  if (!order) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-white/30 font-bold uppercase tracking-widest text-center px-6">Pedido no encontrado</p>
    </div>
  );

  const getStatusConfig = (status: string) => 
    statusConfig[status as keyof typeof statusConfig] ?? { color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10', label: status };

  const config = getStatusConfig(order.status);

  const handleAccept = () => {
    acceptIncomingOrder(order.id);
    showToast('Pedido aceptado — carga creada', 'success');
  };

  const handleReject = () => {
    rejectIncomingOrder(order.id);
    showToast('Pedido rechazado', 'warning');
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/incoming-orders')}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Pedidos Recibidos</span>
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
                <span className="text-sm font-bold text-slate-300">{(order.qty ?? 0).toLocaleString()} KG</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                <DollarSign size={16} className="text-emerald-500/60" />
                <span className="text-sm font-bold text-white">{(order.total ?? 0).toLocaleString()} GS</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                <Calendar size={16} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-400">
                  {order.date ? new Date(order.date).toLocaleDateString('es-PY') : 'Sin fecha'}
                </span>
              </div>
            </div>
          </section>

          {/* Comprador Section */}
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">Comprador</h2>
            <div className="glass-card p-6 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-white uppercase tracking-tight">{order.buyer_name ?? 'Comprador'}</p>
                <p className="text-sm text-slate-500 font-medium flex items-center gap-1">Destino: <span className="text-white">{order.destination}</span></p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center text-blue-500">
                <User size={24} />
              </div>
            </div>
          </section>

          {/* Logística Section */}
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">Estado Logístico</h2>
            {order.status === 'pendiente' ? (
              <div className="glass-card p-6 border border-amber-500/10 flex items-center gap-4">
                <div className="relative">
                    <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                        <Truck size={20} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-950 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">Esperando tu confirmación</p>
                  <p className="text-xs text-slate-500 font-medium">Aceptá el pedido para publicar la carga en la bolsa de fletes.</p>
                </div>
              </div>
            ) : order.status === 'rechazado' ? (
              <div className="glass-card p-6 border border-white/5 text-slate-600 text-sm italic">
                El pedido fue rechazado y no generó carga.
              </div>
            ) : (
              <div className="glass-card p-6 border border-emerald-500/20 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Carga publicada con éxito</p>
                    <p className="text-xs text-slate-500 font-medium">Los transportistas ya pueden ver esta carga para asignarla.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 text-xs font-bold text-slate-400 bg-white/5 p-3 rounded-lg">
                  <MapPin size={14} className="text-emerald-500" />
                  Origen: Tu Finca <span className="text-brand px-2">→</span> Destino: {order.destination}
                </div>
              </div>
            )}
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
                  <span className="text-slate-500 underline decoration-white/10 underline-offset-4 decoration-dotted">Cantidad pedida</span>
                  <span className="text-white">{(order.qty ?? 0).toLocaleString()} KG</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500 underline decoration-white/10 underline-offset-4 decoration-dotted">Precio Base</span>
                  <span className="text-white">{((order.total ?? 0) / (order.qty || 1)).toLocaleString()} GS / KG</span>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white uppercase font-heading">Total a cobrar</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-500 font-heading leading-none">
                      {(order.total ?? 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-emerald-500/40 mt-1">Guaraníes</p>
                  </div>
                </div>
              </div>

              {/* Accept/Reject Logic */}
              <div className="pt-6 border-t border-white/5">
                {order.status === 'pendiente' ? (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleReject}
                      className="w-full py-3 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-500/10 transition-colors"
                    >
                      Rechazar Pedido
                    </button>
                    <button
                      onClick={handleAccept}
                      className="w-full py-3 bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    >
                      Aceptar y Crear Carga
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${order.status === 'aceptado' ? 'text-emerald-500/80' : 'text-red-500/60'}`}>
                       {order.status === 'aceptado' ? 'Pedido Aceptado' : 'Pedido Rechazado'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${order.status === 'aceptado' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-white/5 border-white/10'}`}>
                 <p className={`text-[10px] font-medium leading-relaxed text-center ${order.status === 'aceptado' ? 'text-emerald-400/70' : 'text-slate-500'}`}>
                    {order.status === 'aceptado' 
                      ? 'Este pedido ya generó una carga y será gestionado por un transportista pronto.'
                      : 'Aceptá el pedido únicamente si dispones del stock y podés preparar la carga para el despacho.'}
                 </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
