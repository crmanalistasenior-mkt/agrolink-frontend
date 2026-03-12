import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { LoadCard } from '../components/LoadCard';
import { Truck } from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';
import { useAppData } from '../context/AppDataContext';

const FILTERS = ['Todas', 'Disponibles', 'En tránsito'];

export default function Loads() {
  const { role } = useUser();
  const { loads } = useAppData();
  const [filter, setFilter] = useState('Todas');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const filteredLoads = loads.filter((load) => {
    if (filter === 'Disponibles') return load.status === 'publicada';
    if (filter === 'En tránsito') return load.status === 'en_transito';
    return true;
  });

  const availableCount = loads.filter(l => l.status === 'publicada').length;

  return (
    <div className="space-y-8">
      {/* Transporter Banner */}
      {role === 'transporter' && availableCount > 0 && !isLoading && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-emerald-500 p-2 rounded-xl text-slate-950">
            <Truck size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-tight">Oportunidad de Carga</p>
            <p className="text-xs text-emerald-500 font-medium lowercase">Tenés {availableCount} cargas disponibles en tu zona listas para ser aceptadas.</p>
          </div>
        </div>
      )}

      <header className="space-y-6">
        <div>
          <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tighter">Cargas Disponibles</h1>
          <p className="text-slate-500 mt-1 font-medium">Bolsa de fletes activa. Gestioná tu logística en tiempo real.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                filter === f 
                  ? 'bg-brand text-slate-950 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : (
          <>
            {filteredLoads.map((load) => (
              <LoadCard 
                key={load.id} 
                load={load} 
                role={role}
                onAccept={() => {}} 
              />
            ))}

            {filteredLoads.length === 0 && (
              <div className="col-span-full py-20 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-slate-500 italic">
                No se encontraron cargas para este filtro.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
