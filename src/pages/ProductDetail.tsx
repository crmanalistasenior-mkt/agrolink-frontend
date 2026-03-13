import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { useUser } from '../hooks/useUser';
import { ArrowLeft, Package, DollarSign, MapPin, Calendar, User, Info, Scale, ShieldCheck, Truck } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useUser();
  const { publications, addOrder } = useAppData();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(100);

  const pub = publications.find(p => p.id === id);

  if (!pub) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-white/30 font-bold uppercase tracking-widest">Producto no encontrado</p>
    </div>
  );

  const totalPrice = quantity * pub.price_per_kg;

  const handleOrder = () => {
    if (role !== 'buyer') {
      showToast('Debes ser comprador para solicitar productos', 'info');
      return;
    }

    const newOrder = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      product: pub.product_name,
      qty: quantity,
      total: totalPrice,
      status: 'confirmado',
      producer: pub.producer_name,
      destination: 'Asunción (Por defecto)', // Placeholder
      publication_id: pub.id
    };

    addOrder(newOrder);
    showToast('Pedido enviado con éxito', 'success');
    navigate('/my-orders');
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="">
        <button 
          onClick={() => navigate('/market')}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group mb-6"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Marketplace</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Product Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-6">
            <div className="h-64 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-brand/10 to-transparent border border-white/5 relative overflow-hidden flex items-center justify-center text-7xl">
                {pub.category === 'verduras' ? '🥦' : '🌾'}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.1),transparent)]" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <h1 className="font-heading text-5xl font-bold text-white uppercase tracking-tighter leading-none">
                  {pub.product_name}
                </h1>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{pub.category}</span>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${pub.is_active ? 'text-emerald-500' : 'text-slate-500'}`}>
                        {pub.is_active ? 'Disponible' : 'Pausado'}
                    </span>
                </div>
              </div>
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-xs font-bold uppercase tracking-widest">
                En Stock
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3">
                <Package size={18} className="text-slate-500" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Disponible</span>
                    <span className="text-sm font-bold text-slate-300">{pub.stock_kg.toLocaleString()} KG</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3">
                <DollarSign size={18} className="text-emerald-500" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Precio Unitario</span>
                    <span className="text-sm font-bold text-white">{pub.price_per_kg.toLocaleString()} GS/KG</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3">
                <MapPin size={18} className="text-slate-500" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Ubicación</span>
                    <span className="text-sm font-medium text-slate-400">{pub.location_name}</span>
                </div>
              </div>
            </div>
          </section>

          {/* About Producer */}
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] flex items-center gap-2">
              <User size={14} />
              Sobre el Productor
            </h2>
            <div className="glass-card p-6 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400">
                    <User size={24} />
                </div>
                <div>
                    <p className="text-lg font-bold text-white uppercase tracking-tight">{pub.producer_name}</p>
                    <p className="text-sm text-slate-500 font-medium">Productor verificado • {pub.location_name}</p>
                </div>
              </div>
              <Link 
                to={`/producer/${pub.producer_id}`}
                className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline px-4 py-2 bg-white/5 rounded-lg border border-white/10"
              >
                Ver perfil completo →
              </Link>
            </div>
          </section>

          {/* Disponibilidad */}
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] flex items-center gap-2">
              <Calendar size={14} />
              Disponibilidad
            </h2>
            <div className="glass-card p-6 border border-white/5 space-y-6">
                <div>
                    <p className="text-sm font-bold text-white uppercase">Cosecha disponible desde hoy</p>
                    <p className="text-xs text-slate-500">Fecha de publicación: {new Date(pub.created_at).toLocaleDateString('es-PY')}</p>
                </div>
                
                {/* Simple Calendar Mockup */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <span className="text-[10px] font-bold text-white uppercase">Marzo 2026</span>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
                            <span key={d} className="text-[8px] font-bold text-slate-600 mb-2">{d}</span>
                        ))}
                        {Array.from({ length: 31 }).map((_, i) => {
                            const day = i + 1;
                            const isToday = day === new Date().getDate();
                            return (
                                <div 
                                    key={day} 
                                    className={`aspect-square flex items-center justify-center text-[10px] font-bold rounded-lg transition-colors
                                        ${isToday ? 'bg-brand text-slate-950 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'text-slate-500 hover:bg-white/5'}
                                    `}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
          </section>

          {/* Descripción */}
          <section className="space-y-4">
            <h2 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] flex items-center gap-2">
              <Info size={14} />
              Descripción
            </h2>
            <div className="glass-card p-6 border border-white/5">
                <p className="text-sm font-medium text-slate-400 leading-relaxed italic">
                    "Producto fresco directo de finca, cosecha garantizada. Contacto previo a la entrega para coordinar logística. Calidad de exportación directamente a tu puerta."
                </p>
                <div className="mt-6 flex items-center gap-4 text-emerald-500/60">
                    <ShieldCheck size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Garantía de Calidad AgroLink</span>
                </div>
            </div>
          </section>
        </div>

        {/* Right Column: Action Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="glass-card p-8 border border-white/10 space-y-8 bg-gradient-to-b from-[#0f2441] to-[#0a1628]">
              <div className="space-y-1">
                <h3 className="text-[10px] font-bold text-brand uppercase tracking-[0.2em]">Solicitar Producto</h3>
                <p className="text-xs text-slate-500">Completá los datos para realizar el pedido</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cantidad (KG)</label>
                    <span className="text-[10px] font-bold text-slate-500">{quantity} / {pub.stock_kg}</span>
                  </div>
                  <input 
                    type="range"
                    min="1"
                    max={pub.stock_kg}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand"
                  />
                  <input 
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(pub.stock_kg, Math.max(1, Number(e.target.value))))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-brand/40 transition-colors"
                  />
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-400">
                    <span>Precio estimado</span>
                    <span className="text-slate-500">x{quantity} kg</span>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-4xl font-bold text-emerald-500 font-heading leading-none">
                      {totalPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest">Guaraníes</span>
                  </div>
                </div>

                {role === 'buyer' ? (
                  <button 
                    onClick={handleOrder}
                    disabled={!pub.is_active}
                    className="w-full py-4 bg-brand text-slate-950 font-bold uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                  >
                    Solicitar Ahora
                  </button>
                ) : (
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                      Registrate como comprador para solicitar este producto
                    </p>
                  </div>
                )}

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="p-3 bg-white/5 rounded-xl flex flex-col items-center gap-1 border border-white/5">
                        <Scale size={14} className="text-slate-500" />
                        <span className="text-[8px] font-bold text-slate-500 uppercase">Peso Mínimo</span>
                        <span className="text-[10px] font-bold text-white">100 KG</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl flex flex-col items-center gap-1 border border-white/5">
                        <Truck size={14} className="text-slate-500" />
                        <span className="text-[8px] font-bold text-slate-500 uppercase">Logística</span>
                        <span className="text-[10px] font-bold text-white">Coordinada</span>
                    </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                 <p className="text-[9px] font-medium text-emerald-400/50 leading-relaxed text-center italic">
                    Al solicitar, el productor recibirá una notificación instantánea. El pago se coordina una vez confirmada la logística.
                 </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
