import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/cards/ProductCard';
import { useUser } from '../hooks/useUser';
import { SkeletonCard } from '../components/Skeleton';
import { useAppData } from '../context/AppDataContext';
import { ViewToggle, type ViewMode } from '../components/ViewToggle';
import { SolicitarModal } from '../components/SolicitarModal';
import { useToast } from '../context/ToastContext';
import { AnimatePresence } from 'framer-motion';

const FILTERS = ['Todos', 'Verduras', 'Frutas', 'Granos'];

export default function Market() {
  const { role } = useUser();
  const { publications, addOrder, updatePublication } = useAppData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (localStorage.getItem('marketView') as ViewMode) ?? 'grid'
  );
  const [selectedPub, setSelectedPub] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => localStorage.setItem('marketView', viewMode), [viewMode]);

  const handleConfirmOrder = (requestedQty: number) => {
    if (!selectedPub) return;
    const newOrder = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      product: selectedPub.product_name,
      qty: requestedQty,
      total: requestedQty * selectedPub.price_per_kg,
      status: 'confirmado',
      producer: selectedPub.producer_name || 'Productor',
      destination: 'Asunción',
      publication_id: selectedPub.id
    };
    
    addOrder(newOrder);
    updatePublication(selectedPub.id, {
      stock_kg: selectedPub.stock_kg - requestedQty
    });

    showToast('Pedido enviado correctamente', 'success');
    setShowModal(false);
    setSelectedPub(null);
  };

  const filtered = activeCategory === 'todos'
    ? publications
    : publications.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-8">
      <header className="space-y-6">
        <div>
          <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter">Marketplace</h1>
          <p className="text-slate-500 mt-1 font-medium">Encuentra los mejores productos directo de finca.</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const categoryValue = filter.toLowerCase();
              const isActive = activeCategory === categoryValue;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveCategory(categoryValue)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    isActive
                      ? 'bg-brand text-slate-950 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
      </header>

      {viewMode === 'list' && !isLoading ? (
        <div className="flex flex-col gap-2">
          {filtered.map((pub) => (
            <div 
              key={pub.id}
              onClick={() => navigate(`/market/${pub.id}`)}
              className="flex items-center gap-4 px-5 py-3 h-20 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-900/60 to-emerald-950/80 flex items-center justify-center flex-shrink-0 text-xl">
                {pub.category === 'verduras' ? '🥦' : '🌾'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-lg text-white truncate leading-none mb-1">{pub.product_name}</p>
                <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest">{pub.category}</p>
              </div>
              <div className="hidden md:flex items-center text-slate-400 font-medium text-sm min-w-[120px]">
                {pub.location_name}
              </div>
              <div className="hidden md:block text-slate-400 font-medium text-sm min-w-[120px]">
                {pub.stock_kg.toLocaleString()} kg disp.
              </div>
              <div className="text-right min-w-[120px]">
                <span className="font-heading text-xl text-emerald-400">{pub.price_per_kg.toLocaleString()}</span>
                <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest ml-1">Gs</span>
              </div>
              {role === 'buyer' && pub.is_active && (
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedPub(pub); setShowModal(true) }}
                  className="flex-shrink-0 ml-4 px-4 py-2 bg-brand hover:bg-emerald-400 text-slate-950 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-colors h-9"
                >
                  Solicitar
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr items-start">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : (
            filtered.map((pub) => (
              <div 
                key={pub.id}
                onClick={() => navigate(`/market/${pub.id}`)}
                className="cursor-pointer h-full"
              >
                <ProductCard 
                  publication={pub} 
                  role={role} 
                  onAction={() => {}} 
                />
              </div>
            ))
          )}
        </div>
      )}

      <AnimatePresence>
        {showModal && selectedPub && (
          <SolicitarModal 
            publication={selectedPub}
            onClose={() => {
              setShowModal(false);
              setSelectedPub(null);
            }}
            onConfirm={handleConfirmOrder}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
