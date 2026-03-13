import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, MapPin, Truck, CheckCircle2, Map } from 'lucide-react';


const statusConfig = {
  publicada: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Publicada' },
  asignada: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Asignada' },
  en_transito: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'En Tránsito' },
  entregada: { color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20', label: 'Entregada' },
  entregado: { color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20', label: 'Entregado' }, // For myLoads variant
};

export default function LoadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loads, myLoads, advanceLoadStatus, updateLoadStatus } = useAppData();
  const { showToast } = useToast();

  const load = loads.find(l => l.id === id) || myLoads.find(l => l.id === id);

  if (!load) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-white/30 font-bold uppercase tracking-widest text-center px-6">Carga no encontrada</p>
    </div>
  );

  const getStatusConfig = (status: string) => 
    statusConfig[status as keyof typeof statusConfig] ?? { color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10', label: status };

  const config = getStatusConfig(load.status);

  const handleComplete = () => {
    advanceLoadStatus(load.id);
    showToast('¡Entrega confirmada!', 'success');
  };

  const handleAccept = () => {
    updateLoadStatus(load.id, 'asignada');
    showToast('Carga aceptada. ¡Buen viaje!', 'success');
    navigate('/my-loads');
  };
  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Volver</span>
        </button>
        <span className="text-[10px] items-center uppercase font-bold text-slate-600 tracking-[0.2em]">
          ID: {load.id.split('-')[0]}...
        </span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Route Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter leading-none">
                Detalle de Carga
              </h1>
              <div className={`${config.bg} ${config.border} border px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${config.color}`}>
                {config.label}
              </div>
            </div>

            {/* Visual Route */}
            <div className="glass-card p-6 md:p-10 border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
               <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-center text-center md:text-left">
                  <div className="flex-1 flex flex-col items-center md:items-start gap-2">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Origen</span>
                     <p className="text-2xl font-bold text-white font-heading tracking-tight">{load.origin}</p>
                  </div>
                  <div className="flex-1 w-full flex flex-col items-center gap-2">
                      <div className="w-full flex items-center gap-2 text-slate-500">
                         <div className="h-[2px] bg-white/10 flex-1 rounded-full" />
                         <Truck size={24} className="text-emerald-500" />
                         <div className="h-[2px] bg-white/10 flex-1 rounded-full border-t-2 border-dashed border-white/20" />
                      </div>
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">{load.distance} KM</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center md:items-end gap-2">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Destino</span>
                     <p className="text-2xl font-bold text-white font-heading tracking-tight">{load.destination}</p>
                  </div>
               </div>
            </div>
          </section>

          {/* Contact Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-6 border border-white/5">
              <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mb-4 flex items-center gap-2">
                <Map size={14} /> Retiro
              </h3>
              <p className="text-base font-bold text-white uppercase tracking-tight mb-1">{load.origin}</p>
              <p className="text-sm font-medium text-slate-400 mb-4">Zona rural o punto de acopio verificado.</p>
              <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-widest cursor-pointer hover:underline">
                <MapPin size={12} /> Ver en el mapa
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5">
              <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mb-4 flex items-center gap-2">
                <Map size={14} /> Entrega
              </h3>
              <p className="text-base font-bold text-white uppercase tracking-tight mb-1">{load.destination}</p>
              <p className="text-sm font-medium text-slate-400 mb-4">Punto de entrega del comprador final.</p>
              <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-widest cursor-pointer hover:underline">
                <MapPin size={12} /> Ver en el mapa
              </div>
            </div>
          </section>

          {/* Load Content Details */}
          <section className="glass-card p-6 border border-white/5">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Detalles de Operación</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Peso Total</span>
                   <p className="text-lg font-bold text-white uppercase font-heading">{load.weight.toLocaleString()} kg</p>
                </div>
                <div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Tipo de Carga</span>
                   <p className="text-lg font-bold text-white uppercase font-heading">General</p>
                </div>
                <div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Condiciones</span>
                   <p className="text-lg font-bold text-white uppercase font-heading">Seco</p>
                </div>
                 <div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Fecha Disp.</span>
                   <p className="text-lg font-bold text-white uppercase font-heading">Inmediato</p>
                </div>
            </div>
          </section>
        </div>

        {/* Right Column: Financials & Action */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="glass-card p-6 border border-white/10 space-y-6">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Flete y Pagos</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Distancia</span>
                  <span className="text-white">{load.distance} km</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Peso Base</span>
                  <span className="text-white">{load.weight.toLocaleString()} kg</span>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white uppercase font-heading">Ganancia Neta</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-500 font-heading leading-none">
                      {load.price.toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-emerald-500/40 mt-1">Guaraníes</p>
                  </div>
                </div>
              </div>

              {/* Status Logic / Actions */}
              <div className="pt-6 border-t border-white/5">
                {load.status === 'publicada' ? (
                  <button
                    onClick={handleAccept}
                    className="w-full py-3 bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  >
                    Aceptar Carga
                  </button>
                ) : load.status === 'en_transito' ? (
                  <button
                    onClick={handleComplete}
                    className="w-full py-3 bg-blue-500/10 border border-blue-500/40 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500/20 transition-colors"
                  >
                    Confirmar Entrega
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2">
                    <CheckCircle2 size={16} className={config.color} />
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${config.color}`}>
                       {load.status === 'entregada' || load.status === 'entregado' ? 'Viaje Completado' : 'Carga Asignada'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Helper Alert */}
            <div className={`p-4 rounded-xl border ${load.status === 'en_transito' ? 'bg-blue-500/5 border-blue-500/10' : 'bg-white/5 border-white/10'}`}>
                 <p className={`text-[10px] font-medium leading-relaxed text-center ${load.status === 'en_transito' ? 'text-blue-400/80' : 'text-slate-500'}`}>
                    {load.status === 'publicada' 
                      ? 'Revise bien la ruta y el peso antes de aceptar el contrato de flete.'
                      : load.status === 'en_transito' 
                      ? 'No olvides confirmar la entrega una vez que la carga haya sido recepcionada por el comprador.'
                      : 'Esta carga ya no admite acciones adicionales.'}
                 </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
