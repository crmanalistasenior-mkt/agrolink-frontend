import { useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { useUser } from '../hooks/useUser';
import { ArrowLeft, Phone, MapPin, Calendar, Package, CheckCircle2, ShoppingBag } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { SolicitarModal } from '../components/SolicitarModal';
import { useToast } from '../context/ToastContext';

export default function ProducerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { producers, publications, addOrder, updatePublication } = useAppData();
  const { role } = useUser();
  const { showToast } = useToast();
  const [selectedPub, setSelectedPub] = useState<any>(null);

  const producer = producers.find(p => p.id === id);

  if (!producer) return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
      <p className="font-heading text-2xl text-white/20 uppercase tracking-[0.2em]">Productor no encontrado</p>
      <button 
        onClick={() => navigate('/market')} 
        className="text-brand text-sm font-bold uppercase tracking-widest hover:underline flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Volver al Marketplace
      </button>
    </div>
  );

  const activePubs = publications.filter(p => p.producer_id === id && p.is_active);

  const handleConfirmOrder = (requestedQty: number) => {
    if (!selectedPub) return;

    const newOrder = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      product: selectedPub.product_name,
      qty: requestedQty,
      total: requestedQty * selectedPub.price_per_kg,
      status: 'confirmado',
      producer: producer.name,
      destination: 'Asunción',
      publication_id: selectedPub.id
    };
    
    addOrder(newOrder);
    updatePublication(selectedPub.id, {
      stock_kg: selectedPub.stock_kg - requestedQty
    });

    showToast('Pedido enviado correctamente', 'success');
    setSelectedPub(null);
    navigate('/my-orders');
  };

  const initials = producer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-8 pb-12">
      <header>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Volver</span>
        </button>
      </header>

      {/* Producer Hero */}
      <section className="glass-card p-8 border border-white/10 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between bg-gradient-to-br from-white/5 to-transparent">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center text-3xl font-heading text-emerald-500 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                {initials}
            </div>
            <div className="text-center md:text-left space-y-2">
                <h1 className="text-4xl font-heading font-bold text-white uppercase tracking-tighter leading-none">
                    {producer.name}
                </h1>
                <div className="flex flex-col gap-1">
                    <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
                        <MapPin size={14} className="text-brand/60" /> {producer.location}, {producer.department}
                    </p>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
                        <Calendar size={12} /> Miembro desde {producer.member_since}
                    </p>
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[200px]">
            {[
                { label: 'Ventas Totales', value: `${producer.total_sales.toLocaleString()} GS`, color: 'text-emerald-500' },
                { label: 'Pedidos Completados', value: producer.completed_orders, color: 'text-white' },
                { label: 'Publicaciones Activas', value: activePubs.length, color: 'text-blue-400' },
            ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-heading">{stat.label}</span>
                    <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                </div>
            ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <div className="flex flex-wrap gap-3">
        {[
            'Identidad verificada',
            `${producer.completed_orders} pedidos completados`,
            'Miembro activo'
        ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.05)]">
                <CheckCircle2 size={12} />
                {badge}
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Description */}
        <div className="lg:col-span-1 space-y-6">
            <section className="glass-card p-6 border border-white/5 space-y-4">
                <h2 className="text-[10px] uppercase font-bold text-brand tracking-[0.2em]">Sobre Nosotros</h2>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {producer.description}
                </p>
                <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Phone size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Contacto Directo</p>
                        <p className="text-sm font-bold text-emerald-400">{producer.phone}</p>
                    </div>
                </div>
            </section>
        </div>

        {/* Right Column: Active Publications */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold text-white uppercase tracking-tight flex items-center gap-3">
                    <ShoppingBag size={20} className="text-brand" />
                    Productos Disponibles
                    <span className="bg-white/5 px-2 py-0.5 rounded text-xs text-slate-500 font-bold">{activePubs.length}</span>
                </h2>
            </div>

            {activePubs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activePubs.map((pub) => (
                        <div key={pub.id} className="glass-card p-5 border border-white/5 hover:border-emerald-500/20 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-white uppercase tracking-tight group-hover:text-brand transition-colors">{pub.product_name}</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{pub.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-white">{pub.price_per_kg.toLocaleString()} Gs</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">por KG</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center gap-2">
                                    <Package size={14} className="text-brand/60" />
                                    <span className="text-xs font-bold text-slate-400">{pub.stock_kg.toLocaleString()} KG IN STOCK</span>
                                </div>
                                {role === 'buyer' && (
                                    <button 
                                        onClick={() => setSelectedPub(pub)}
                                        className="btn-primary py-2 px-4 text-[10px] uppercase tracking-widest h-9"
                                    >
                                        Solicitar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-600">
                        <ShoppingBag size={24} />
                    </div>
                    <p className="text-sm text-slate-500 italic">Este productor no tiene publicaciones activas en este momento</p>
                </div>
            )}
        </div>
      </div>

      <AnimatePresence>
        {selectedPub && (
          <SolicitarModal 
            publication={selectedPub}
            onClose={() => setSelectedPub(null)}
            onConfirm={handleConfirmOrder}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
